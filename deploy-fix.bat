@echo off
echo Deploying Portfolio Generator Platform with fixes...
echo.

echo Step 1: Installing dependencies...
npm install

echo.
echo Step 2: Building the project...
npm run build

echo.
echo Step 3: The build is complete!
echo.
echo IMPORTANT: Before deploying to Vercel, make sure to:
echo 1. Set your Firebase environment variables in Vercel dashboard
echo 2. Go to your Vercel project settings
echo 3. Add the following environment variables:
echo    - REACT_APP_FIREBASE_API_KEY
echo    - REACT_APP_FIREBASE_AUTH_DOMAIN  
echo    - REACT_APP_FIREBASE_PROJECT_ID
echo    - REACT_APP_FIREBASE_STORAGE_BUCKET
echo    - REACT_APP_FIREBASE_MESSAGING_SENDER_ID
echo    - REACT_APP_FIREBASE_APP_ID
echo    - REACT_APP_FIREBASE_MEASUREMENT_ID
echo.
echo After setting the environment variables, redeploy your project.
echo The app will now show helpful error messages instead of a blank screen.
echo.
pause