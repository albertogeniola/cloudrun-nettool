#!/bin/sh
gunicorn --bind 0.0.0.0:8080 -w 2 main:app