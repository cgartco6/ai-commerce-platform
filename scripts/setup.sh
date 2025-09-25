#!/bin/bash

# AI Commerce Platform Setup Script
echo "Setting up AI Commerce Platform..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "Creating directories..."
mkdir -p logs
mkdir -p uploads
mkdir -p ai-models/trained-models

# Copy environment file
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "Please edit .env file with your configuration before continuing."
fi

# Build and start containers
echo "Building Docker images..."
docker-compose build

echo "Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 30

# Run database migrations
echo "Running database migrations..."
docker-compose exec backend npm run migrate

# Run initial AI model setup
echo "Setting up initial AI models..."
docker-compose exec ai-worker python scripts/setup_models.py

echo "Setup completed!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3001"
echo "Please check the logs if you encounter any issues: docker-compose logs"
