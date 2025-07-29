#!/bin/bash
set -e

# Simple logging without colors (better for cloud platforms)
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

# Function to wait for database with timeout
wait_for_db() {
    local host="${DATABASE_HOST}"
    local port="${DATABASE_PORT:-5432}"
    local max_attempts=30
    local attempt=1

    if [ -z "$host" ]; then
        log "No DATABASE_HOST specified, skipping database wait"
        return 0
    fi

    log "Waiting for database at ${host}:${port}..."

    # Check if netcat is available
    if ! command -v nc >/dev/null 2>&1; then
        log "netcat not available, skipping database connectivity check"
        return 0
    fi

    while [ $attempt -le $max_attempts ]; do
        if nc -z "$host" "$port" 2>/dev/null; then
            log "Database is available!"
            return 0
        fi
        
        log "Database not ready yet (attempt $attempt/$max_attempts). Waiting 2 seconds..."
        sleep 2
        attempt=$((attempt + 1))
    done

    error "Database is not available after $max_attempts attempts"
    # Don't exit - let Strapi handle the connection error
    log "Continuing startup - Strapi will handle database connection"
    return 0
}

# Function to ensure required directories exist
ensure_directories() {
    log "Ensuring required directories exist..."
    
    directories=(
        "public/uploads"
        ".strapi"
    )
    
    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            log "Creating directory: $dir"
            mkdir -p "$dir"
        fi
    done
    
    # Set proper permissions (ignore errors)
    chmod -R 755 public/uploads 2>/dev/null || true
    
    log "Directory structure verified"
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

# Ensure directories exist
ensure_directories

# Wait for database if DATABASE_HOST is set
if [ -n "$DATABASE_HOST" ]; then
    wait_for_db
fi

# Execute the main command
log "Starting Strapi with command: $*"
log "Initialization completed successfully!"

# Execute the passed command
exec "$@"
