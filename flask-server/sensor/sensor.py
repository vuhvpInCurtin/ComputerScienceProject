from flask import Blueprint, request, render_template, Response
from models.sensor import Sensor

sensor = Blueprint('sensor', __name__)
sensorM = Sensor()


@sensor.route('/', methods=["GET", "POST"])
def index():
    if request.method == 'POST':
        if request.form['button'] == 'Start':
            sensor.start()
        else:
            sensor.stop()
    return render_template("sensor.html")


@sensor.route("/stream")
def stream():
    return Response(sensor.read_temperature(), mimetype='text/event-stream')
