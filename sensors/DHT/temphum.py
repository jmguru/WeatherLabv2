#!/usr/bin/python

import dhtreader
import getopt, sys
from time import sleep
from retrying import retry

#@retry(wait_random_min=1000, wait_random_max=2000)
def dhtreadit(opts):
    AM2302 = 22;
    dev_type = AM2302;
    dhtpin = 4;
    t, h = dhtreader.read(dev_type, dhtpin);
    t = (t*9/5)+32
    for o, a in opts:
        if o == "-h":
            print h;
        elif o == "-t":
            print t;
def main():

    # Reads sensor and prints either humidity or temperature readings
    # depending on the option passed (-t or -h)

    try:
        opts, args = getopt.getopt(sys.argv[1:], ":ht")
    except getopt.GetoptError as err:
        print 'wrong!!';
        sys.exit(2);

    dhtreader.init();
    dhtreadit(opts);


if __name__ == "__main__":
    main()
