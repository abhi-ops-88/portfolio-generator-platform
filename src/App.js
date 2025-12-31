import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
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

import './App.css';
import './styles/aws-inspired-theme.css';

function App() {
  return (
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
            </Routes>
          </main>
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
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;