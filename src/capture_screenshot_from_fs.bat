@echo off
:: Farming Simulator 19
ffmpeg -y -f gdigrab -i title="Farming Simulator 19" -pix_fmt rgb24 -vframes 1 -q:v 2 -vcodec png -f image2 pipe:1