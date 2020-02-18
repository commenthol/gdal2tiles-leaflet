#!/bin/bash

rm -rf tiles

export GDAL_ALLOW_LARGE_LIBJPEG_MEM_ALLOC=1

python=python3

case $1 in
  mpz)
    $python ../gdal2tiles-multiprocess.py -l -p raster -z 0-5 -w none karta.jpg tiles
    ;;
  mp)
    $python ../gdal2tiles-multiprocess.py -l -p raster -w none karta.jpg tiles
    ;;
  z)
    $python ../gdal2tiles.py -l -p raster -w none karta.jpg -z 0-5 tiles
    ;;
  *)
    $python ../gdal2tiles.py -l -p raster -w none karta.jpg tiles
    ;;
esac
