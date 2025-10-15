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
        git commit --verbose -m "ci: Set Android build number to $new_build_number [skip ci]"
        git push --verbose origin "HEAD:$CM_BRANCH"
        log "Successfully updated Android build number to $new_build_number and pushed to remote."
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
if [[ -z "$PACKAGE_NAME" ]]; then
    log "Error: PACKAGE_NAME environment variable is not set."
    exit 1
fi

if [[ -z "$CM_BRANCH" ]]; then
    log "Error: CM_BRANCH environment variable is not set."
    exit 1
fi

# Read current build number from app.json
log "Reading Android build number from app.json..."
CURRENT_BUILD_NUMBER=$(jq -r '.expo.android.versionCode // "0"' app.json)
log "Using build number from app.json: $CURRENT_BUILD_NUMBER"

validate_build_number "$CURRENT_BUILD_NUMBER" && CURRENT_BUILD_NUMBER=0
log "Current Android build number set to: $CURRENT_BUILD_NUMBER"

# Fetch latest build numbers from Google Play
log "Fetching latest build numbers from Google Play..."
LATEST_GOOGLE_PLAY_BUILD_NUMBER=$(google-play get-latest-build-number --package-name "$PACKAGE_NAME" || echo "0")

log "Latest Google Play build number: $LATEST_GOOGLE_PLAY_BUILD_NUMBER"

# Also check all tracks to get the highest build number
log "Checking all Google Play tracks for highest build number..."
ALL_TRACKS_BUILD_NUMBER=$(google-play get-latest-build-number --package-name "$PACKAGE_NAME" --tracks="internal,alpha,beta,production" || echo "0")
log "Latest build number across all tracks: $ALL_TRACKS_BUILD_NUMBER"

# Determine highest build number
HIGHEST_BUILD_NUMBER=$CURRENT_BUILD_NUMBER

# Check both single track and all tracks build numbers
for build_number in "$LATEST_GOOGLE_PLAY_BUILD_NUMBER" "$ALL_TRACKS_BUILD_NUMBER"; do
    if [[ -n "$build_number" ]] && [[ "$build_number" =~ ^[0-9]+$ ]]; then
        if [[ "$build_number" -gt "$HIGHEST_BUILD_NUMBER" ]]; then
            HIGHEST_BUILD_NUMBER=$build_number
        fi
    fi
done

log "Highest build number is $HIGHEST_BUILD_NUMBER."

# Calculate and update new build number
NEW_BUILD_NUMBER=$((HIGHEST_BUILD_NUMBER + 1))

# If we still get 1 and Google Play says it's already used, use Codemagic's BUILD_NUMBER as fallback
if [[ "$NEW_BUILD_NUMBER" -eq 1 ]] && [[ "$HIGHEST_BUILD_NUMBER" -eq 0 ]]; then
    if [[ -n "$BUILD_NUMBER" ]] && [[ "$BUILD_NUMBER" =~ ^[0-9]+$ ]]; then
        log "Using Codemagic BUILD_NUMBER as fallback: $BUILD_NUMBER"
        NEW_BUILD_NUMBER=$BUILD_NUMBER
    fi
fi

log "New Android build number will be $NEW_BUILD_NUMBER."

# Additional debugging
log "Environment variables:"
log "PACKAGE_NAME: $PACKAGE_NAME"
log "CM_BRANCH: $CM_BRANCH"
log "BUILD_NUMBER: $BUILD_NUMBER"

# Update app.json
log "Updating Android build number in app.json..."
tmp_app_json=$(mktemp)
if ! jq --arg newBuild "$NEW_BUILD_NUMBER" '.expo.android.versionCode = ($newBuild | tonumber)' app.json > "$tmp_app_json"; then
    log "Error: Failed to update app.json"
    exit 1
fi

if ! mv "$tmp_app_json" app.json; then
    log "Error: Failed to move temporary file to app.json"
    exit 1
fi

log "Android build number updated in app.json."
log "Verifying update - current app.json content:"
cat app.json | jq '.expo.android'

# Handle git operations
handle_git_operations "$NEW_BUILD_NUMBER"
