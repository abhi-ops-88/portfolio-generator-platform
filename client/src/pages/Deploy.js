import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Github, Globe, Key, User, Rocket, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const Deploy = () => {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState(null);
  const [portfolioFiles, setPortfolioFiles] = useState(null);
  const [deploymentStep, setDeploymentStep] = useState('setup'); // setup, deploying, success, error
  const [formData, setFormData] = useState({
    githubToken: '',
    netlifyToken: '',
    username: '',
    repoName: '',
    siteName: ''
  });
  const [deploymentResult, setDeploymentResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedFiles = localStorage.getItem('generatedPortfolio');
    const savedData = localStorage.getItem('portfolioData');
    
    if (savedFiles && savedData) {
      const data = JSON.parse(savedData);
      setPortfolioFiles(JSON.parse(savedFiles));
      setPortfolioData(data);
      
      // Auto-fill some fields
      setFormData(prev => ({
        ...prev,
        username: data.personalInfo?.name?.toLowerCase().replace(/\s+/g, '-') || '',
        repoName: `${data.personalInfo?.name?.toLowerCase().replace(/\s+/g, '-')}-portfolio` || 'my-portfolio',
        siteName: `${data.personalInfo?.name?.toLowerCase().replace(/\s+/g, '-')}-portfolio` || 'my-portfolio'
      }));
    } else {
      navigate('/generator');
    }
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    if (!formData.githubToken.trim()) {
      toast.error('GitHub token is required');
      return false;
    }
    if (!formData.netlifyToken.trim()) {
      toast.error('Netlify token is required');
      return false;
    }
    if (!formData.username.trim()) {
      toast.error('GitHub username is required');
      return false;
    }
    if (!formData.repoName.trim()) {
      toast.error('Repository name is required');
      return false;
    }
    if (!formData.siteName.trim()) {
      toast.error('Site name is required');
      return false;
    }
    return true;
  };

  const deployPortfolio = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setDeploymentStep('deploying');

    try {
      // Step 1: Create GitHub repository
      toast.info('Creating GitHub repository...');
      const githubResponse = await fetch('/api/github/create-repo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          repoName: formData.repoName,
          portfolioFiles: portfolioFiles,
          githubToken: formData.githubToken
        })
      });

      const githubResult = await githubResponse.json();

      if (!githubResult.success) {
        throw new Error(githubResult.message || 'Failed to create GitHub repository');
      }

      toast.success('GitHub repository created successfully!');

      // Step 2: Deploy to Netlify
      toast.info('Deploying to Netlify...');
      const netlifyResponse = await fetch('/api/netlify/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          repoUrl: githubResult.repoUrl,
          siteName: formData.siteName,
          netlifyToken: formData.netlifyToken
        })
      });

      const netlifyResult = await netlifyResponse.json();

      if (!netlifyResult.success) {
        throw new Error(netlifyResult.message || 'Failed to deploy to Netlify');
      }

      // Success!
      setDeploymentResult({
        github: githubResult,
        netlify: netlifyResult
      });
      setDeploymentStep('success');
      toast.success('Portfolio deployed successfully!');

    } catch (error) {
      console.error('Deployment error:', error);
      setDeploymentStep('error');
      toast.error(error.message || 'Deployment failed');
    } finally {
      setLoading(false);
    }
  };

  const resetDeployment = () => {
    setDeploymentStep('setup');
    setDeploymentResult(null);
  };

  if (!portfolioData || !portfolioFiles) {
    return (
      <div className="deploy-loading">
        <div className="container text-center">
          <h2>Loading...</h2>
          <p>Please generate your portfolio first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="deploy">
      <div className="container">
        <div className="deploy-header">
          <h1>Deploy Your Portfolio</h1>
          <p>Deploy your portfolio to GitHub and Netlify with automatic setup</p>
        </div>

        {deploymentStep === 'setup' && (
          <div className="deploy-form">
            <div className="form-sections">
              {/* GitHub Configuration */}
              <div className="form-section">
                <div className="section-header">
                  <Github className="w-6 h-6" />
                  <div>
                    <h3>GitHub Configuration</h3>
                    <p>We'll create a repository and upload your portfolio code</p>
                  </div>
                </div>
                
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      <Key className="w-4 h-4" />
                      GitHub Personal Access Token *
                    </label>
                    <input
                      type="password"
                      className="form-input"
                      value={formData.githubToken}
                      onChange={(e) => handleInputChange('githubToken', e.target.value)}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    />
                    <small className="form-help">
                      <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer">
                        Create a token here
                      </a> with 'repo' permissions
                    </small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <User className="w-4 h-4" />
                      GitHub Username *
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="your-github-username"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Repository Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.repoName}
                    onChange={(e) => handleInputChange('repoName', e.target.value)}
                    placeholder="my-portfolio"
                  />
                </div>
              </div>

              {/* Netlify Configuration */}
              <div className="form-section">
                <div className="section-header">
                  <Globe className="w-6 h-6" />
                  <div>
                    <h3>Netlify Configuration</h3>
                    <p>We'll deploy your site and give you a live URL</p>
                  </div>
                </div>
                
                <div className="grid grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      <Key className="w-4 h-4" />
                      Netlify Access Token *
                    </label>
                    <input
                      type="password"
                      className="form-input"
                      value={formData.netlifyToken}
                      onChange={(e) => handleInputChange('netlifyToken', e.target.value)}
                      placeholder="nfp_xxxxxxxxxxxxxxxxxxxx"
                    />
                    <small className="form-help">
                      <a href="https://app.netlify.com/user/applications#personal-access-tokens" target="_blank" rel="noopener noreferrer">
                        Create a token here
                      </a>
                    </small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Site Name *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.siteName}
                      onChange={(e) => handleInputChange('siteName', e.target.value)}
                      placeholder="my-awesome-portfolio"
                    />
                    <small className="form-help">
                      Your site will be available at: {formData.siteName}.netlify.app
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <div className="deploy-actions">
              <button
                onClick={() => navigate('/preview')}
                className="btn btn-secondary"
              >
                Back to Preview
              </button>
              <button
                onClick={deployPortfolio}
                className="btn btn-primary btn-large"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Deploy Portfolio
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {deploymentStep === 'deploying' && (
          <div className="deployment-progress">
            <div className="progress-card">
              <div className="progress-header">
                <Rocket className="w-8 h-8 text-blue-500" />
                <h2>Deploying Your Portfolio</h2>
                <p>Please wait while we set up your portfolio...</p>
              </div>
              
              <div className="progress-steps">
                <div className="progress-step active">
                  <CheckCircle className="w-5 h-5" />
                  <span>Generating portfolio files</span>
                </div>
                <div className="progress-step active">
                  <div className="spinner" />
                  <span>Creating GitHub repository</span>
                </div>
                <div className="progress-step">
                  <div className="step-circle" />
                  <span>Deploying to Netlify</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {deploymentStep === 'success' && deploymentResult && (
          <div className="deployment-success">
            <div className="success-card">
              <div className="success-header">
                <CheckCircle className="w-12 h-12 text-green-500" />
                <h2>Portfolio Deployed Successfully!</h2>
                <p>Your portfolio is now live and accessible to the world</p>
              </div>

              <div className="success-links">
                <div className="link-card">
                  <Github className="w-6 h-6" />
                  <div>
                    <h4>GitHub Repository</h4>
                    <p>Your source code is stored here</p>
                    <a 
                      href={deploymentResult.github.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link"
                    >
                      View Repository <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="link-card">
                  <Globe className="w-6 h-6" />
                  <div>
                    <h4>Live Website</h4>
                    <p>Your portfolio is live at this URL</p>
                    <a 
                      href={deploymentResult.netlify.siteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link"
                    >
                      Visit Site <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="success-actions">
                <button
                  onClick={() => navigate('/')}
                  className="btn btn-secondary"
                >
                  Create Another Portfolio
                </button>
                <a
                  href={deploymentResult.netlify.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <Globe className="w-4 h-4" />
                  View Live Site
                </a>
              </div>
            </div>
          </div>
        )}

        {deploymentStep === 'error' && (
          <div className="deployment-error">
            <div className="error-card">
              <AlertCircle className="w-12 h-12 text-red-500" />
              <h2>Deployment Failed</h2>
              <p>Something went wrong during deployment. Please check your tokens and try again.</p>
              <div className="error-actions">
                <button
                  onClick={resetDeployment}
                  className="btn btn-primary"
                >
                  Try Again
                </button>
                <button
                  onClick={() => navigate('/preview')}
                  className="btn btn-secondary"
                >
                  Back to Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .deploy {
          padding: 2rem 0;
          min-height: calc(100vh - 80px);
        }

        .deploy-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .deploy-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #111827;
        }

        .deploy-header p {
          font-size: 1.125rem;
          color: #6b7280;
        }

        .deploy-form {
          max-width: 800px;
          margin: 0 auto;
        }

        .form-sections {
          space-y: 2rem;
          margin-bottom: 2rem;
        }

        .form-section {
          background: white;
          padding: 2rem;
          border-radius: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .section-header h3 {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #374151;
        }

        .section-header p {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .form-help {
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .form-help a {
          color: #3b82f6;
          text-decoration: none;
        }

        .form-help a:hover {
          text-decoration: underline;
        }

        .deploy-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .deployment-progress,
        .deployment-success,
        .deployment-error {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }

        .progress-card,
        .success-card,
        .error-card {
          background: white;
          padding: 3rem 2rem;
          border-radius: 0.75rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .progress-header,
        .success-header {
          margin-bottom: 2rem;
        }

        .progress-header h2,
        .success-header h2 {
          margin: 1rem 0 0.5rem;
          color: #374151;
        }

        .progress-steps {
          space-y: 1rem;
          text-align: left;
        }

        .progress-step {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 0.5rem;
        }

        .progress-step.active {
          background: #eff6ff;
          color: #1d4ed8;
        }

        .step-circle {
          width: 20px;
          height: 20px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
        }

        .success-links {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }

        .link-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          text-align: left;
        }

        .link-card h4 {
          margin: 0 0 0.25rem;
          color: #374151;
          font-weight: 600;
        }

        .link-card p {
          margin: 0 0 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
          font-size: 0.875rem;
        }

        .link:hover {
          text-decoration: underline;
        }

        .success-actions,
        .error-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .deploy-actions {
            flex-direction: column;
            gap: 1rem;
          }

          .success-actions,
          .error-actions {
            flex-direction: column;
          }

          .link-card {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Deploy;