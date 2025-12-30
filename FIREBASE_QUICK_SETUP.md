# Firebase Quick Setup Checklist

## ✅ Quick Setup for Portfolio Generator

Your app already has Firebase integration built-in! Just follow these steps:

### 1. Create Firebase Project (5 minutes)

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Click "Create a project"**
3. **Enter project name**: `portfolio-generator` (or your choice)
4. **Enable Google Analytics**: Yes (recommended)
5. **Click "Create project"**

### 2. Enable Authentication (2 minutes)

1. **Click "Authentication" → "Get started"**
2. **Go to "Sign-in method" tab**
3. **Enable these providers**:
   - ✅ **Email/Password**: Toggle ON → Save
   - ✅ **Google**: Toggle ON → Enter support email → Save

### 3. Create Firestore Database (2 minutes)

1. **Click "Firestore Database" → "Create database"**
2. **Choose "Start in test mode"** → Next
3. **Select location**: `us-central1` (or closest to you) → Done
4. **Go to "Rules" tab** and replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. **Click "Publish"**

### 4. Get Configuration (1 minute)

1. **Click ⚙️ → "Project settings"**
2. **Scroll to "Your apps" → Click web icon `</>`**
3. **Enter app name**: `portfolio-generator-web` → Register
4. **Copy the config object** (looks like this):

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-ABC123"
};
```

### 5. Add Environment Variables

#### For Local Development
Create `.env` file in your project root:

```env
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABC123
```

#### For Vercel Deployment
1. **Go to your Vercel project dashboard**
2. **Settings → Environment Variables**
3. **Add each variable above**

### 6. Configure Authorized Domains

1. **In Firebase Console → Authentication → Settings**
2. **Under "Authorized domains", add**:
   - `localhost` (for development)
   - `your-app-name.vercel.app` (your Vercel domain)

## 🎯 What This Enables

✅ **User Registration & Login**
✅ **Google Sign-in**
✅ **Secure Data Storage**
✅ **Portfolio Persistence**
✅ **User Profile Management**

## 🧪 Test Your Setup

1. **Run locally**: `npm start`
2. **Go to**: `http://localhost:3000/signup`
3. **Create account** with email/password
4. **Try Google sign-in**
5. **Check Firebase Console** → Authentication → Users

## 🚀 Deploy to Vercel

Once Firebase is configured:

```bash
# Deploy to Vercel
vercel --prod

# Or use the deployment script
./deploy.sh
```

## 🔒 Security Notes

- **Test mode** is fine for development
- **Production**: Update Firestore rules for better security
- **API Keys**: Restrict in Google Cloud Console for production

## 📞 Need Help?

- **Detailed guide**: See `FIREBASE_SETUP.md`
- **Common issues**: Check troubleshooting section
- **Firebase docs**: [firebase.google.com/docs](https://firebase.google.com/docs)

---

**Total setup time: ~10 minutes** ⏱️