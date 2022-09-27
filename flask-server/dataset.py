from email.policy import default
import time
from datetime import datetime
from flask import json
import numpy as np

class Dataset:
  def __init__(self):
    self.isContinued = True
    self.index = 0

  def create(self, headers, data):
    self.headers = headers
    self.data = data
    self.isContinued = True
    self.index = 0

  def np_encoder(self, object):
    if isinstance(object, np.integer):
      return int(object)
    elif isinstance(object, np.floating):
      return float(object)
    elif isinstance(object, np.ndarray):
      return object.tolist()
    elif isinstance(object, datetime):
      return object.__str__()

  def stream(self):
    while self.index in range(self.data.shape[0]) and self.isContinued:
      data = dict()
      for header in self.headers:
        data[header] = {
          'value': self.data.at[self.index, header],
          'min': self.data[header].min(),
          'max': self.data[header].max()
        }
      yield "data: {}\n\n".format(json.dumps(data, default=self.np_encoder))
      time.sleep(2)
      self.index += 1
      if self.index == self.data.shape[0]:
        self.isContinued = False
        yield "data: {}\n\n".format('no-content')
    

  def stream2(self):
    print(self.data.shape[0], 'len')
    while self.index < 3:
      data = dict()
      for header in self.headers:
        data[header] = self.data.at[self.index, header]
      print("data: {}\n\n".format(json.dumps(data, default=self.np_encoder)))
      time.sleep(2)
      self.index += 1

  def start(self):
    self.isContinued = True

  def stop(self):
    self.isContinued = False
