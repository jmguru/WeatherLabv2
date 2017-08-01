#!/usr/bin/python

import RPi.GPIO as GPIO
import time
import sys

ind=0;
INPUT_PIN=23;
WINDFACTOR=1.5;

def tick(channel):
    global ind;
    ind = ind + 1;

def main(arg):
    
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(INPUT_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

    GPIO.add_event_detect(INPUT_PIN, GPIO.BOTH, callback=tick)

    try:
        time.sleep (9.5)
        velocity=(ind/10.0)*1.487
        print ("{:3.8f}".format(velocity));
    except:
        pass
    GPIO.cleanup();

if __name__ == "__main__":
    main(sys.argv[0])
