from flask import Blueprint, request, render_template, json, Response
import pandas as pd
from ..models.dataset import Dataset

dataset_bp = Blueprint('dataset', __name__)
dataset = Dataset()


@dataset_bp.route('/', methods=["GET", "POST"])
def index():
    if request.method == 'POST':
        if request.form['button'] == 'Start':
            dataset.start()
        else:
            dataset.stop()
    return render_template("dataset.html")


@dataset_bp.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    data = None

    try:
        data = pd.read_excel(file)
    except:
        data = pd.read_csv(file)

    if 'Date' in data.columns and 'Time' in data.columns:
        data['Date and Time'] = pd.to_datetime(data['Date'].apply(
            str) + ' ' + data['Time'].apply(str), infer_datetime_format=True)
        del data["Date"], data["Time"]

    headers = list(data.columns.values)
    dataset.create(headers, data)

    return (json.dumps({'success': True}), 200, {'content-type': 'application/json'})


@dataset_bp.route("/stream")
def stream():
    return Response(dataset.stream(), mimetype='text/event-stream')
