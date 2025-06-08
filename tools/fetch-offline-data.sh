#!/bin/sh
# Fetch optional offline data
set -e
node tools/currency-sync.js
node tools/fetch-wiki-images.js
echo "Offline data fetched."
