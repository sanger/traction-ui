#!/bin/bash

# Usage: ./compile-build.sh <archive_name> <relative_path_to_folder>

set -ev

# Building assets
npm run build:css
npm run build:js --dest $2/public --report

# Storing revision hash
git rev-parse HEAD > $2/REVISION

# Creating tar.gz
tar -zcvf $1 -C $2 .
