import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, getUserPortfolios } = useAuth();
  const [portfolioCount, setPortfolioCount] = useState(0);

  useEffect(() => {
    if (user) {
      loadPortfolioCount();
    }
  }, [user]);

  const loadPortfolioCount = async () => {
    try {
      const portfolios = await getUserPortfolios();
      setPortfolioCount(portfolios.length);
    } catch (error) {
      console.error('Error loading portfolio count:', error);
    }
  };

  const handleCreatePortfolio = () => {
    if (portfolioCount >= 2) {
      toast.error('You can only create up to 2 portfolios. Please delete an existing portfolio first.');
      navigate('/dashboard');
      return;
    }
    navigate('/generator');
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Don't show header on auth pages
  if (['/login', '/signup'].includes(location.pathname)) {
    return null;
  }

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          Portfolio Generator
        </Link>
        
        <nav className="nav">
          {user ? (
            // Authenticated navigation
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`}>
                Dashboard
              </Link>
              <button 
                onClick={handleCreatePortfolio}
                className={`nav-link nav-button ${isActive('/generator')}`}
              >
                Create Portfolio
              </button>
              <div className="user-section">
                <div className="user-info">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="user-avatar" />
                  ) : (
                    <div className="user-avatar-placeholder">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <span className="user-name">{user.displayName || 'User'}</span>
                </div>
                <button onClick={handleLogout} className="logout-btn" title="Sign Out">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            // Public navigation
            <>
              <Link to="/" className={`nav-link ${isActive('/')}`}>
                Home
              </Link>
              <Link to="/login" className="nav-link">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-small">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          padding: 1rem 0;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #3b82f6;
          text-decoration: none;
        }

        .nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-link {
          text-decoration: none;
          color: #64748b;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #3b82f6;
        }

        .nav-button {
          background: none;
          border: none;
          cursor: pointer;
          font-family: inherit;
          font-size: inherit;
        }

        .user-section {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-avatar-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }

        .user-name {
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }

        .logout-btn {
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: all 0.2s ease;
        }

        .logout-btn:hover {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-small {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 0 1rem;
          }
          
          .nav {
            gap: 1rem;
          }

          .user-name {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;