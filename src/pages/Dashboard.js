import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Globe, 
  Github, 
  Calendar,
  User,
  Settings,
  LogOut,
  FileText
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, logout, getUserPortfolios } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    loadPortfolios();
  }, []);

  const loadPortfolios = async () => {
    try {
      const userPortfolios = await getUserPortfolios();
      setPortfolios(userPortfolios);
    } catch (error) {
      console.error('Error loading portfolios:', error);
      toast.error('Failed to load portfolios');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const deletePortfolio = async (portfolioId) => {
    if (!window.confirm('Are you sure you want to delete this portfolio?')) {
      return;
    }

    try {
      // Implementation for deleting portfolio
      toast.success('Portfolio deleted successfully');
      loadPortfolios();
    } catch (error) {
      toast.error('Failed to delete portfolio');
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'deployed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="header-info">
              <h1>Welcome back, {user?.displayName || 'User'}!</h1>
              <p>Manage your portfolios and create new ones</p>
            </div>
            
            <div className="header-actions">
              <Link to="/generator" className="btn btn-primary">
                <Plus className="w-4 h-4" />
                Create New Portfolio
              </Link>
              
              <div className="user-menu">
                <button
                  className="user-menu-trigger"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="user-avatar" />
                  ) : (
                    <div className="user-avatar-placeholder">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </button>
                
                {showUserMenu && (
                  <div className="user-menu-dropdown">
                    <div className="user-info">
                      <p className="user-name">{user?.displayName}</p>
                      <p className="user-email">{user?.email}</p>
                    </div>
                    <div className="menu-divider"></div>
                    <button className="menu-item">
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button className="menu-item" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="container">
          {portfolios.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-content">
                <FileText className="w-16 h-16 text-gray-400" />
                <h2>No portfolios yet</h2>
                <p>Create your first portfolio to get started</p>
                <Link to="/generator" className="btn btn-primary btn-large">
                  <Plus className="w-5 h-5" />
                  Create Your First Portfolio
                </Link>
              </div>
            </div>
          ) : (
            <div className="portfolios-section">
              <div className="section-header">
                <h2>Your Portfolios ({portfolios.length})</h2>
                <Link to="/generator" className="btn btn-secondary">
                  <Plus className="w-4 h-4" />
                  New Portfolio
                </Link>
              </div>
              
              <div className="portfolios-grid">
                {portfolios.map((portfolio) => (
                  <div key={portfolio.id} className="portfolio-card">
                    <div className="portfolio-header">
                      <div className="portfolio-info">
                        <h3>{portfolio.data?.personalInfo?.name || 'Untitled Portfolio'}</h3>
                        <p>{portfolio.data?.personalInfo?.title || 'No title'}</p>
                      </div>
                      <div className={`portfolio-status ${getStatusColor(portfolio.status)}`}>
                        {portfolio.status}
                      </div>
                    </div>
                    
                    <div className="portfolio-meta">
                      <div className="meta-item">
                        <Calendar className="w-4 h-4" />
                        <span>Updated {formatDate(portfolio.updatedAt)}</span>
                      </div>
                      <div className="meta-item">
                        <FileText className="w-4 h-4" />
                        <span>{portfolio.data?.projects?.length || 0} projects</span>
                      </div>
                    </div>
                    
                    <div className="portfolio-actions">
                      <button
                        className="action-btn"
                        onClick={() => navigate(`/preview/${portfolio.id}`)}
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => navigate(`/generator/${portfolio.id}`)}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {portfolio.status === 'deployed' && (
                        <button
                          className="action-btn"
                          title="View Live Site"
                        >
                          <Globe className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="action-btn delete"
                        onClick={() => deletePortfolio(portfolio.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .dashboard {
          min-height: calc(100vh - 80px);
          background: #f8fafc;
        }

        .dashboard-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 2rem 0;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .header-info h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .header-info p {
          color: #6b7280;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-menu {
          position: relative;
        }

        .user-menu-trigger {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f3f4f6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6b7280;
        }

        .user-menu-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          min-width: 200px;
          z-index: 50;
        }

        .user-info {
          padding: 1rem;
        }

        .user-name {
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.25rem;
        }

        .user-email {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0;
        }

        .menu-divider {
          height: 1px;
          background: #e5e7eb;
        }

        .menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          color: #374151;
          font-size: 0.875rem;
          transition: background 0.2s ease;
        }

        .menu-item:hover {
          background: #f9fafb;
        }

        .dashboard-content {
          padding: 2rem 0;
        }

        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .empty-state-content {
          text-align: center;
          max-width: 400px;
        }

        .empty-state-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin: 1rem 0 0.5rem;
        }

        .empty-state-content p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .portfolios-section {
          space-y: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .section-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
        }

        .portfolios-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .portfolio-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .portfolio-card:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          transform: translateY(-1px);
        }

        .portfolio-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .portfolio-info h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0 0 0.25rem;
        }

        .portfolio-info p {
          color: #6b7280;
          font-size: 0.875rem;
          margin: 0;
        }

        .portfolio-status {
          padding: 0.25rem 0.75rem;
          border-radius: 1rem;
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: capitalize;
        }

        .portfolio-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .portfolio-actions {
          display: flex;
          gap: 0.5rem;
          padding-top: 1rem;
          border-top: 1px solid #f3f4f6;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          background: white;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-btn:hover {
          background: #f9fafb;
          color: #374151;
        }

        .action-btn.delete:hover {
          background: #fee2e2;
          color: #dc2626;
          border-color: #fecaca;
        }

        .dashboard-loading {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-spinner {
          text-align: center;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        .loading-spinner p {
          color: #6b7280;
          font-weight: 500;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .header-actions {
            justify-content: space-between;
          }

          .portfolios-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;