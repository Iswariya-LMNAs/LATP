#!/bin/bash

# Define repo name
REPO_NAME="lens-test-pilot-config"

# If inside GitHub Codespaces, configure port visibility
if [ -n "$CODESPACES" ]; then
    echo "🔐 Detected GitHub Codespace. Setting port visibility..."

    # Use the existing CODESPACE_NAME (this should already be set in GitHub Codespaces)
    CODESPACE_NAME=$CODESPACE_NAME

    # If no codespace name found, exit
    if [ -z "$CODESPACE_NAME" ]; then
        echo "❌ No codespace found."
        exit 1
    fi

    # Set port visibility to public (replace 8080 with your specific port if needed)
    gh codespace ports visibility 8080:public --codespace "$CODESPACE_NAME"

    echo "✅ Port visibility set to public for codespace: $CODESPACE_NAME"

    # Find container ID for container whose name starts with 'lens-backend'
    CONTAINER_ID=$(docker ps --filter "name=lens-backend" --format "{{.ID}}" | head -n 1)

    if [ -z "$CONTAINER_ID" ]; then
        echo "❌ No container found with name starting with 'lens-backend'"
        exit 1
    fi

    # Run command inside the container
    docker exec -it "$CONTAINER_ID" bench set-config -g server_script_enabled 1

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
npm run upload_testlab_setup
npm run upload_testdata
echo "Installing X virtual framebuffer for running graphical applications in a headless environment"
sudo apt-get update && sudo apt-get install -y xvfb
