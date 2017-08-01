#!/usr/bin/python
from time import sleep
from random import randint
import RPi.GPIO as GPIO

INPUT_PIN=18;
GPIO.setmode(GPIO.BCM)
GPIO.setup(INPUT_PIN, GPIO.IN)

RAINUNIT=0.011;
filecounter="/home/pi/WeatherLab/DHT/counter.dat";

def tick(channel):
    fo = open(filecounter,"r");
    readVal = float(fo.read(5));
    fo.close();

    newVal=readVal + RAINUNIT;

    fo = open(filecounter ,"w");
    fo.write(str(newVal));
    fo.close();


GPIO.add_event_detect(INPUT_PIN, GPIO.BOTH, callback=tick, bouncetime=200)

while True:
    sleep(0);
