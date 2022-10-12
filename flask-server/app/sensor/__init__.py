from flask import Blueprint, request, render_template, Response
from ..models.sensor import Sensor

sensor_bp = Blueprint('sensor', __name__)
sensor = Sensor()


@sensor_bp.route('/', methods=["GET", "POST"])
def index():
    if request.method == 'POST':
        if request.form['button'] == 'Start':
            sensor.start()
        else:
            sensor.stop()
    return render_template("sensor.html")


@sensor_bp.route("/stream")
def stream():
    return Response(sensor.read_temperature(), mimetype='text/event-stream')
