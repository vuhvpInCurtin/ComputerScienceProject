from flask import Flask, render_template

from dataset.dataset import dataset
from extensions import mongo
from data import data_bp
from sensor.sensor import sensor

from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
CORS(app)

app.config['MONGO_URI'] = 'mongodb+srv://vuhvp:Pringles2022@computerscienceproject.wa7xkfg.mongodb.net/ComputerScienceProjectDB?authSource=admin'

mongo.init_app(app)

app.register_blueprint(dataset, url_prefix='/dataset')
app.register_blueprint(sensor, url_prefix='/sensor')
app.register_blueprint(data_bp, url_prefix='/data')


@app.route("/", methods=["GET"])
def index():
    return render_template("base.html")


if __name__ == '__main__':
    app.run()
