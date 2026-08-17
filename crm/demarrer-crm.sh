#!/bin/bash
cd "$(dirname "$0")"
if [ ! -d node_modules ]; then
  echo "Installation des dépendances (première fois, ça peut prendre une minute)..."
  npm install
fi
npm run launch
