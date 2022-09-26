from email.policy import default
import time
import random
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
    if isinstance(object, np.generic):
        return object.item()

  def stream(self):
    while self.index in range(self.data.shape[0]) and self.isContinued:
      data = dict()
      for header in self.headers:
        data[header] = self.data.at[self.index, header]
      yield "data: {}\n\n".format(json.dumps(data, default=self.np_encoder))
      time.sleep(2)
      self.index += 1

  def start(self):
    self.isContinued = True

  def stop(self):
    self.isContinued = False

class NpEncoder(json.JSONEncoder):
  def default(self, obj):
    if isinstance(obj, np.integer):
      print(obj, 'ob')
      return int(obj)
    if isinstance(obj, np.floating):
      print(obj, 'ob')
      return float(obj)
    return super(NpEncoder, self).default(obj)