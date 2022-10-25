import os

import socketio
from bson.objectid import ObjectId
from flask import Flask, render_template, session

from .extensions import mongo
from .models.sensor import Sensor

sensor = Sensor()


def create_sensor():
    data_collection = mongo.db.data
    item = data_collection.find_one({'_id': ObjectId(os.environ.get('ID'))})
    if not item:
        print("ID does not exist")
    else:
        print("ID ok")
        sensor.init_date(item['date'], item['format'], item['duration'])


def create_socket():
    sio = socketio.Client(engineio_logger=True)

    @sio.on('connected')
    def on_connected():
        print('Server connected')

    # @sio.on('joined')
    # def on_joined():
    #     print('joined')

    @sio.on('request_stream')
    def on_request_stream():
        for i in sensor.stream_range():
            sio.emit('data', i)

    sio.connect('http://{}:{}'.format(os.environ.get('SERVER_IP'),
                os.environ.get('SERVER_PORT')))
    sio.emit('join', {'name': 'flask-client', 'room': os.environ.get('ID')})
    sio.wait()


def create_app():
    app = Flask(__name__)
    app.config['MONGO_URI'] = 'mongodb+srv://vuhvp:Pringles2022@computerscienceproject.wa7xkfg.mongodb.net/ComputerScienceProjectDB?authSource=admin'
    mongo.init_app(app)
    create_sensor()
    create_socket()

    return app
