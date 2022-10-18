from flask import Blueprint, request, render_template, Response
from ..extensions import mongo
from datetime import datetime
from bson.objectid import ObjectId
import os
# from flask_socketio import SocketIO, emit, send, join_room, leave_room


data_bp = Blueprint('data', __name__)


@data_bp.route('/', methods=["GET", "POST"])
def index():
    data_id = ''
    if request.method == 'POST':
        data_collection = mongo.db.data
        form = request.form
        data = process_data(form)
        item = data_collection.insert_one(data)
        data_id = str(item.inserted_id)

    return render_template("create.html", data_id=data_id)


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


@data_bp.route('/id', methods=["GET", "POST"])
def fromid():
    from .. import socketio

    data_id = ''
    error = ''
    if request.method == 'POST':
        form = request.form
        data_id = form['data_id']

        data_collection = mongo.db.data
        item = data_collection.find_one({'_id': ObjectId(data_id)})

        if item:
            print(item, 'item')
            socketio.emit('request_join', {'data_id': str(item['_id'])})
        else:
            error = 'ID not found'

    return render_template("data.html", data_id=data_id, error=error)


@data_bp.route('/stream',)
def stream():
    from .. import socketio

    data_id = ''
    error = ''
    if request.method == 'POST':
        form = request.form
        data_id = form['data_id']

        data_collection = mongo.db.data
        item = data_collection.find_one({'_id': ObjectId(data_id)})

        if item:
            print(item, 'item')
            socketio.emit('request_join', {'data_id': str(item['_id'])})
        else:
            error = 'ID not found'

    return render_template("data.html", data_id=data_id, error=error)
