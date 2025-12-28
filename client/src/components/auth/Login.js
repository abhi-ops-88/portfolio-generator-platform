import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import GoogleSignInButton from './GoogleSignInButton';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, resetPassword } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (resetMode) {
      handlePasswordReset();
      return;
    }

    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      let errorMessage = 'Failed to sign in';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(formData.email);
      setResetMode(false);
    } catch (error) {
      let errorMessage = 'Failed to send reset email';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address';
          break;
        default:
          errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{resetMode ? 'Reset Password' : 'Welcome Back'}</h1>
          <p>
            {resetMode 
              ? 'Enter your email to receive a password reset link'
              : 'Sign in to your Portfolio Generator account'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          {!resetMode && (
            <div className="form-group">
              <label className="form-label">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <div className="spinner" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                {resetMode ? 'Send Reset Email' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        {!resetMode && (
          <>
            <div className="auth-divider">
              <span>or</span>
            </div>

            <GoogleSignInButton onSuccess={handleGoogleSuccess} />
          </>
        )}

        <div className="auth-footer">
          {resetMode ? (
            <button
              type="button"
              onClick={() => setResetMode(false)}
              className="auth-link"
            >
              Back to Sign In
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setResetMode(true)}
                className="auth-link"
              >
                Forgot your password?
              </button>
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="auth-link">
                  Sign up here
                </Link>
              </p>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .auth-card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
        }

        .auth-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .auth-header h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .auth-header p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .auth-form {
          space-y: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
          font-size: 0.875rem;
        }

        .password-input {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.25rem;
        }

        .password-toggle:hover {
          color: #374151;
        }

        .w-full {
          width: 100%;
        }

        .auth-divider {
          position: relative;
          text-align: center;
          margin: 1.5rem 0;
        }

        .auth-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
        }

        .auth-divider span {
          background: white;
          color: #6b7280;
          padding: 0 1rem;
          font-size: 0.875rem;
        }

        .auth-footer {
          text-align: center;
          margin-top: 1.5rem;
          space-y: 1rem;
        }

        .auth-footer p {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 1rem 0 0;
        }

        .auth-link {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.875rem;
          background: none;
          border: none;
          cursor: pointer;
        }

        .auth-link:hover {
          color: #2563eb;
          text-decoration: underline;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;