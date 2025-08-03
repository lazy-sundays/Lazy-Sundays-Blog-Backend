#!/bin/bash
set -e

# Simple logging without colors (better for cloud platforms)
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

# Function to handle graceful shutdown
cleanup() {
    log "Received shutdown signal, cleaning up..."
    # Kill any background processes
    jobs -p | xargs -r kill 2>/dev/null || true
    log "Cleanup completed"
    exit 0
}

# Set up signal handlers
trap cleanup SIGTERM SIGINT

# Main execution
log "Starting Strapi application initialization..."
log "Node.js version: $(node --version)"
log "NPM version: $(npm --version)"
log "Environment: ${NODE_ENV:-development}"

# Execute the main command
log "Starting Strapi with command: $*"
log "Initialization completed successfully!"

# Execute the passed command
exec "$@"
