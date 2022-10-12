from flask import Flask, render_template

from .dataset import dataset_bp
from .extensions import mongo
from .data import data_bp
from .sensor import sensor_bp

from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config['MONGO_URI'] = 'mongodb+srv://vuhvp:Pringles2022@computerscienceproject.wa7xkfg.mongodb.net/ComputerScienceProjectDB?authSource=admin'

mongo.init_app(app)

app.register_blueprint(dataset_bp, url_prefix='/dataset')
app.register_blueprint(sensor_bp, url_prefix='/sensor')
app.register_blueprint(data_bp, url_prefix='/data')


@app.route("/", methods=["GET"])
def index():
    return render_template("base.html")
