#!/bin/bash

# Usage: ./archive-assets.sh <archive_name> <relative_path_to_folder> <environment>

set -ev

# Building assets
yarn build --mode $3 --dest $2/public

# Storing revision hash
git rev-parse HEAD > $2/REVISION

# Creating tar.gz
tar -zcvf $1 -C $2 .