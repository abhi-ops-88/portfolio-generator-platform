@echo off
echo 🚀 Portfolio Generator - Project Move Script
echo =============================================

set "DEST_PATH=C:\Users\Admin\Desktop\AI\Kiro\portfolio\portfolio-generator-platform\portfolio-generator-platform"

echo 📁 Moving project to: %DEST_PATH%
echo.

REM Check if destination exists
if exist "%DEST_PATH%" (
    echo ⚠️  Destination folder exists. Contents will be replaced.
    set /p "confirm=Continue? (y/N): "
    if /i not "%confirm%"=="y" (
        echo ❌ Operation cancelled.
        pause
        exit /b
    )
    
    echo 🗑️  Removing existing contents...
    rmdir /s /q "%DEST_PATH%" 2>nul
)

echo 📁 Creating destination folder...
mkdir "%DEST_PATH%" 2>nul

echo 📦 Copying project files...

REM Copy root files
echo 📄 Copying configuration files...
copy "package.json" "%DEST_PATH%\" >nul 2>&1
copy "vercel.json" "%DEST_PATH%\" >nul 2>&1
copy ".env.example" "%DEST_PATH%\" >nul 2>&1

echo 📄 Copying documentation...
copy "README.md" "%DEST_PATH%\" >nul 2>&1
copy "DEPLOYMENT_GUIDE.md" "%DEST_PATH%\" >nul 2>&1
copy "FIREBASE_SETUP.md" "%DEST_PATH%\" >nul 2>&1
copy "FIREBASE_QUICK_SETUP.md" "%DEST_PATH%\" >nul 2>&1
copy "VERCEL_DEPLOYMENT.md" "%DEST_PATH%\" >nul 2>&1
copy "PROJECT_STRUCTURE.md" "%DEST_PATH%\" >nul 2>&1

echo 📄 Copying deployment scripts...
copy "deploy.sh" "%DEST_PATH%\" >nul 2>&1
copy "deploy.bat" "%DEST_PATH%\" >nul 2>&1

echo 📁 Copying folders...
if exist "public" (
    echo   - public/
    xcopy "public" "%DEST_PATH%\public\" /E /I /Y >nul 2>&1
)

if exist "src" (
    echo   - src/
    xcopy "src" "%DEST_PATH%\src\" /E /I /Y >nul 2>&1
)

if exist "api" (
    echo   - api/
    xcopy "api" "%DEST_PATH%\api\" /E /I /Y >nul 2>&1
)

if exist "server" (
    echo   - server/
    xcopy "server" "%DEST_PATH%\server\" /E /I /Y >nul 2>&1
)

REM Create .gitignore
echo 📄 Creating .gitignore...
(
echo # Dependencies
echo node_modules/
echo npm-debug.log*
echo yarn-debug.log*
echo yarn-error.log*
echo.
echo # Production build
echo build/
echo dist/
echo.
echo # Environment variables
echo .env
echo .env.local
echo .env.development.local
echo .env.test.local
echo .env.production.local
echo.
echo # IDE files
echo .vscode/
echo .idea/
echo *.swp
echo *.swo
echo.
echo # OS files
echo .DS_Store
echo Thumbs.db
echo.
echo # Logs
echo logs/
echo *.log
echo.
echo # Firebase
echo .firebase/
echo firebase-debug.log
echo.
echo # Vercel
echo .vercel/
) > "%DEST_PATH%\.gitignore"

echo.
echo ✅ Project move completed successfully!
echo.
echo 📋 Next steps:
echo 1. Navigate to: %DEST_PATH%
echo 2. Install dependencies: npm install
echo 3. Set up environment variables: copy .env.example to .env
echo 4. Configure Firebase (see FIREBASE_QUICK_SETUP.md)
echo 5. Deploy to Vercel: deploy.bat or vercel --prod
echo.
echo 📖 Documentation available:
echo    - README.md - Main project documentation
echo    - FIREBASE_QUICK_SETUP.md - 10-minute Firebase setup
echo    - VERCEL_DEPLOYMENT.md - Deployment guide
echo.
echo 🎉 Your Portfolio Generator is ready!
echo.
pause