import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { toast } from 'react-toastify';
import autoDeployService from '../services/autoDeployService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up with email and password
  const signUp = async (email, password, displayName) => {
    if (!auth) {
      throw new Error('Firebase authentication is not configured');
    }
    
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(result.user, {
        displayName: displayName
      });

      // Create user profile in Firestore
      await createUserProfile(result.user, { displayName });

      // Send email verification
      await sendEmailVerification(result.user);
      
      toast.success('Account created successfully! Please check your email for verification.');
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    if (!auth) {
      throw new Error('Firebase authentication is not configured');
    }
    
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Auto-create repository and basic portfolio on login
      await handlePostLoginSetup(result.user);
      
      toast.success('Welcome back!');
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!auth || !googleProvider) {
      throw new Error('Firebase authentication is not configured');
    }
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Create or update user profile in Firestore
      await createUserProfile(result.user);
      
      // Auto-create repository and basic portfolio on login
      await handlePostLoginSetup(result.user);
      
      toast.success('Successfully signed in with Google!');
      return result;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };

  // Handle post-login setup (repository creation, basic portfolio)
  const handlePostLoginSetup = async (user) => {
    try {
      // Check if user already has a repository
      const existingRepo = localStorage.getItem('user_repo_info');
      if (existingRepo) {
        console.log('User already has a repository configured');
        return;
      }

      // Get user's portfolio data or create basic data
      const portfolios = await getUserPortfolios();
      let portfolioData = null;
      
      if (portfolios.length > 0) {
        // Use the most recent portfolio
        portfolioData = portfolios[portfolios.length - 1].data;
      } else {
        // Create basic portfolio data
        portfolioData = {
          personalInfo: {
            name: user.displayName || 'Your Name',
            title: 'Professional',
            email: user.email,
            tagline: 'Welcome to my professional portfolio'
          },
          about: {
            description: 'Professional with passion for creating amazing experiences.',
            skills: ['JavaScript', 'React', 'Node.js']
          },
          resume: {
            education: [{
              degree: 'Your Degree',
              school: 'Your School',
              year: '2020-2024',
              description: 'Relevant coursework and achievements'
            }],
            experience: [{
              title: 'Your Position',
              company: 'Your Company',
              period: '2022-Present',
              description: 'Key responsibilities and achievements'
            }]
          },
          projects: [{
            title: 'Sample Project',
            description: 'Description of your amazing project',
            technologies: ['React', 'JavaScript'],
            liveUrl: '',
            githubUrl: ''
          }],
          social: {
            linkedin: '',
            github: '',
            twitter: '',
            instagram: ''
          },
          contact: {
            email: user.email,
            phone: '',
            location: ''
          },
          theme: {
            primaryColor: '#3b82f6',
            accentColor: '#ffd700',
            primaryColorDark: '#2563eb'
          }
        };

        // Save this basic portfolio data (only if user has no portfolios)
        if (portfolios.length === 0) {
          await savePortfolio(portfolioData);
        }
      }

      // Auto-create GitHub repository with basic portfolio
      const repoResult = await autoDeployService.createUserRepository(user, portfolioData);
      
      if (repoResult) {
        console.log('Repository created successfully:', repoResult);
        
        // Auto-deploy to GitHub Pages by default
        try {
          await autoDeployService.autoDeployPortfolio(portfolioData, 'github');
        } catch (deployError) {
          console.log('Auto-deployment skipped:', deployError.message);
        }
      }
    } catch (error) {
      console.error('Post-login setup error:', error);
      // Don't throw error to avoid blocking login
    }
  };

  // Sign out
  const logout = async () => {
    if (!auth) {
      throw new Error('Firebase authentication is not configured');
    }
    
    try {
      await signOut(auth);
      setUserProfile(null);
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    if (!auth) {
      throw new Error('Firebase authentication is not configured');
    }
    
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  // Create user profile in Firestore
  const createUserProfile = async (user, additionalData = {}) => {
    if (!user || !db) return;

    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();

      try {
        await setDoc(userRef, {
          displayName: displayName || additionalData.displayName || '',
          email,
          photoURL: photoURL || '',
          createdAt,
          portfolios: [],
          preferences: {
            theme: 'light',
            notifications: true
          },
          ...additionalData
        });
      } catch (error) {
        console.error('Error creating user profile:', error);
      }
    }

    return userRef;
  };

  // Update user profile
  const updateUserProfile = async (updates) => {
    if (!user || !db) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      });

      // Update local state
      setUserProfile(prev => ({ ...prev, ...updates }));
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Save portfolio data
  const savePortfolio = async (portfolioData, portfolioId = null) => {
    if (!user) throw new Error('User must be authenticated');
    if (!db) throw new Error('Database is not configured');

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const portfolios = userData.portfolios || [];
        
        // Check portfolio limit for new portfolios
        if (!portfolioId && portfolios.length >= 2) {
          throw new Error('You can only create up to 2 portfolios. Please delete an existing portfolio first.');
        }
        
        const portfolioEntry = {
          id: portfolioId || Date.now().toString(),
          data: portfolioData,
          createdAt: portfolioId ? portfolios.find(p => p.id === portfolioId)?.createdAt || new Date() : new Date(),
          updatedAt: new Date(),
          status: 'draft' // draft, published, deployed
        };

        let updatedPortfolios;
        if (portfolioId) {
          // Update existing portfolio
          updatedPortfolios = portfolios.map(p => 
            p.id === portfolioId ? portfolioEntry : p
          );
        } else {
          // Add new portfolio
          updatedPortfolios = [...portfolios, portfolioEntry];
        }

        await updateDoc(userRef, {
          portfolios: updatedPortfolios,
          updatedAt: new Date()
        });

        toast.success('Portfolio saved successfully!');
        return portfolioEntry.id;
      }
    } catch (error) {
      console.error('Error saving portfolio:', error);
      throw error;
    }
  };

  // Delete portfolio
  const deletePortfolio = async (portfolioId) => {
    if (!user) throw new Error('User must be authenticated');
    if (!db) throw new Error('Database is not configured');

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        const portfolios = userData.portfolios || [];
        
        // Remove the portfolio with the specified ID
        const updatedPortfolios = portfolios.filter(p => p.id !== portfolioId);
        
        await updateDoc(userRef, {
          portfolios: updatedPortfolios,
          updatedAt: new Date()
        });

        toast.success('Portfolio deleted successfully!');
        return true;
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      throw error;
    }
  };

  // Get user portfolios
  const getUserPortfolios = async () => {
    if (!user || !db) return [];

    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return userData.portfolios || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching portfolios:', error);
      return [];
    }
  };

  // Load user profile from Firestore
  const loadUserProfile = async (userId) => {
    if (!db) return;
    
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        setUserProfile(userSnap.data());
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        // Store user info for deployment service
        localStorage.setItem('user_email', user.email);
        localStorage.setItem('user_name', user.displayName || '');
        await loadUserProfile(user.uid);
      } else {
        setUser(null);
        setUserProfile(null);
        // Clear user info
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_name');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    resetPassword,
    updateUserProfile,
    savePortfolio,
    deletePortfolio,
    getUserPortfolios,
    handlePostLoginSetup
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;