# Firebase Setup Guide for Portfolio Generator

This guide will walk you through setting up Firebase for your Portfolio Generator application, including Authentication, Firestore Database, and configuration.

## 🔥 What Firebase Provides

Firebase will handle:
- **Authentication**: User sign-up, login, and Google OAuth
- **Database**: Store user portfolio data (Firestore)
- **Security**: User data protection and access control
- **Real-time sync**: Automatic data synchronization

## 📋 Step-by-Step Firebase Setup

### Step 1: Create a Firebase Project

1. **Go to Firebase Console**
   - Visit [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Sign in with your Google account

2. **Create New Project**
   - Click "Create a project" or "Add project"
   - Enter project name: `portfolio-generator` (or your preferred name)
   - Choose whether to enable Google Analytics (recommended)
   - Click "Create project"

3. **Wait for Setup**
   - Firebase will set up your project (takes 1-2 minutes)
   - Click "Continue" when ready

### Step 2: Enable Authentication

1. **Navigate to Authentication**
   - In the Firebase console, click "Authentication" in the left sidebar
   - Click "Get started" if it's your first time

2. **Configure Sign-in Methods**
   - Go to the "Sign-in method" tab
   - Enable the following providers:

   **Email/Password:**
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

   **Google Sign-in:**
   - Click on "Google"
   - Toggle "Enable" to ON
   - Enter your project support email
   - Click "Save"

3. **Configure Authorized Domains**
   - Go to "Settings" tab in Authentication
   - Under "Authorized domains", add:
     - `localhost` (for development)
     - Your Vercel domain: `your-app-name.vercel.app`
     - Any custom domains you plan to use

### Step 3: Set Up Firestore Database

1. **Navigate to Firestore Database**
   - Click "Firestore Database" in the left sidebar
   - Click "Create database"

2. **Choose Security Rules**
   - Select "Start in test mode" (we'll configure proper rules later)
   - Click "Next"

3. **Choose Location**
   - Select a location close to your users (e.g., `us-central1`)
   - Click "Done"

4. **Configure Security Rules**
   - Go to the "Rules" tab
   - Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Portfolio data - users can only access their own portfolios
    match /portfolios/{portfolioId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Public portfolios (optional - for sharing)
    match /public-portfolios/{portfolioId} {
      allow read: if true; // Anyone can read public portfolios
      allow write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

   - Click "Publish"

### Step 4: Get Firebase Configuration

1. **Go to Project Settings**
   - Click the gear icon ⚙️ next to "Project Overview"
   - Select "Project settings"

2. **Add a Web App**
   - Scroll down to "Your apps" section
   - Click the web icon `</>`
   - Enter app nickname: `portfolio-generator-web`
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"

3. **Copy Configuration**
   - Copy the Firebase configuration object
   - It should look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345678",
  measurementId: "G-XXXXXXXXXX"
};
```

### Step 5: Configure Environment Variables

1. **For Local Development (.env)**
   ```env
   REACT_APP_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
   REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789012345678
   REACT_APP_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

2. **For Vercel Deployment**
   - Go to your Vercel project dashboard
   - Navigate to "Settings" > "Environment Variables"
   - Add each variable from above

### Step 6: Set Up Firebase Storage (Optional)

If you want to store user profile images:

1. **Navigate to Storage**
   - Click "Storage" in the left sidebar
   - Click "Get started"

2. **Configure Security Rules**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /users/{userId}/{allPaths=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       match /public/{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

3. **Choose Location**
   - Select the same location as your Firestore database

## 🔧 Database Structure

Your Firestore database will have this structure:

```
/users/{userId}
  - email: string
  - displayName: string
  - photoURL: string
  - createdAt: timestamp
  - lastLoginAt: timestamp

/portfolios/{portfolioId}
  - userId: string (owner)
  - personalInfo: object
    - name: string
    - title: string
    - email: string
    - phone: string
    - location: string
    - profileImage: string
    - social: object
      - linkedin: string
      - github: string
      - twitter: string
      - medium: string
  - about: object
    - summary: string
    - details: string
  - resume: object
    - skills: array
    - experience: array
    - education: array
  - projects: array
  - contact: object
  - theme: object
    - primaryColor: string
    - secondaryColor: string
    - backgroundColor: string
  - createdAt: timestamp
  - updatedAt: timestamp
  - isPublic: boolean

/public-portfolios/{portfolioId} (optional)
  - Same structure as portfolios
  - For publicly shared portfolios
```

## 🔐 Security Configuration

### Authentication Rules

1. **Email Verification (Optional)**
   - Go to Authentication > Templates
   - Customize email verification template
   - Enable "Email link (passwordless sign-in)" if desired

2. **Password Requirements**
   - Go to Authentication > Settings
   - Configure password policy:
     - Minimum length: 8 characters
     - Require uppercase, lowercase, numbers

### Firestore Security Rules Explained

```javascript
// Users can only access their own user document
match /users/{userId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}

// Portfolio data is private to the owner
match /portfolios/{portfolioId} {
  allow read, write: if request.auth != null && 
    request.auth.uid == resource.data.userId;
  allow create: if request.auth != null && 
    request.auth.uid == request.resource.data.userId;
}
```

## 🧪 Testing Firebase Setup

### Test Authentication

1. **Run your app locally**
   ```bash
   npm start
   ```

2. **Test Sign-up**
   - Go to `/signup`
   - Create a new account
   - Check Firebase Console > Authentication > Users

3. **Test Google Sign-in**
   - Try signing in with Google
   - Verify user appears in Firebase Console

### Test Firestore

1. **Create Portfolio Data**
   - Fill out the portfolio form
   - Save the data
   - Check Firebase Console > Firestore Database

2. **Verify Security Rules**
   - Try accessing data from different user accounts
   - Ensure users can only see their own data

## 🚀 Production Considerations

### Security Enhancements

1. **API Key Restrictions**
   - Go to Google Cloud Console
   - Navigate to "APIs & Services" > "Credentials"
   - Restrict your API key to specific domains

2. **Firestore Rules Validation**
   - Test rules thoroughly
   - Use Firebase Rules Playground for testing

3. **Authentication Settings**
   - Set up proper email templates
   - Configure password policies
   - Enable multi-factor authentication (optional)

### Performance Optimization

1. **Firestore Indexes**
   - Firebase will suggest indexes as you use queries
   - Create composite indexes for complex queries

2. **Data Structure**
   - Keep documents under 1MB
   - Use subcollections for large datasets
   - Implement pagination for large lists

## 🔍 Monitoring and Analytics

### Firebase Analytics

1. **Enable Analytics**
   - Go to Analytics in Firebase Console
   - View user engagement, retention, and conversion

2. **Custom Events**
   - Track portfolio creation
   - Monitor deployment success rates
   - Measure user engagement

### Performance Monitoring

1. **Enable Performance Monitoring**
   - Add Firebase Performance SDK
   - Monitor app startup time
   - Track network requests

## 🐛 Troubleshooting

### Common Issues

#### "Firebase: Error (auth/configuration-not-found)"
- **Solution**: Check that all environment variables are set correctly
- Verify the Firebase config object is complete

#### "Missing or insufficient permissions"
- **Solution**: Check Firestore security rules
- Ensure user is authenticated before accessing data

#### "Firebase: Error (auth/unauthorized-domain)"
- **Solution**: Add your domain to authorized domains in Authentication settings

#### "Network request failed"
- **Solution**: Check internet connection and Firebase project status
- Verify API keys are not restricted incorrectly

### Debug Mode

Enable Firebase debug mode for development:

```javascript
// In your firebase config file
if (process.env.NODE_ENV === 'development') {
  // Enable Firestore debug logging
  firebase.firestore.setLogLevel('debug');
}
```

## 📚 Additional Resources

### Firebase Documentation
- [Firebase Auth Guide](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Security Rules Guide](https://firebase.google.com/docs/rules)

### Best Practices
- [Firebase Security Best Practices](https://firebase.google.com/docs/rules/rules-and-auth)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/data-model)
- [Authentication Best Practices](https://firebase.google.com/docs/auth/web/manage-users)

## ✅ Checklist

Before deploying to production:

- [ ] Firebase project created
- [ ] Authentication enabled (Email/Password + Google)
- [ ] Firestore database created with security rules
- [ ] Environment variables configured
- [ ] Authorized domains added
- [ ] Security rules tested
- [ ] User authentication tested
- [ ] Data persistence tested
- [ ] API key restrictions configured (production)

## 🎉 You're Ready!

Once you've completed this setup:

1. **Your users can sign up and log in**
2. **Portfolio data is securely stored**
3. **Each user has private access to their data**
4. **The app is ready for production deployment**

Your Firebase backend is now fully configured to support your Portfolio Generator application! 🔥