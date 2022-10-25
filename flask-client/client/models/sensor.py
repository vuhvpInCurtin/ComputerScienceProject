import time
import random
from datetime import datetime, timedelta
from flask import json


class Sensor:
  def __init__(self):
    self.isContinued = True

  def read_temperature(self):
    n = 1
    while (n < 20):
      temperature = random.randrange(35, 39)
      humidity = random.randrange(46, 50)
      ph = random.randrange(5, 8)

      data = Data(temperature, humidity, ph)
      yield "{}".format(data.get_data())
      time.sleep(2.0)
      n += 1

  def start(self):
    self.isContinued = True

  def stop(self):
    self.isContinued = False

  def init_range(self, pStartDate, pEndDate, pFormat, pDuration):
    dformat = '%d/%m/%Y, %H:%M:%S'
    self.startDate = datetime.strptime(pStartDate, dformat)
    self.endDate = datetime.strptime(pEndDate, dformat)
    self.format = pFormat
    self.duration = pDuration
    self.currentTime = datetime.strptime(pStartDate, dformat)

  def init_date(self, pDate, pFormat, pDuration):
    dformat = '%d/%m/%Y, %H:%M:%S'
    self.date = datetime.strptime(pDate, dformat)
    self.format = pFormat
    self.duration = pDuration
    # self.currentTime = datetime.now()

  def stream_range(self):
    delta = None
    if self.format == 'second':
      delta = timedelta(seconds=self.duration)
    if self.format == 'minute':
      delta = timedelta(minutes=self.duration)
    if self.format == 'hour':
      delta = timedelta(hours=self.duration)

    self.currentTime = datetime.now()

    while (self.isContinued and self.currentTime < self.date):
      temperature = random.randrange(35, 39)
      humidity = random.randrange(46, 50)
      ph = random.randrange(5, 8)

      data = Data(temperature, humidity, ph)
      yield "{}".format(data.get_data(self.currentTime))
      # time.sleep(2.0)
      if self.format == 'second':
        time.sleep(self.duration)
      if self.format == 'minute':
        time.sleep(self.duration * 60)
      if self.format == 'hour':
        time.sleep(self.duration * 60 * 60)
      self.currentTime += delta
      if self.currentTime >= self.date:
        self.isContinued = False
        yield "{}".format('no-content')


class Data:
  def __init__(self, temperature, humidity, ph):
    self.temperature = temperature
    self.humidity = humidity
    self.ph = ph

  def get_data(self, time=None):
    timestamp = None
    if time:
      timestamp = time.timestamp() * 1000
    else:
      timestamp = datetime.now().timestamp() * 1000
    data = {
        "temperature": {
            'value': self.temperature,
            'min': 35,
            'max': 39
        },
        "humidity": {
            'value': self.humidity,
            'min': 46,
            'max': 50
        },
        "ph":  {
            'value': self.ph,
            'min': 5,
            'max': 8
        },
        "timestamp":  {
            'value': timestamp,
            'min': 0,
            'max': 1
        }
    }
    return json.dumps(data)
