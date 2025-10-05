#!/bin/bash

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

nvm use 20

# Function to gracefully stop Firebase emulators on exit
cleanup() {
  echo "🛑 Stopping Firebase emulators..."
  kill $EMULATOR_PID
  wait $EMULATOR_PID 2>/dev/null
  echo "✅ Emulators stopped gracefully."
  exit 0
}

# Function to wait until a specific port is open
wait_for_port() {
  local host=$1
  local port=$2
  echo "⏳ Waiting for $host:$port to be available..."
  while ! nc -z $host $port; do
    sleep 1 # Wait for 1 second before checking again
  done
  echo "✅ $host:$port is now available!"
}

# Trap CTRL+C (SIGINT) for a clean shutdown
trap cleanup SIGINT SIGTERM

# Start Firebase emulators in the background
firebase emulators:start --project=chess &
EMULATOR_PID=$!

# Wait for Firestore Emulator (127.0.0.1:8086)
wait_for_port "127.0.0.1" 8086

# Seed Firestore database (if you create a populate-firestore.js file)
# echo "🏗️  Seeding Firestore Database..."
# node populate-firestore.js

# Keep script running until terminated
wait $EMULATOR_PID
