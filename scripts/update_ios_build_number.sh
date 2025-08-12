#!/bin/bash

set -eo pipefail
set -x

# Function to log messages with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to handle git operations
handle_git_operations() {
    local new_build_number=$1
    log "Configuring git..."
    git config --global user.name "Codemagic CI/CD"
    git config --global user.email "ci@codemagic.io"
    
    # Detect if we're using GitLab or GitHub based on remote URL
    local remote_url=$(git config --get remote.origin.url)
    log "Remote URL: $remote_url"
    
    if [[ "$remote_url" == *"gitlab.com"* ]] || [[ "$remote_url" == *"gitlab"* ]]; then
        # GitLab authentication
        if [[ -n "$GITLAB_TOKEN" ]]; then
            log "Configuring GitLab token authentication..."
            git config --global url."https://oauth2:${GITLAB_TOKEN}@gitlab.com/".insteadOf "https://gitlab.com/"
        elif [[ -n "$GITLAB_PRIVATE_TOKEN" ]]; then
            log "Configuring GitLab private token authentication..."
            git config --global url."https://oauth2:${GITLAB_PRIVATE_TOKEN}@gitlab.com/".insteadOf "https://gitlab.com/"
        else
            log "Warning: GITLAB_TOKEN or GITLAB_PRIVATE_TOKEN not set, skipping git push to avoid authentication errors"
            log "Build number updated locally to $new_build_number but not pushed to remote."
            return 0
        fi
    else
        # GitHub authentication (default)
        if [[ -n "$GITHUB_TOKEN" ]]; then
            log "Configuring GitHub token authentication..."
            git config --global url."https://x-access-token:${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"
        else
            log "Warning: GITHUB_TOKEN not set, skipping git push to avoid authentication errors"
            log "Build number updated locally to $new_build_number but not pushed to remote."
            return 0
        fi
    fi
    
    log "Adding changes to git..."
    git add --verbose app.json

    if ! git diff --staged --quiet; then
        log "Committing and pushing changes..."
        git commit --verbose -m "ci: Set build number to $new_build_number [skip ci]"
        git push --verbose origin "HEAD:$CM_BRANCH"
        log "Successfully updated build number to $new_build_number and pushed to remote."
    else
        log "No build number change to commit."
    fi
}

# Function to validate build number
validate_build_number() {
    local build_number=$1
    if ! [[ "$build_number" =~ ^[0-9]+$ ]]; then
        log "Warning: Build number is not a number: '$build_number'. Defaulting to 0."
        return 0
    fi
    return 1
}

# Cleanup function
cleanup() {
    if [[ -n "$tmp_app_json" && -f "$tmp_app_json" ]]; then
        rm -f "$tmp_app_json"
    fi
}

# Set up cleanup trap
trap cleanup EXIT

# Validate required environment variables
if [[ -z "$APP_STORE_APPLE_ID" ]]; then
    log "Error: APP_STORE_APPLE_ID environment variable is not set."
    exit 1
fi

if [[ -z "$CM_BRANCH" ]]; then
    log "Error: CM_BRANCH environment variable is not set."
    exit 1
fi

# Read current build number from app.json
log "Reading build number from app.json..."
CURRENT_BUILD_NUMBER=$(jq -r '.expo.ios.buildNumber // "0"' app.json)
log "Using build number from app.json: $CURRENT_BUILD_NUMBER"

validate_build_number "$CURRENT_BUILD_NUMBER" && CURRENT_BUILD_NUMBER=0
log "Current build number set to: $CURRENT_BUILD_NUMBER"

# Fetch latest build numbers
log "Fetching latest build numbers from App Store and TestFlight..."
LATEST_APP_STORE_BUILD_NUMBER=$(app-store-connect --verbose get-latest-app-store-build-number "$APP_STORE_APPLE_ID" || echo "0")
LATEST_TESTFLIGHT_BUILD_NUMBER=$(app-store-connect --verbose get-latest-testflight-build-number "$APP_STORE_APPLE_ID" || echo "0")

log "Latest App Store build number: $LATEST_APP_STORE_BUILD_NUMBER"
log "Latest TestFlight build number: $LATEST_TESTFLIGHT_BUILD_NUMBER"

# Determine highest build number
HIGHEST_BUILD_NUMBER=$CURRENT_BUILD_NUMBER

for build_number in "$LATEST_APP_STORE_BUILD_NUMBER" "$LATEST_TESTFLIGHT_BUILD_NUMBER"; do
    if [[ -n "$build_number" ]] && [[ "$build_number" =~ ^[0-9]+$ ]]; then
        if [[ "$build_number" -gt "$HIGHEST_BUILD_NUMBER" ]]; then
            HIGHEST_BUILD_NUMBER=$build_number
        fi
    fi
done

log "Highest build number is $HIGHEST_BUILD_NUMBER."

# Calculate and update new build number
NEW_BUILD_NUMBER=$((HIGHEST_BUILD_NUMBER + 1))
log "New build number will be $NEW_BUILD_NUMBER."

# Update app.json
log "Updating build number in app.json..."
tmp_app_json=$(mktemp)
if ! jq --arg newBuild "$NEW_BUILD_NUMBER" '.expo.ios.buildNumber = $newBuild' app.json > "$tmp_app_json"; then
    log "Error: Failed to update app.json"
    exit 1
fi

if ! mv "$tmp_app_json" app.json; then
    log "Error: Failed to move temporary file to app.json"
    exit 1
fi

log "Build number updated in app.json."

# Handle git operations
handle_git_operations "$NEW_BUILD_NUMBER"
