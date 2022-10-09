import time
import random
from datetime import datetime, timedelta
from flask import json

class Sensor:
  def __init__(self):
    self.isContinued = False

  def read_temperature(self):
    while(self.isContinued):
      temperature=random.randrange(35,39)
      humidity=random.randrange(46,50)
      ph=random.randrange(5,8)

      data = Data(temperature, humidity, ph)
      yield "data: {}\n\n".format(data.get_data())
      time.sleep(2.0)

  def start(self):
    self.isContinued = True

  def stop(self):
    self.isContinued = False

  def init_range(self, pStartDate, pEndDate, pFormat, pDuration):
    self.startDate = pStartDate
    self.endDate = pEndDate
    self.format = pFormat
    self.duration = pDuration
    self.currentTime = pStartDate

  def stream_range(self):
    delta = None
    if self.format == 'second':
      delta = timedelta(seconds=self.duration)
    if self.format == 'minutes':
      delta = timedelta(minutess=self.duration)
    if self.format == 'hour':
      delta = timedelta(hours=self.duration)

    while (self.isContinued and self.currentTime < self.endDate):
      temperature = random.randrange(35, 39)
      humidity = random.randrange(46, 50)
      ph = random.randrange(5, 8)

      data = Data(temperature, humidity, ph)
      yield "data: {}\n\n".format(data.get_data(self.currentTime))
      time.sleep(2.0)
      self.currentTime += delta
      if self.currentTime >= self.endDate:
        self.isContinued = False
        yield "data: {}\n\n".format('no-content')


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