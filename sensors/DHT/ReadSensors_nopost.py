#!/usr/bin/python

import sys
import subprocess
import urllib
import urllib2
import datetime


''' *********************************** '''
''' *  The Sensor Reading Section     * '''
''' *********************************** '''

# Process path
SCRIPTDIR="/home/pi/WeatherLab/DHT/";

# Get temperature and humidity
f = float(subprocess.check_output([sys.executable, SCRIPTDIR+"temphum.py","-t"]));
h = float(subprocess.check_output([sys.executable, SCRIPTDIR+"temphum.py","-h"]));


# Get Wind direction
winddir = subprocess.check_output([sys.executable, SCRIPTDIR+"winddir.py"]);
winddir = winddir[:-1];

# Get Pressure
inHg = float(subprocess.check_output([sys.executable, SCRIPTDIR+"pressure.py"]));

# Get Wind Speed
windspeed = float(subprocess.check_output([sys.executable, SCRIPTDIR+"windspd.py"]));

# Get Rain level
# Rain info - Pulls from rain daemon
filecounter="/home/pi/WeatherLab/DHT/counter.dat";
fo = open(filecounter,"r");
rain = float(fo.read(5));
fo.close();


''' *********************************** '''
''' *  Send data to Node server       * '''
''' *********************************** '''
CurrentZIP = 78749;
#url = 'http://drumpf:8080/process_get'
ts = datetime.datetime.now();

print("Temp = {0} *F, Hum = {1} %, Pressure  = {2:0.2f} inHg, Rain = {3:1.3f}, WindSpeed = {4:2.6f}, WindDir = {5}".format(f, h, inHg, rain, windspeed, winddir))

