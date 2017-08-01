#!/usr/bin/python
from Adafruit_BME280 import *

# Barometer (and temperature) on BME280

sensor = BME280(mode=BME280_OSAMPLE_8)

inHg = (sensor.read_pressure() / 100 ) * 0.02952998751

print inHg;
