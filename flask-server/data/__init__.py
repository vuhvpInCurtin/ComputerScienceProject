from datetime import datetime
from flask import Blueprint, json, render_template, request, redirect, url_for, Response
from extensions import mongo
from bson.objectid import ObjectId
from models.sensor import Sensor

data_bp = Blueprint('data', __name__)
sensor = Sensor()


@data_bp.route('/', methods=["GET", "POST"])
def index():
    data_id = ''
    if request.method == 'POST':
        data_collection = mongo.db.data
        form = request.form
        data = process_data(form)
        item = data_collection.insert_one(data)
        data_id = str(item.inserted_id)

    return render_template("data.html", data_id=data_id)


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
    }


@data_bp.route("/check/<id>")
def check(id):
    data_collection = mongo.db.data
    item = data_collection.find_one({'_id': ObjectId(id)})
    if item:
        sensor.init_range(item['start'], item['end'],
                          item['format'], item['duration'])
        return (json.dumps({'success': True}), 200, {'content-type': 'application/json'})
    else:
        return (json.dumps({'success': False}), 200, {'content-type': 'application/json'})


@data_bp.route("/stream")
def stream():
    if request.headers.get('accept') == 'text/event-stream':
        sensor.start()
        return Response(sensor.stream_range(), mimetype='text/event-stream')
