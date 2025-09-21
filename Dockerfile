# Multi-stage build for YouTube Transcript Generator

# Stage 1: Build frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY frontend/ ./

# Build the frontend
RUN npm run build

# Stage 2: Build backend
FROM maven:3.9-openjdk-17-slim AS backend-builder

WORKDIR /app

# Copy pom.xml first for better caching
COPY backend/pom.xml ./

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY backend/src ./src

# Copy frontend build from previous stage
COPY --from=frontend-builder /app/frontend/dist ./src/main/resources/static

# Build the application
RUN mvn clean package -DskipTests

# Stage 3: Runtime
FROM openjdk:17-jre-slim

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy the built JAR from the builder stage
COPY --from=backend-builder /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/api/health || exit 1

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
