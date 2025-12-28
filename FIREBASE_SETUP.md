# Firebase Setup Guide

This guide will help you set up Firebase authentication for the Portfolio Generator Platform.

## 🔥 Firebase Project Setup

### 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "portfolio-generator")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click on the "Get started" button
3. Go to the "Sign-in method" tab
4. Enable the following sign-in providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and add your project's support email

### 3. Configure Firestore Database

1. Click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (you can secure it later)
4. Select a location for your database
5. Click "Done"

### 4. Get Firebase Configuration

1. Click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click on the web icon (`</>`) to add a web app
5. Register your app with a nickname (e.g., "Portfolio Generator Web")
6. Copy the Firebase configuration object

## 🔧 Environment Configuration

### 1. Create Environment File

Create a `.env` file in the `client` directory:

```bash
cd client
cp .env.example .env
```

### 2. Add Firebase Configuration

Edit the `.env` file and add your Firebase configuration:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyC...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234
```

**Important**: Replace the values with your actual Firebase configuration values.

## 🔒 Security Rules

### Firestore Security Rules

Update your Firestore security rules to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public portfolios (if you want to make some portfolios public)
    match /public_portfolios/{portfolioId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Storage Security Rules (if using Firebase Storage)

If you plan to use Firebase Storage for images:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🎨 Customize Authentication UI

### 1. Configure OAuth Providers

For Google Sign-In, you may need to configure additional settings:

1. Go to Google Cloud Console
2. Enable the Google+ API
3. Configure OAuth consent screen
4. Add authorized domains

### 2. Email Templates

Customize email templates in Firebase Console:

1. Go to Authentication > Templates
2. Customize:
   - Email verification
   - Password reset
   - Email address change

## 🚀 Testing Authentication

### 1. Test Email/Password Sign-Up

1. Start your development server
2. Go to `/signup`
3. Create a test account
4. Check your email for verification

### 2. Test Google Sign-In

1. Go to `/login`
2. Click "Continue with Google"
3. Complete the OAuth flow

### 3. Verify Firestore Data

1. Go to Firebase Console > Firestore Database
2. Check that user documents are created in the `users` collection
3. Verify the data structure matches your expectations

## 🔧 Advanced Configuration

### 1. Custom Claims (Optional)

For role-based access control:

```javascript
// In Firebase Functions
const admin = require('firebase-admin');

exports.setCustomClaims = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  await admin.auth().setCustomUserClaims(context.auth.uid, {
    role: data.role
  });
  
  return { success: true };
});
```

### 2. Email Verification Enforcement

Update your security rules to require email verification:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId 
        && request.auth.token.email_verified == true;
    }
  }
}
```

### 3. Rate Limiting

Implement rate limiting for authentication:

```javascript
// In your React app
import { connectAuthEmulator } from 'firebase/auth';

if (process.env.NODE_ENV === 'development') {
  connectAuthEmulator(auth, 'http://localhost:9099');
}
```

## 🐛 Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Check that all environment variables are set correctly
   - Ensure the Firebase project is properly configured

2. **"Firebase: Error (auth/unauthorized-domain)"**
   - Add your domain to authorized domains in Firebase Console
   - Go to Authentication > Settings > Authorized domains

3. **Google Sign-In not working**
   - Check OAuth configuration in Google Cloud Console
   - Verify authorized JavaScript origins

4. **Firestore permission denied**
   - Check your security rules
   - Ensure user is authenticated before accessing data

### Debug Mode

Enable debug mode for development:

```javascript
// In your firebase.js config
import { connectFirestoreEmulator } from 'firebase/firestore';

if (process.env.NODE_ENV === 'development') {
  connectFirestoreEmulator(db, 'localhost', 8080);
}
```

## 📱 Production Deployment

### 1. Update Security Rules

Switch to production-ready security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId
        && request.auth.token.email_verified == true;
    }
  }
}
```

### 2. Configure Authorized Domains

Add your production domain to Firebase:

1. Go to Authentication > Settings
2. Add your production domain to "Authorized domains"

### 3. Environment Variables

Set production environment variables in your hosting platform:

- Netlify: Site settings > Environment variables
- Vercel: Project settings > Environment variables
- Heroku: Config vars

## 🎯 Best Practices

1. **Never commit `.env` files** to version control
2. **Use different Firebase projects** for development and production
3. **Implement proper error handling** for all authentication flows
4. **Test authentication flows** thoroughly before deployment
5. **Monitor authentication metrics** in Firebase Console
6. **Keep Firebase SDK updated** to the latest version
7. **Implement proper loading states** for better UX

## 📚 Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase React Hooks](https://github.com/CSFrequency/react-firebase-hooks)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)

---

Your Firebase authentication system is now ready! Users can sign up with email/password or Google, and their portfolio data will be securely stored in Firestore.