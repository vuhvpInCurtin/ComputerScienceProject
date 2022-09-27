from flask import Flask, request, render_template, Response, json
from sensor import Sensor
from dataset import Dataset
from flask_cors import CORS
import pandas as pd
import time

app = Flask(__name__)
CORS(app)
sensor = Sensor()
dataset = Dataset()

@app.route("/", methods=["GET"])
def index():
  return render_template("base.html")

@app.route("/sensor", methods=["GET", "POST"])
def sensor_view():
  if request.method == 'POST':
    if request.form['button'] == 'Start':
      sensor.start()
    else:
      sensor.stop()
  return render_template("sensor.html")

@app.route("/dataset", methods=["GET", "POST"])
def dataset_view():
  if request.method == 'POST':
    if request.form['button'] == 'Start':
      dataset.start()
    else:
      dataset.stop()
  return render_template("dataset.html")

@app.route("/stream-sensor")
def stream_sensor():
  return Response(sensor.read_temperature(), mimetype='text/event-stream')

@app.route("/stream-dataset")
def stream_dataset():
  print("Connect in dataset")
  return Response(dataset.stream(), mimetype='text/event-stream')

@app.route('/upload', methods = ['POST'])
def upload_file():
  file = request.files['file']
  data = pd.read_excel(file)
  headers = list(data.columns.values)
  dataset.create(headers, data)
  # dataset.stream()

  print(list(data.columns.values))
 
  return (json.dumps({'success': True}), 200, {'content-type': 'application/json'})

if __name__ == '__main__':
  app.run(debug=True, port=8080, host='0.0.0.0')