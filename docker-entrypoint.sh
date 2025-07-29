#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}" >&2
}

success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] SUCCESS: $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Function to wait for database
wait_for_db() {
    local host="${DATABASE_HOST:-localhost}"
    local port="${DATABASE_PORT:-5432}"
    local max_attempts=30
    local attempt=1

    log "Waiting for database at ${host}:${port}..."

    while [ $attempt -le $max_attempts ]; do
        if nc -z "$host" "$port" 2>/dev/null; then
            success "Database is available!"
            return 0
        fi
        
        log "Database not ready yet (attempt $attempt/$max_attempts). Waiting 2 seconds..."
        sleep 2
        attempt=$((attempt + 1))
    done

    error "Database is not available after $max_attempts attempts"
    return 1
}

# Function to check database connection using Node.js
check_db_connection() {
    log "Testing database connection..."
    
    node -e "
        const { Client } = require('pg');
        const client = new Client({
            connectionString: process.env.DATABASE_URL || undefined,
            host: process.env.DATABASE_HOST || 'localhost',
            port: process.env.DATABASE_PORT || 5432,
            database: process.env.DATABASE_NAME || 'strapi',
            user: process.env.DATABASE_USERNAME || 'strapi',
            password: process.env.DATABASE_PASSWORD || 'strapi',
            ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
        });
        
        client.connect()
            .then(() => {
                console.log('Database connection successful');
                return client.end();
            })
            .then(() => process.exit(0))
            .catch(err => {
                console.error('Database connection failed:', err.message);
                process.exit(1);
            });
    "
    
    if [ $? -eq 0 ]; then
        success "Database connection test passed!"
        return 0
    else
        error "Database connection test failed!"
        return 1
    fi
}

# Function to run database migrations
run_migrations() {
    log "Checking for pending database migrations..."
    
    # Check if this is a fresh installation or if migrations are needed
    if [ "$NODE_ENV" = "production" ]; then
        log "Running in production mode - checking migration status..."
        
        # Try to run migrations (Strapi will handle if they're needed)
        if npm run strapi -- db:migrate 2>/dev/null; then
            success "Database migrations completed successfully"
        else
            warn "Migration command not available or no migrations needed"
        fi
    else
        log "Running in development mode - skipping automatic migrations"
    fi
}

# Function to create admin user if needed
create_admin_user() {
    if [ -n "$ADMIN_EMAIL" ] && [ -n "$ADMIN_PASSWORD" ] && [ -n "$ADMIN_FIRSTNAME" ] && [ -n "$ADMIN_LASTNAME" ]; then
        log "Creating admin user..."
        
        node -e "
            const strapi = require('@strapi/strapi');
            
            async function createAdmin() {
                try {
                    const app = await strapi().load();
                    
                    const adminUsers = await strapi.admin.services.user.findMany();
                    if (adminUsers.length === 0) {
                        console.log('No admin users found, creating initial admin...');
                        
                        const admin = await strapi.admin.services.user.create({
                            email: process.env.ADMIN_EMAIL,
                            firstname: process.env.ADMIN_FIRSTNAME,
                            lastname: process.env.ADMIN_LASTNAME,
                            password: process.env.ADMIN_PASSWORD,
                            isActive: true,
                            roles: [1] // Super Admin role
                        });
                        
                        console.log('Admin user created successfully:', admin.email);
                    } else {
                        console.log('Admin users already exist, skipping creation');
                    }
                    
                    await app.destroy();
                    process.exit(0);
                } catch (error) {
                    console.error('Error creating admin user:', error.message);
                    process.exit(1);
                }
            }
            
            createAdmin();
        " || warn "Could not create admin user automatically"
    else
        log "Admin user environment variables not set, skipping admin creation"
    fi
}

# Function to ensure required directories exist
ensure_directories() {
    log "Ensuring required directories exist..."
    
    directories=(
        "public/uploads"
        ".strapi"
        "build"
    )
    
    for dir in "${directories[@]}"; do
        if [ ! -d "$dir" ]; then
            log "Creating directory: $dir"
            mkdir -p "$dir"
        fi
    done
    
    # Set proper permissions
    chmod -R 755 public/uploads 2>/dev/null || true
    
    success "Directory structure verified"
}

# Function to validate environment variables
validate_environment() {
    log "Validating environment configuration..."
    
    # Check if we have database configuration
    if [ -n "$DATABASE_HOST" ] || [ -n "$DATABASE_URL" ]; then
        log "Database configuration detected"
        
        # Check for required database variables (if not using DATABASE_URL)
        if [ -z "$DATABASE_URL" ]; then
            required_db_vars=("DATABASE_HOST" "DATABASE_NAME" "DATABASE_USERNAME" "DATABASE_PASSWORD")
            for var in "${required_db_vars[@]}"; do
                if [ -z "${!var}" ]; then
                    error "Required database variable $var is not set (DATABASE_URL not provided)"
                    exit 1
                fi
            done
        fi
    else
        log "No database configuration found - using default SQLite"
    fi
    
    # Check for Strapi secrets in production
    if [ "$NODE_ENV" = "production" ]; then
        strapi_secrets=("APP_KEYS" "API_TOKEN_SALT" "ADMIN_JWT_SECRET" "JWT_SECRET")
        missing_secrets=()
        
        for var in "${strapi_secrets[@]}"; do
            if [ -z "${!var}" ]; then
                missing_secrets+=("$var")
            fi
        done
        
        if [ ${#missing_secrets[@]} -gt 0 ]; then
            warn "Missing Strapi secrets in production: ${missing_secrets[*]}"
            warn "Consider setting these for security: ${missing_secrets[*]}"
        else
            log "All Strapi secrets are configured"
        fi
    fi
    
    success "Environment validation completed"
}

# Function to handle graceful shutdown
cleanup() {
    log "Received shutdown signal, cleaning up..."
    
    # Kill any background processes
    jobs -p | xargs -r kill
    
    log "Cleanup completed"
    exit 0
}

# Set up signal handlers
trap cleanup SIGTERM SIGINT

# Main execution
main() {
    log "Starting Strapi application initialization..."
    log "Node.js version: $(node --version)"
    log "NPM version: $(npm --version)"
    log "Environment: ${NODE_ENV:-development}"
    
    # Validate environment
    validate_environment
    
    # Ensure directories exist
    ensure_directories
    
    # Wait for database if in production or if DATABASE_HOST is set
    if [ "$NODE_ENV" = "production" ] || [ -n "$DATABASE_HOST" ]; then
        wait_for_db
        check_db_connection
        run_migrations
        create_admin_user
    else
        log "Skipping database checks in development mode"
    fi
    
    # Execute the main command
    log "Starting Strapi with command: $*"
    success "Initialization completed successfully!"
    
    # Execute the passed command
    exec "$@"
}

# Check if we're being sourced or executed
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi
