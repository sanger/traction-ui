#!/bin/bash

# Usage: ./compile-build.sh <archive_name> <relative_path_to_folder>

set -ev

# Building assets
npm run build

# Storing revision hash
git rev-parse HEAD > REVISION
git tag -l --points-at HEAD --sort -version:refname | head -1 > TAG
git rev-parse --abbrev-ref HEAD > BRANCH
echo 'Compiling tar.gz'

# Creating tar.gz
tar -zcvf /tmp/release.tar.gz ./
mv /tmp/release.tar.gz ./release.tar.gz
echo 'Release complete!'
echo `pwd`/release.tar.gz
