#!/bin/bash

BRANCH=$(git symbolic-ref --short HEAD)
MAIN_BRANCH="master"

if [ $BRANCH == $MAIN_BRANCH ]; then
  codeclimate-test-reporter < coverage/lcov.info
fi
