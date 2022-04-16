#!/bin/sh
gunicorn --bind 0.0.0.0:$PORT -w 2 main:app -t $REQUEST_TIMEOUT