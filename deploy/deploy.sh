#!/bin/bash

# SVEC-CMS Production Deployment Script
# This script pulls the latest Docker image from Docker Hub and deploys it

echo "🚀 Deploying SVEC-CMS from Docker Hub..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="vinaysiddha/svec-cms:latest"
CONTAINER_NAME="svec-cms-app"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found. Please create it and configure your settings.${NC}"
    exit 1
fi

echo -e "${YELLOW}📥 Pulling latest image from Docker Hub...${NC}"
if docker pull $IMAGE_NAME; then
    echo -e "${GREEN}✅ Successfully pulled latest image${NC}"
else
    echo -e "${RED}❌ Failed to pull image from Docker Hub${NC}"
    exit 1
fi

# Stop existing container if running
if docker ps --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}\$"; then
    echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
    docker stop $CONTAINER_NAME
fi

# Remove existing container if it exists
if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}\$"; then
    echo -e "${YELLOW}🗑️  Removing existing container...${NC}"
    docker rm $CONTAINER_NAME
fi

# Deploy using docker-compose
echo -e "${YELLOW}🚀 Starting deployment...${NC}"
if docker-compose up -d; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}🌐 Application URL: http://localhost:3000${NC}"
    echo -e "${BLUE}📊 Container name: ${CONTAINER_NAME}${NC}"
    echo -e "${BLUE}🔍 Check status: docker ps${NC}"
    echo -e "${BLUE}📝 View logs: docker logs ${CONTAINER_NAME}${NC}"
    
    echo -e "${YELLOW}⏳ Waiting for application to start...${NC}"
    sleep 15
    
    # Check if the application is responding
    if curl -s http://localhost:3000/api/health > /dev/null; then
        echo -e "${GREEN}🎉 Application is ready and responding!${NC}"
        echo -e "${GREEN}✨ Deployment completed successfully!${NC}"
    else
        echo -e "${YELLOW}⚠️  Application might still be starting. Check logs: docker logs ${CONTAINER_NAME}${NC}"
    fi
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi

echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "${BLUE}  Image: ${IMAGE_NAME}${NC}"
echo -e "${BLUE}  Container: ${CONTAINER_NAME}${NC}"
echo -e "${BLUE}  Status: Running${NC}"
echo -e "${BLUE}  URL: http://localhost:3000${NC}"