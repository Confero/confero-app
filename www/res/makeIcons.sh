#!/bin/sh

if [ $# != 2 ]; then
	echo "./makeIcons <largest-icon-you-have> <prefix>"
	echo "e.g., ./makeIcons conf_1024.png conf"
	exit -1
fi

inFile=$1
prefix=$2

convert -resize 29x29 $inFile "$prefix"@29.png
convert -resize 36x36 $inFile "$prefix"@36.png
convert -resize 40x40 $inFile "$prefix"@40.png
convert -resize 48x48 $inFile "$prefix"@48.png
convert -resize 50x50 $inFile "$prefix"@50.png
convert -resize 57x57 $inFile "$prefix"@57.png
convert -resize 58x58 $inFile "$prefix"@58.png
convert -resize 64x64 $inFile "$prefix"@64.png
convert -resize 72x72 $inFile "$prefix"@72.png
convert -resize 76x76 $inFile "$prefix"@76.png
convert -resize 80x80 $inFile "$prefix"@80.png
convert -resize 96x96 $inFile "$prefix"@96.png
convert -resize 100x100 $inFile "$prefix"@100.png
convert -resize 114x114 $inFile "$prefix"@114.png
convert -resize 120x120 $inFile "$prefix"@120.png
convert -resize 128x128 $inFile "$prefix"@128.png
convert -resize 144x144 $inFile "$prefix"@144.png
convert -resize 152x152 $inFile "$prefix"@152.png
convert -resize 256x256 $inFile "$prefix"@256.png
convert -resize 480x480 $inFile "$prefix"@480.png
convert -resize 512x512 $inFile "$prefix"@512.png
