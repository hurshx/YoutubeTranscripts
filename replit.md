# YouTube Transcript Generator

## Overview
A production-ready web application that extracts transcripts from YouTube videos. Built with React + TypeScript frontend and Spring Boot backend, designed for deployment as a single container.

## Current State
- ✅ Frontend: React 19 + Vite + Tailwind CSS running on port 5000
- ✅ Backend: Spring Boot 3 + Java 17 configured for port 8080
- ✅ CORS configured for cross-origin requests
- ✅ Deployment configuration set up for production build

## Recent Changes (September 28, 2025)
- Configured Vite to bind to 0.0.0.0:5000 for Replit proxy support
- Added CORS configuration to Spring Boot for API requests
- Fixed Tailwind CSS compatibility issue (ring-opacity syntax)
- Set up deployment configuration for autoscale deployment
- Fixed Java compilation error in YouTubeService scope handling

## Project Architecture
- **Frontend**: React SPA with dark theme, responsive design
- **Backend**: REST API with YouTube transcript extraction service
- **Build Process**: Frontend builds into backend's static resources
- **Deployment**: Single JAR file with embedded frontend

## User Preferences
- Dark theme with gradient design
- Clean, minimal interface
- Responsive layout for all devices
- Production-ready configuration

## Development
- Frontend development server: `npm run dev` (port 5000)
- Backend development: `./mvnw spring-boot:run` (port 8080)
- Production build: Frontend → Backend static resources → Single JAR

## Features
- YouTube URL input with validation
- Optional timestamp inclusion toggle
- Copy to clipboard functionality
- Download as text file
- Real-time transcript extraction
- Error handling for various video states