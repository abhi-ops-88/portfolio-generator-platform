#!/bin/bash

# Portfolio Generator - Vercel Deployment Script
# This script helps deploy your Portfolio Generator to Vercel

echo "🚀 Portfolio Generator - Vercel Deployment"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Portfolio Generator app"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI already installed"
fi

# Check if user is logged in to Vercel
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "🔑 Please login to Vercel..."
    vercel login
else
    echo "✅ Already logged in to Vercel"
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Configure environment variables in Vercel dashboard"
echo "2. Add Firebase configuration"
echo "3. Test your deployed application"
echo "4. Share your Portfolio Generator with users!"
echo ""
echo "📖 For detailed setup instructions, see VERCEL_DEPLOYMENT.md"