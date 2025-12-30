@echo off
echo 🚀 Portfolio Generator - Vercel Deployment
echo ==========================================

REM Check if git is initialized
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit: Portfolio Generator app"
    echo ✅ Git repository initialized
) else (
    echo ✅ Git repository already exists
)

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
    echo ✅ Vercel CLI installed
) else (
    echo ✅ Vercel CLI already installed
)

REM Check if user is logged in to Vercel
echo 🔐 Checking Vercel authentication...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo 🔑 Please login to Vercel...
    vercel login
) else (
    echo ✅ Already logged in to Vercel
)

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
vercel --prod

echo.
echo 🎉 Deployment complete!
echo.
echo 📋 Next steps:
echo 1. Configure environment variables in Vercel dashboard
echo 2. Add Firebase configuration
echo 3. Test your deployed application
echo 4. Share your Portfolio Generator with users!
echo.
echo 📖 For detailed setup instructions, see VERCEL_DEPLOYMENT.md

pause