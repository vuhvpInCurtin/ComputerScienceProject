from datetime import datetime
from flask import Blueprint, json, render_template, request, redirect, url_for, Response
from extensions import mongo
from bson.objectid import ObjectId
from models.sensor import Sensor

data_bp = Blueprint('data', __name__)
ids = dict()


@data_bp.route('/', methods=["GET", "POST"])
def index():
    return render_template("form.html")


@data_bp.route("/create", methods=['POST'])
def create():
    print("The client IP is: {}".format(request.environ['REMOTE_ADDR']))
    print("The client port is: {}".format(request.environ['REMOTE_PORT']))
    print(request.remote_addr)
    data_collection = mongo.db.data
    form = request.get_json()
    data = process_data(form)
    item = data_collection.insert_one(data)
    return (json.dumps({'id': str(item.inserted_id)}), 200, {'content-type': 'application/json'})


@data_bp.route("/send-data", methods=['POST'])
def send_data():
    data_collection = mongo.db.data
    form = request.form
    _id = form['id']
    _address = form['address']
    item = data_collection.find_one({'_id': ObjectId(_id)})
    content = ''
    if item:
        # response = data_collection.update_one(
        #     {"_id": ObjectId(_id)},
        #     {"$set": {"stream.streaming": True, "stream.address": str(_ad)}}
        # )
        if _id not in ids:
            sensor = Sensor()
            sensor.init_range(item['start'], item['end'],
                              item['format'], item['duration'])
            id_item = {
                "sensor": sensor,
                "ipaddress": _address
            }
            ids[_id] = id_item
        else:
            content = 'ID is streaming'
    else:
        content = 'ID not found'
    return render_template("form.html", content=content)


def process_data(form):
    startInput = [int(x) for x in form['start'].split('-')]
    endInput = [int(x) for x in form['end'].split('-')]
    start = datetime(startInput[0], startInput[1], startInput[2], 0, 0, 0)
    end = datetime(endInput[0], endInput[1], endInput[2], 23, 59, 59)
    return {
        'start': start,
        'end': end,
        'format': form['format'],
        'duration': int(form['duration']),
        'stream': {
            'streaming': False,
            'address': None
        }
    }


@data_bp.route("/get-data/<id>")
def stream(id):
    if request.headers.get('accept') == 'text/event-stream':
        if id in ids:
            sensor = ids[id]['sensor']
            sensor.start()
            return Response(sensor.stream_range(), mimetype='text/event-stream')
    else:
        if id in ids:
            return (json.dumps({'streaming': True}), 200, {'content-type': 'application/json'})
        else:
            return (json.dumps({'streaming': False}), 200, {'content-type': 'application/json'})
