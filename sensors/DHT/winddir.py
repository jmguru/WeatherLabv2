#!/usr/bin/python
import json
import time
import Adafruit_ADS1x15

adc = Adafruit_ADS1x15.ADS1015();
GAIN = 1;

# Minimum/Maximum ADC output values for wind vane
#MAXADC = 2047;
MINADC=342;
MAXADC=1357;

# Minimum/Maximum voltage output values for wind vane
MINVVAL=.32;
MAXVVAL=4.78;


def find_nearest(dict,value):
    # Create a sorted list of voltage keys
    voltkeys = list(dict.keys());

    # Sort the bloody thing
    vkeys2 = sorted([float(numeric_string) for numeric_string in voltkeys]);

    # Get the index of the closest value
    index = min(range(len(vkeys2)), key=lambda i: abs(vkeys2[i]-value))

    # Now get the actual list value
    closest_voltage = vkeys2[index];

    return closest_voltage;


# Arduino map(x,a,b,c,d) like function
def valmap (x, in_min, in_max, out_min, out_max):
    return float((x-in_min) * (out_max-out_min) / (in_max-in_min) + out_min)

SCRIPTDIR='/home/pi/WeatherLab/DHT/';
with open (SCRIPTDIR+'windir.dat') as data_file:
    dirvolt=json.load(data_file)

value=0.00;
inVolts=0.00;
nval=0.00;


# Read the value from the analog out channel 0 from ADC

value = adc.read_adc(0, gain=GAIN);

# Get the voltage value directly proportional to ADC/volt ratio
nval=valmap(value,MINADC,MAXADC,MINVVAL,MAXVVAL);

# Find the nearest value in our dictionary
nearVal_float = find_nearest(dirvolt,nval);

# Format it to make sure it fits the keys in the dict
nearVal_str = "{:3.2f}".format(nearVal_float);

# Get the value from the key in the dict which is wind direction
wdir = dirvolt[nearVal_str];

print wdir;
