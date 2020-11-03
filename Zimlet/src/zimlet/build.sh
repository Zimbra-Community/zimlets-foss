#!/bin/bash

IFS=$'\n'

for f in $(find . -mindepth 1 -maxdepth 1 -type d); do
  zip -r "$f" "$f"
done
