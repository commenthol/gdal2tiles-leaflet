#!/bin/bash

####
# sample file to convert from png to jpg using imagemagick convert
#

for png in `(find tiles -name "*.png")`
do
  jpg=`echo $png | sed "s/png$/jpg/"`
  echo "--- $png"
  convert $png -quality 80 $jpg
  rm $png
done
