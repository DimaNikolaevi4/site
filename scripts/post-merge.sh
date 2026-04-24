#!/bin/bash
set -e

if [ -f package.json ]; then
  npm install --no-audit --no-fund
fi
