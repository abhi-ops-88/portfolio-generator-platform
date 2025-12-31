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
  FileText,
  Key,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Zap
} from 'lucide-react';
import TokenSetup from '../components/TokenSetup';
import autoDeployService from '../services/autoDeployService';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, logout, getUserPortfolios, deletePortfolio } = useAuth();
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showTokenSetup, setShowTokenSetup] = useState(false);
  const [deploymentTokens, setDeploymentTokens] = useState({});
  const [repoInfo, setRepoInfo] = useState(null);

  useEffect(() => {
    loadPortfolios();
    checkDeploymentSetup();
  }, []);

  const checkDeploymentSetup = () => {
    const tokens = autoDeployService.hasDeploymentTokens();
    setDeploymentTokens(tokens);
    
    const storedRepoInfo = localStorage.getItem('user_repo_info');
    if (storedRepoInfo) {
      setRepoInfo(JSON.parse(storedRepoInfo));
    }
  };

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

  const deletePortfolioHandler = async (portfolioId) => {
    if (!window.confirm('Are you sure you want to delete this portfolio? This action cannot be undone.')) {
      return;
    }

    try {
      await deletePortfolio(portfolioId);
      loadPortfolios(); // Refresh the portfolio list
    } catch (error) {
      console.error('Delete portfolio error:', error);
      toast.error(error.message || 'Failed to delete portfolio');
    }
  };

  const handleQuickDeploy = async (portfolio) => {
    try {
      const availablePlatforms = autoDeployService.getAvailablePlatforms();
      if (availablePlatforms.length === 0) {
        toast.error('Please configure deployment tokens first');
        setShowTokenSetup(true);
        return;
      }

      // Store portfolio data for deployment
      localStorage.setItem('portfolioData', JSON.stringify(portfolio.data));
      localStorage.setItem('currentPortfolioId', portfolio.id);
      
      // Navigate to deployment options
      navigate('/deploy-options');
    } catch (error) {
      console.error('Quick deploy error:', error);
      toast.error(`Deployment setup failed: ${error.message}`);
    }
  };

  const handleTokensConfigured = () => {
    checkDeploymentSetup();
    setShowTokenSetup(false);
    toast.success('Deployment tokens configured! You can now deploy portfolios.');
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
      <div className="aws-section">
        <div className="aws-container text-center">
          <div className="aws-spinner" style={{ width: '40px', height: '40px', margin: '0 auto 1rem' }}></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="aws-hero">
        <div className="aws-hero-content">
          <h1 className="aws-hero-title">Welcome back, {user?.displayName || 'User'}!</h1>
          <p className="aws-hero-subtitle">Manage your portfolios and stack your story with enterprise-grade tools</p>
          
          <div className="hero-actions">
            <button
              onClick={() => {
                if (portfolios.length >= 2) {
                  toast.error('You can only create up to 2 portfolios. Please delete an existing portfolio first.');
                  return;
                }
                navigate('/generator');
              }}
              className="btn btn-primary btn-lg"
            >
              <Plus className="w-5 h-5" />
              Stack New Story
            </button>
            
            <div className="user-menu">
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="user-avatar" />
                ) : (
                  <div className="user-avatar-placeholder">
                    <User className="w-5 h-5" />
                  </div>
                )}
                Account
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

      {/* Deployment Status Section */}
      <div className="aws-section aws-section-alt">
        <div className="aws-container">
          <div className="aws-card">
            <div className="aws-card-header">
              <div className="status-info">
                <Key className="w-5 h-5" />
                <h3 className="aws-card-title">Deployment Setup</h3>
              </div>
              {!deploymentTokens.github ? (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
            
            <div className="status-content">
              {!deploymentTokens.github ? (
                <div className="setup-needed">
                  <p>Configure your deployment tokens to enable automatic portfolio deployment</p>
                  <button 
                    onClick={() => setShowTokenSetup(true)}
                    className="btn btn-primary"
                  >
                    <Key className="w-4 h-4" />
                    Setup Deployment
                  </button>
                </div>
              ) : (
                <div className="setup-complete">
                  <p className="aws-badge aws-badge-success">✅ Deployment configured and ready</p>
                  {repoInfo && (
                    <div className="repo-info">
                      <p><strong>Repository:</strong> {repoInfo.username}/{repoInfo.repoName}</p>
                      {repoInfo.siteUrl && (
                        <a 
                          href={repoInfo.siteUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="site-link"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Live Site
                        </a>
                      )}
                    </div>
                  )}
                  <button 
                    onClick={() => setShowTokenSetup(true)}
                    className="btn btn-secondary"
                  >
                    <Settings className="w-4 h-4" />
                    Manage Tokens
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Limit Info */}
      <div className="aws-section">
        <div className="aws-container">
          <div className="aws-card">
            <div className="aws-card-header">
              <h3 className="aws-card-title">Story Limit</h3>
              <div className={`aws-badge ${portfolios.length >= 2 ? 'aws-badge-warning' : 'aws-badge-success'}`}>
                {portfolios.length}/2
              </div>
            </div>
            <p>
              {portfolios.length >= 2 
                ? 'You have reached the maximum number of stories. Delete an existing story to stack a new one.'
                : `You can stack ${2 - portfolios.length} more stor${2 - portfolios.length === 1 ? 'y' : 'ies'}.`
              }
            </p>
          </div>
        </div>
      </div>

      {showTokenSetup && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Deployment Configuration</h2>
              <button 
                onClick={() => setShowTokenSetup(false)}
                className="modal-close"
              >
                ×
              </button>
            </div>
            <TokenSetup onTokensConfigured={handleTokensConfigured} />
          </div>
        </div>
      )}

      {portfolios.length === 0 ? (
        <div className="aws-section text-center">
          <div className="aws-container">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="aws-section-title">No stories stacked yet</h2>
            <p className="aws-section-subtitle">Create your first portfolio to start stacking your story</p>
            <button
              onClick={() => navigate('/generator')}
              className="btn btn-primary btn-xl"
            >
              <Plus className="w-5 h-5" />
              Stack Your First Story
            </button>
          </div>
        </div>
      ) : (
        <div className="aws-section">
          <div className="aws-container">
            <div className="aws-section-header">
              <h2 className="aws-section-title">Your Stories ({portfolios.length}/2)</h2>
              <button
                onClick={() => {
                  if (portfolios.length >= 2) {
                    toast.error('You can only create up to 2 portfolios. Please delete an existing portfolio first.');
                    return;
                  }
                  navigate('/generator');
                }}
                className="btn btn-secondary"
                disabled={portfolios.length >= 2}
              >
                <Plus className="w-4 h-4" />
                Stack New Story
              </button>
            </div>
            
            <div className="aws-grid aws-grid-2">
              {portfolios.map((portfolio) => (
                <div key={portfolio.id} className="aws-card">
                  <div className="aws-card-header">
                    <div className="portfolio-info">
                      <h3 className="aws-card-title">{portfolio.data?.personalInfo?.name || 'Untitled Portfolio'}</h3>
                      <p className="aws-card-subtitle">{portfolio.data?.personalInfo?.title || 'No title'}</p>
                    </div>
                    <div className={`aws-badge ${portfolio.status === 'published' ? 'aws-badge-success' : portfolio.status === 'deployed' ? 'aws-badge-primary' : 'aws-badge-secondary'}`}>
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
                      className="btn btn-outline btn-sm"
                      onClick={() => navigate(`/preview/${portfolio.id}`)}
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate(`/generator/${portfolio.id}`)}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    {deploymentTokens.github && (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleQuickDeploy(portfolio)}
                        title="Deploy Portfolio"
                      >
                        <Zap className="w-4 h-4" />
                        Deploy
                      </button>
                    )}
                    {portfolio.status === 'deployed' && repoInfo?.siteUrl && (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => window.open(repoInfo.siteUrl, '_blank')}
                        title="View Live Site"
                      >
                        <Globe className="w-4 h-4" />
                        Live
                      </button>
                    )}
                    <button
                      className="btn btn-outline btn-sm text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => deletePortfolioHandler(portfolio.id)}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .user-menu {
          position: relative;
        }

        .user-menu-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border: 1px solid var(--aws-gray-200);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-xl);
          min-width: 200px;
          z-index: 50;
        }

        .user-info {
          padding: 1rem;
        }

        .user-name {
          font-weight: 600;
          color: var(--aws-blue);
          margin: 0 0 0.25rem;
        }

        .user-email {
          font-size: 0.875rem;
          color: var(--aws-gray-600);
          margin: 0;
        }

        .menu-divider {
          height: 1px;
          background: var(--aws-gray-200);
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
          color: var(--aws-gray-700);
          font-size: 0.875rem;
          transition: var(--transition-fast);
        }

        .menu-item:hover {
          background: var(--aws-gray-50);
        }

        .user-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-avatar-placeholder {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--aws-gray-200);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--aws-gray-600);
        }

        .status-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .setup-needed p {
          color: var(--aws-gray-600);
          margin-bottom: 1rem;
        }

        .setup-complete p {
          margin-bottom: 1rem;
        }

        .repo-info {
          background: var(--aws-gray-50);
          padding: 1rem;
          border-radius: var(--radius-md);
          margin-bottom: 1rem;
        }

        .repo-info p {
          margin: 0 0 0.5rem;
          font-size: 0.875rem;
          color: var(--aws-gray-700);
        }

        .site-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--aws-orange);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .site-link:hover {
          color: var(--aws-orange-dark);
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: var(--radius-lg);
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 1.5rem 0;
          border-bottom: 1px solid var(--aws-gray-200);
          margin-bottom: 0;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--aws-blue);
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: var(--aws-gray-600);
          cursor: pointer;
          padding: 0.5rem;
          line-height: 1;
        }

        .modal-close:hover {
          color: var(--aws-gray-800);
        }

        .portfolio-info h3 {
          margin: 0 0 0.25rem;
        }

        .portfolio-info p {
          margin: 0;
        }

        .portfolio-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--aws-gray-600);
          font-size: 0.875rem;
        }

        .portfolio-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          padding-top: 1rem;
          border-top: 1px solid var(--aws-gray-200);
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
          border: 4px solid var(--aws-gray-200);
          border-top: 4px solid var(--aws-orange);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        .loading-spinner p {
          color: var(--aws-gray-600);
          font-weight: 500;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .hero-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .portfolio-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
};

export default Dashboard;