import time
import random
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

class Data:
  def __init__(self, temperature, humidity, ph):
    self.temperature = temperature
    self.humidity = humidity
    self.ph = ph

  def get_data(self):
    data = {
      "temperature": self.temperature,
      "humidity": self.humidity,
      "ph": self.ph,
    }
    return json.dumps(data)