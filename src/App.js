import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import Header from './components/Header';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import Dashboard from './pages/Dashboard';
import Generator from './pages/Generator';
import Preview from './pages/Preview';
import Deploy from './pages/Deploy';
import DeployOptions from './pages/DeployOptions';
import Settings from './pages/Settings';

import './App.css';
import './styles/aws-inspired-theme.css';
import './styles/black-white-theme.css';

// Theme-aware ToastContainer wrapper
const ThemedToastContainer = () => {
  const { isBlackWhiteTheme } = useTheme();
  
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isBlackWhiteTheme ? "dark" : "light"}
      toastStyle={{
        backgroundColor: isBlackWhiteTheme ? '#1A1A1A' : '#FFFFFF',
        color: isBlackWhiteTheme ? '#FFFFFF' : '#000000',
        border: isBlackWhiteTheme ? '1px solid #404040' : '1px solid #E0E0E0'
      }}
    />
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/generator" 
                  element={
                    <ProtectedRoute>
                      <Generator />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/generator/:portfolioId" 
                  element={
                    <ProtectedRoute>
                      <Generator />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/preview" 
                  element={
                    <ProtectedRoute>
                      <Preview />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/preview/:portfolioId" 
                  element={
                    <ProtectedRoute>
                      <Preview />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/deploy" 
                  element={
                    <ProtectedRoute>
                      <Deploy />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/deploy-options" 
                  element={
                    <ProtectedRoute>
                      <DeployOptions />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <ThemedToastContainer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;