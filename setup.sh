#!/bin/bash

# Define repo name
REPO_NAME="lens-test-pilot-config"

# Check if the repo already exists
if [ ! -d "$REPO_NAME" ]; then
    git clone -b develop https://github.com/lmnaslimited/$REPO_NAME.git >/dev/null 2>&1
fi

# Change directory and run the upload command silently
cd "$REPO_NAME" || exit
npm run upload >/dev/null 2>&1
