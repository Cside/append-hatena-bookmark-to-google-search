#!/bin/sh -x

version=$(jq -r '.version' ./dist/manifest.json)
version_underscore=$(echo $version| sed 's/\./_/g')
date=$(date '+%Y%m%d_%H%M%S')
filename=./releases/${version_underscore}.${date}.zip

git tag $version
git push
git push --tags

mkdir releases;
zip -r $filename ./dist

echo "Upload $filename below:\nhttps://chrome.google.com/webstore/developer/edit/nbcahioceknecihmhhhglhlndlcolhdf"