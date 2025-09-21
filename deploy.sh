#!/bin/bash

# YouTube Transcript Generator Deployment Script

set -e

echo "🚀 Deploying YouTube Transcript Generator to Fly.io..."

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo "❌ flyctl is not installed. Please install it from https://fly.io/docs/hands-on/install-flyctl/"
    exit 1
fi

# Check if user is logged in
if ! flyctl auth whoami &> /dev/null; then
    echo "❌ Not logged in to Fly.io. Please run 'flyctl auth login' first."
    exit 1
fi

# Build and deploy
echo "📦 Building and deploying..."
flyctl deploy

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://youtube-transcript-generator.fly.dev"
