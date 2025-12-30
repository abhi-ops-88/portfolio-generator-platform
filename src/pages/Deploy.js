import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Github, Globe, Key, User, Rocket, CheckCircle, AlertCircle, ExternalLink, Zap, Settings, Download } from 'lucide-react';
import JSZip from 'jszip';
import { generatePortfolioFiles } from '../utils/portfolioGenerator';

const Deploy = () => {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState(null);
  const [portfolioFiles, setPortfolioFiles] = useState(null);
  const [deploymentStep, setDeploymentStep] = useState('platform'); // platform, setup, deploying, success, error
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [formData, setFormData] = useState({
    githubToken: '',
    netlifyToken: '',
    vercelToken: '',
    username: '',
    repoName: '',
    siteName: '',
    projectName: ''
  });
  const [deploymentResult, setDeploymentResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('portfolioData');
    
    if (savedData) {
      const data = JSON.parse(savedData);
      setPortfolioData(data);
      
      // Generate portfolio files from data
      const generatedFiles = generatePortfolioFiles(data);
      setPortfolioFiles(generatedFiles);
      
      // Auto-fill some fields
      setFormData(prev => ({
        ...prev,
        username: data.personalInfo?.name?.toLowerCase().replace(/\s+/g, '-') || '',
        repoName: `${data.personalInfo?.name?.toLowerCase().replace(/\s+/g, '-')}-portfolio` || 'my-portfolio',
        siteName: `${data.personalInfo?.name?.toLowerCase().replace(/\s+/g, '-')}-portfolio` || 'my-portfolio',
        projectName: `${data.personalInfo?.name?.toLowerCase().replace(/\s+/g, '-')}-portfolio` || 'my-portfolio'
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
    if (!formData.username.trim()) {
      toast.error('GitHub username is required');
      return false;
    }
    if (!formData.repoName.trim()) {
      toast.error('Repository name is required');
      return false;
    }

    if (selectedPlatform === 'netlify' && !formData.netlifyToken.trim()) {
      toast.error('Netlify token is required');
      return false;
    }
    if (selectedPlatform === 'netlify' && !formData.siteName.trim()) {
      toast.error('Site name is required');
      return false;
    }
    if (selectedPlatform === 'vercel' && !formData.vercelToken.trim()) {
      toast.error('Vercel token is required');
      return false;
    }
    if (selectedPlatform === 'vercel' && !formData.projectName.trim()) {
      toast.error('Project name is required');
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

      // Step 2: Deploy to selected platform
      let deploymentResponse;
      if (selectedPlatform === 'netlify') {
        toast.info('Deploying to Netlify...');
        deploymentResponse = await fetch('/api/netlify/deploy', {
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
      } else if (selectedPlatform === 'vercel') {
        toast.info('Deploying to Vercel...');
        deploymentResponse = await fetch('/api/vercel/deploy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            repoUrl: githubResult.repoUrl,
            projectName: formData.projectName,
            vercelToken: formData.vercelToken
          })
        });
      } else if (selectedPlatform === 'github-pages') {
        toast.info('Setting up GitHub Pages...');
        deploymentResponse = await fetch('/api/github/setup-pages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: formData.username,
            repoName: formData.repoName,
            githubToken: formData.githubToken
          })
        });
      }

      const deployResult = await deploymentResponse.json();

      if (!deployResult.success) {
        throw new Error(deployResult.message || `Failed to deploy to ${selectedPlatform}`);
      }

      // Success!
      setDeploymentResult({
        github: githubResult,
        deployment: deployResult,
        platform: selectedPlatform
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
    setDeploymentStep('platform');
    setDeploymentResult(null);
  };

  const downloadPortfolio = () => {
    if (!portfolioFiles) return;
    
    // Create a zip file with all portfolio files
    const zip = new JSZip();
    
    Object.entries(portfolioFiles).forEach(([filename, content]) => {
      zip.file(filename, content);
    });
    
    zip.generateAsync({ type: 'blob' }).then(content => {
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${formData.repoName || 'portfolio'}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const platforms = [
    {
      id: 'netlify',
      name: 'Netlify',
      icon: Globe,
      description: 'Deploy with continuous deployment and instant rollbacks',
      features: ['Automatic HTTPS', 'Global CDN', 'Form handling', 'Instant rollbacks'],
      color: 'bg-teal-500'
    },
    {
      id: 'vercel',
      name: 'Vercel',
      icon: Zap,
      description: 'Deploy with edge functions and automatic optimizations',
      features: ['Edge Network', 'Automatic optimizations', 'Analytics', 'Preview deployments'],
      color: 'bg-black'
    },
    {
      id: 'github-pages',
      name: 'GitHub Pages',
      icon: Github,
      description: 'Free hosting directly from your GitHub repository',
      features: ['Free hosting', 'Custom domains', 'HTTPS', 'Jekyll support'],
      color: 'bg-gray-800'
    }
  ];

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
          <p>Choose your hosting platform and deploy your portfolio with automatic setup</p>
        </div>

        {deploymentStep === 'platform' && (
          <div className="platform-selection">
            <h2>Choose Your Hosting Platform</h2>
            <div className="platforms-grid">
              {platforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <div
                    key={platform.id}
                    className={`platform-card ${selectedPlatform === platform.id ? 'selected' : ''}`}
                    onClick={() => setSelectedPlatform(platform.id)}
                  >
                    <div className={`platform-icon ${platform.color}`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <h3>{platform.name}</h3>
                    <p>{platform.description}</p>
                    <ul className="platform-features">
                      {platform.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            
            <div className="platform-actions">
              <button
                onClick={() => navigate('/preview')}
                className="btn btn-secondary"
              >
                Back to Preview
              </button>
              <button
                onClick={downloadPortfolio}
                className="btn btn-outline"
              >
                <Download className="w-4 h-4" />
                Download Files
              </button>
              <button
                onClick={() => setDeploymentStep('setup')}
                className="btn btn-primary"
                disabled={!selectedPlatform}
              >
                Continue with {selectedPlatform ? platforms.find(p => p.id === selectedPlatform)?.name : 'Platform'}
              </button>
            </div>
          </div>
        )}

        {deploymentStep === 'setup' && (
          <div className="deploy-form">
            <div className="setup-header">
              <button
                onClick={() => setDeploymentStep('platform')}
                className="btn btn-ghost"
              >
                ← Back to Platform Selection
              </button>
              <h2>Configure {platforms.find(p => p.id === selectedPlatform)?.name} Deployment</h2>
            </div>

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

              {/* Platform-specific Configuration */}
              {selectedPlatform === 'netlify' && (
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
              )}

              {selectedPlatform === 'vercel' && (
                <div className="form-section">
                  <div className="section-header">
                    <Zap className="w-6 h-6" />
                    <div>
                      <h3>Vercel Configuration</h3>
                      <p>Deploy with edge functions and automatic optimizations</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-2">
                    <div className="form-group">
                      <label className="form-label">
                        <Key className="w-4 h-4" />
                        Vercel Access Token *
                      </label>
                      <input
                        type="password"
                        className="form-input"
                        value={formData.vercelToken}
                        onChange={(e) => handleInputChange('vercelToken', e.target.value)}
                        placeholder="xxxxxxxxxxxxxxxxxxxxxxxxx"
                      />
                      <small className="form-help">
                        <a href="https://vercel.com/account/tokens" target="_blank" rel="noopener noreferrer">
                          Create a token here
                        </a>
                      </small>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Project Name *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={formData.projectName}
                        onChange={(e) => handleInputChange('projectName', e.target.value)}
                        placeholder="my-awesome-portfolio"
                      />
                      <small className="form-help">
                        Your site will be available at: {formData.projectName}.vercel.app
                      </small>
                    </div>
                  </div>
                </div>
              )}

              {selectedPlatform === 'github-pages' && (
                <div className="form-section">
                  <div className="section-header">
                    <Github className="w-6 h-6" />
                    <div>
                      <h3>GitHub Pages Configuration</h3>
                      <p>Free hosting directly from your GitHub repository</p>
                    </div>
                  </div>
                  
                  <div className="info-box">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <h4>No additional configuration needed!</h4>
                      <p>GitHub Pages will be automatically enabled for your repository. Your site will be available at: <strong>{formData.username}.github.io/{formData.repoName}</strong></p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="deploy-actions">
              <button
                onClick={() => setDeploymentStep('platform')}
                className="btn btn-secondary"
              >
                Back to Platform Selection
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
                    Deploy to {platforms.find(p => p.id === selectedPlatform)?.name}
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
                  {selectedPlatform === 'netlify' && <Globe className="w-6 h-6" />}
                  {selectedPlatform === 'vercel' && <Zap className="w-6 h-6" />}
                  {selectedPlatform === 'github-pages' && <Github className="w-6 h-6" />}
                  <div>
                    <h4>Live Website</h4>
                    <p>Your portfolio is live at this URL</p>
                    <a 
                      href={deploymentResult.deployment.siteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link"
                    >
                      Visit Site <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              {deploymentResult.deployment.adminUrl && (
                <div className="admin-info">
                  <Settings className="w-5 h-5" />
                  <div>
                    <h4>Manage Your Deployment</h4>
                    <a 
                      href={deploymentResult.deployment.adminUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="link"
                    >
                      Open {platforms.find(p => p.id === selectedPlatform)?.name} Dashboard <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              )}

              <div className="success-actions">
                <button
                  onClick={() => navigate('/')}
                  className="btn btn-secondary"
                >
                  Create Another Portfolio
                </button>
                <a
                  href={deploymentResult.deployment.siteUrl}
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

        /* Platform Selection Styles */
        .platform-selection {
          max-width: 1200px;
          margin: 0 auto;
        }

        .platform-selection h2 {
          text-align: center;
          font-size: 1.875rem;
          font-weight: 600;
          margin-bottom: 2rem;
          color: #374151;
        }

        .platforms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .platform-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .platform-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .platform-card.selected {
          border-color: #3b82f6;
          background: #eff6ff;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .platform-icon {
          width: 4rem;
          height: 4rem;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .platform-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .platform-card p {
          color: #6b7280;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .platform-features {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .platform-features li {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
          position: relative;
          padding-left: 1rem;
        }

        .platform-features li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }

        .platform-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        /* Setup Form Styles */
        .deploy-form {
          max-width: 800px;
          margin: 0 auto;
        }

        .setup-header {
          margin-bottom: 2rem;
        }

        .setup-header h2 {
          font-size: 1.875rem;
          font-weight: 600;
          margin-top: 1rem;
          color: #374151;
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

        .info-box {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 0.5rem;
        }

        .info-box h4 {
          margin: 0 0 0.25rem;
          color: #166534;
          font-weight: 600;
        }

        .info-box p {
          margin: 0;
          color: #166534;
          font-size: 0.875rem;
        }

        .admin-info {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }

        .admin-info h4 {
          margin: 0 0 0.25rem;
          color: #374151;
          font-weight: 600;
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
          .platform-actions {
            flex-direction: column;
            gap: 1rem;
          }

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

          .platforms-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Deploy;