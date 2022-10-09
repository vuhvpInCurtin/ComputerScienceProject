from flask import Blueprint, request, render_template, Response
import os

data_bp = Blueprint('data', __name__)


@data_bp.route('/')
def index():
    return render_template("data.html", server_ip=os.environ.get('SERVER_IP'), server_port=os.environ.get('SERVER_PORT'))
