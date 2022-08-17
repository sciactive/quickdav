#!/bin/sh

env NODE_ENV="development" npm start > test.log 2>&1
env >> test.log