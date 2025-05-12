#!/bin/bash

# Get the current version from the last deployment
CURRENT_VERSION=$(docker images | grep express-app | grep -v latest | awk '{print $2}' | sort -V | tail -n 1)

# Increment the version number
if [ -z "$CURRENT_VERSION" ]; then
    NEW_VERSION="1.0.0"
else
    # Split version into parts
    MAJOR=$(echo $CURRENT_VERSION | cut -d. -f1)
    MINOR=$(echo $CURRENT_VERSION | cut -d. -f2)
    PATCH=$(echo $CURRENT_VERSION | cut -d. -f3)
    
    # Increment patch version
    PATCH=$((PATCH + 1))
    NEW_VERSION="$MAJOR.$MINOR.$PATCH"
fi

echo "Building version $NEW_VERSION..."

# Build the new image
docker build -t us-central1-docker.pkg.dev/dark-alpha-deal-sourcing/express-app/express-app:$NEW_VERSION .

# Push the image
echo "Pushing to Google Cloud Artifact Registry..."
docker push us-central1-docker.pkg.dev/dark-alpha-deal-sourcing/express-app/express-app:$NEW_VERSION

# Deploy to Cloud Run
echo "Deploying to Cloud Run..."
gcloud run deploy express-app \
    --image us-central1-docker.pkg.dev/dark-alpha-deal-sourcing/express-app/express-app:$NEW_VERSION \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated

echo "Deployment completed! New version: $NEW_VERSION" 