from flask import Flask, render_template, session
from .dataset import dataset_bp
from .sensor import sensor_bp
from .data import data_bp
# from flask_cors import CORS

app = Flask(__name__)
# CORS(app)

app.register_blueprint(dataset_bp, url_prefix='/dataset')
app.register_blueprint(sensor_bp, url_prefix='/sensor')
app.register_blueprint(data_bp, url_prefix='/data')


@app.route("/", methods=["GET"])
def index():
    return render_template("home.html")
