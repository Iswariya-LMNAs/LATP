#!/bin/bash

# Define repo name
REPO_NAME="lens-test-pilot-config"

# If inside GitHub Codespaces, configure port visibility
if [ -n "$CODESPACES" ]; then
    echo "🔐 Detected GitHub Codespace. Setting port visibility..."

    # Fetch the first codespace name
    CODESPACE_NAME=$(gh codespace list --limit 1 --json name -q '.[0].name')

    # If no codespace found, exit
    if [ -z "$CODESPACE_NAME" ]; then
        echo "❌ No codespace found."
        exit 1
    fi

    # Set port visibility
    gh codespace ports visibility 8080:private --codespace "$CODESPACE_NAME"
fi

# Check if the repo already exists
if [ ! -d "$REPO_NAME" ]; then
    git clone -b develop https://github.com/lmnaslimited/$REPO_NAME.git >/dev/null 2>&1
fi

# Change directory and run the upload command silently
cd "$REPO_NAME" || exit

# Load nvm
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1090
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
# Use or install Node.js v20
nvm install 20 >/dev/null 2>&1
nvm use 20 >/dev/null 2>&1
npm run upload
npm run upload_testdata
