import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';
import ThemeToggle from './ThemeToggle';

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
    <header className="aws-header">
      <div className="aws-header-content">
        <Link to="/" className="aws-logo">
          📚 DeckFolio
        </Link>
        
        <nav className="aws-nav">
          {user ? (
            // Authenticated navigation
            <>
              <Link to="/dashboard" className={`aws-nav-link ${isActive('/dashboard')}`}>
                Dashboard
              </Link>
              <button 
                onClick={handleCreatePortfolio}
                className={`aws-nav-link ${isActive('/generator')}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}
              >
                Stack Portfolio
              </button>
              <ThemeToggle showLabel={false} size="small" />
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
              <Link to="/" className={`aws-nav-link ${isActive('/')}`}>
                Home
              </Link>
              <ThemeToggle showLabel={false} size="small" />
              <Link to="/login" className="aws-nav-link">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>

      <style jsx>{`
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
          background: var(--aws-blue-light);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--aws-gray-300);
        }

        .user-name {
          font-weight: 500;
          color: var(--aws-gray-200);
          font-size: 0.875rem;
        }

        .logout-btn {
          background: none;
          border: none;
          color: var(--aws-gray-300);
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--radius-sm);
          transition: var(--transition-fast);
        }

        .logout-btn:hover {
          background: var(--aws-blue-light);
          color: var(--aws-white);
        }

        @media (max-width: 768px) {
          .user-name {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;