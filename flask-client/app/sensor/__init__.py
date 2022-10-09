from flask import Blueprint, request, render_template, Response

sensor_bp = Blueprint('sensor', __name__)


@sensor_bp.route('/')
def index():
    return render_template("sensor.html")
