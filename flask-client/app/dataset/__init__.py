from flask import Blueprint, request, render_template, Response
import os

dataset_bp = Blueprint('dataset', __name__)


@dataset_bp.route('/')
def index():
    return render_template("dataset.html", server_ip=os.environ.get('SERVER_IP'), server_port=os.environ.get('SERVER_PORT'))
