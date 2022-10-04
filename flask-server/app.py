import os

from flask import Flask, render_template

from dataset.dataset import dataset
from extensions import mongo
from id.id import id
from sensor.sensor import sensor

# from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)

app.config['MONGO_URI'] = os.environ.get('MONGO_URI')

mongo.init_app(app)

app.register_blueprint(dataset, url_prefix='/dataset')
app.register_blueprint(sensor, url_prefix='/sensor')
app.register_blueprint(id, url_prefix='/id')

@app.route("/", methods=["GET"])
def index():
    return render_template("base.html")


# CORS(app)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
# db = SQLAlchemy(app)
# class Data(db.Model):
#     id = db.Column(db.String, primary_key=True, default=str(uuid.uuid4().hex))
#     start = db.Column(db.DateTime, nullable=False)
#     end = db.Column(db.DateTime, nullable=False)
#     format = db.Column(db.String(10), nullable=False)
#     duration = db.Column(db.Integer, nullable=False)
#     def __repr__(self):
#         return '<ID {}'.format(self.id)
# @app.before_first_request
# def initialize_database():
#     db.create_all()


if __name__ == '__main__':
    app.run()
