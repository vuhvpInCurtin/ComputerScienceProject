from datetime import datetime
from flask import Blueprint, json, render_template, request

id = Blueprint('id', __name__)


@id.route('/', methods=["GET", "POST"])
def index():
    return render_template("formid.html")


@id.route("/create", methods=['POST'])
def create():
    form = request.get_json()
    # start = datetime.date(form['start'][:4])
    startInput = [int(x) for x in form['start'].split('-')]
    endInput = [int(x) for x in form['end'].split('-')]
    start = datetime(startInput[0], startInput[1], startInput[2], 0, 0, 0)
    end = datetime(endInput[0], endInput[1], endInput[2], 23, 59, 59)
    # data = Data(start=start, end=end,
    #             format=form['format'], duration=int(form['duration']))
    # db.session.add(data)
    # db.session.commit()
    return (json.dumps({'id': 1}), 200, {'content-type': 'application/json'})

# @app.route("/get-data/<id>")
# def stream_id(id):
#     print(id)
#     # return Response(dataset.stream(), mimetype='text/event-stream')
#     return id
