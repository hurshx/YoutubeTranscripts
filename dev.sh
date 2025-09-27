#!/bin/bash

# Development script for YouTube Transcript Generator

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🔧 Starting development environment..."

# Function to cleanup background processes
cleanup() {
    echo "🛑 Stopping development servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend
echo "🚀 Starting Spring Boot backend..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 5

# Start frontend
echo "🎨 Starting React frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Development environment started!"
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:8080/api"
echo "📖 Press Ctrl+C to stop both servers"

# Wait for processes
wait
