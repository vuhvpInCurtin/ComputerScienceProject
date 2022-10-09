from flask import Blueprint, request, render_template, json, Response
from models.dataset import Dataset
import pandas as pd

dataset = Blueprint('dataset', __name__)
datasetM = Dataset()


@dataset.route('/', methods=["GET", "POST"])
def index():
    if request.method == 'POST':
        if request.form['button'] == 'Start':
            datasetM.start()
        else:
            datasetM.stop()
    return render_template("dataset.html")


@dataset.route('/upload', methods=['POST'])
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
    datasetM.create(headers, data)

    return (json.dumps({'success': True}), 200, {'content-type': 'application/json'})


@dataset.route("/stream")
def stream():
    return Response(datasetM.stream(), mimetype='text/event-stream')
