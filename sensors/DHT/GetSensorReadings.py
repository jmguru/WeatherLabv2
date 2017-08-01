#!/usr/bin/env python
# -*- coding:utf-8 -*-

import sys
import subprocess
import dhtreader
import urllib
import urllib2
import datetime
from Adafruit_BME280 import *

# Temperature and Humidity Sensor Stuff
DHT11 = 11
DHT22 = 22
AM2302 = 22
CurrentZIP = 78749

url = 'http://gigi:8080/process_get'
filecounter="/home/pi/WeatherLab/Rain/counter.dat"

dhtreader.init()

dev_type = AM2302
dhtpin = 4

print("using pin #{0}".format(dhtpin))
ts = datetime.datetime.now();

t, h = dhtreader.read(dev_type, dhtpin)

# Barometer (and temperature) Sensor Stuff

sensor = BME280(mode=BME280_OSAMPLE_8)

inHg = (sensor.read_pressure() / 100 ) * 0.02952998751

# Rain info
fo = open(filecounter,"r");
rain = float(fo.read(5));
fo.close();


## Windspeed
windspeed = float(subprocess.check_output([sys.executable, "windspd.py"]));

## Wind Direction
windir = float(subprocess.check_output([sys.executable, "winddir.py"]));

# POST the data
if t and h and inHg:
    f = (t*9/5)+32
    values = {'zip' : CurrentZIP,
          'ts' : ts,
          'temp' : f,
          'hum'  : h,
          'bar' : inHg,
          'rain' : rain,
          'wspd' : windspeed,
          'wdir' : winddir}
    data = urllib.urlencode(values)
    req = urllib2.Request(url,data)
    response = urllib2.urlopen(url + '?' + data)
    results = response.read()
    print("Temp = {0} *F, Hum = {1} %, Pressure  = {2:0.2f} inHg, Rain = {3:1.3f}, WindSpeed = {4:2.6f}, WindDir = {5}".format(f, h, inHg, rain, windspeed, windir))
else:
    print("Failed to read from sensor, maybe try again?");
