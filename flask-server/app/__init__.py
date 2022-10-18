from flask import Flask, render_template, session
from .dataset import dataset_bp
from .sensor import sensor_bp
from .data import data_bp
from flask_socketio import SocketIO, emit, send, join_room, leave_room
import logging
from .extensions import mongo

app = Flask(__name__)
app.config['SECRET_KEY'] = 'vuhvp'
app.config['MONGO_URI'] = 'mongodb+srv://vuhvp:Pringles2022@computerscienceproject.wa7xkfg.mongodb.net/ComputerScienceProjectDB?authSource=admin'
mongo.init_app(app)
socketio = SocketIO(app)

app.register_blueprint(dataset_bp, url_prefix='/dataset')
app.register_blueprint(sensor_bp, url_prefix='/sensor')
app.register_blueprint(data_bp, url_prefix='/data')


@app.route("/", methods=["GET"])
def index():
    return render_template("home.html")


@socketio.on('connection')
def on_connection():
    print("Client connected")
    emit('connected')


@socketio.on('join')
def on_join(data):
    room = data['room']
    join_room(room)
    emit('joined')


@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(username + ' has left the room.', to=room)


if __name__ == '__main__':
    socketio.run(app)
