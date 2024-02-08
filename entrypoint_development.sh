#!/bin/sh

set -e

# Wonder why node_modules are installed in here again although they are already installed at build time?
# This needs to be done to sync node_modules between host and container during development.
npm install
npm start
