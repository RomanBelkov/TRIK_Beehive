#!/bin/sh
#Call this script with one parameter that determines path to store output image

cd /home/root/

/etc/init.d/mjpg-encoder-ov7670.sh start 

./awk_make_photo.sh /run/mjpg-encoder.out.fifo > $1

/etc/init.d/mjpg-encoder-ov7670.sh stop