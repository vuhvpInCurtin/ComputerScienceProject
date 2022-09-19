from flask import Flask, render_template, request, Response, url_for
from sensor import Sensor

app = Flask(__name__)
sensor = Sensor()

@app.route("/", methods=["GET", "POST"])
def home():
  if request.method == 'POST':
    if request.form['button'] == 'Start':
      sensor.start()
    else:
      sensor.stop()
    return render_template("index.html")
  else:
    return render_template("index.html")

@app.route("/stream")
def read():
  if request.headers.get('accept') == 'text/event-stream':
    return Response(sensor.read_temperature(), content_type='text/event-stream')
  return render_template("index.html")

if __name__ == '__main__':
  app.run(debug=True, port=8080, host='0.0.0.0')