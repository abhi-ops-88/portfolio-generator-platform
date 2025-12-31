import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Github, Globe, Zap, CheckCircle, ArrowRight, Settings, Eye, Download } from 'lucide-react';
import autoDeployService from '../services/autoDeployService';
import JSZip from 'jszip';

const DeployOptions = () => {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState(null);
  const [portfolioFiles, setPortfolioFiles] = useState(null);
  const [availablePlatforms, setAvailablePlatforms] = useState([]);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [deploying, setDeploying] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState(null);

  useEffect(() => {
    // Load portfolio data and files
    const savedData = localStorage.getItem('portfolioData');
    const savedFiles = localStorage.getItem('generatedPortfolio');
    
    if (!savedData || !savedFiles) {
      toast.error('No portfolio data found. Please generate your portfolio first.');
      navigate('/generator');
      return;
    }

    setPortfolioData(JSON.parse(savedData));
    setPortfolioFiles(JSON.parse(savedFiles));

    // Check available deployment platforms
    const platforms = autoDeployService.getAvailablePlatforms();
    setAvailablePlatforms(platforms);
    
    // Set default platform
    if (platforms.includes('github')) {
      setSelectedPlatform('github');
    } else if (platforms.length > 0) {
      setSelectedPlatform(platforms[0]);
    }
  }, [navigate]);

  const deploymentPlatforms = [
    {
      id: 'github',
      name: 'GitHub Pages',
      icon: Github,
      description: 'Deploy to GitHub Pages for free hosting',
      features: ['Free hosting', 'Custom domain support', 'HTTPS enabled', 'Version control'],
      color: '#333',
      recommended: true
    },
    {
      id: 'vercel',
      name: 'Vercel',
      icon: Zap,
      description: 'Deploy to Vercel for fast global CDN',
      features: ['Global CDN', 'Instant deployments', 'Analytics', 'Custom domains'],
      color: '#000'
    },
    {
      id: 'netlify',
      name: 'Netlify',
      icon: Globe,
      description: 'Deploy to Netlify with continuous deployment',
      features: ['Continuous deployment', 'Form handling', 'Edge functions', 'Split testing'],
      color: '#00c7b7'
    }
  ];

  const handleDeploy = async () => {
    if (!selectedPlatform) {
      toast.error('Please select a deployment platform');
      return;
    }

    setDeploying(true);
    
    try {
      toast.info(`Deploying to ${selectedPlatform}...`);
      
      const result = await autoDeployService.autoDeployPortfolio(portfolioData, selectedPlatform);
      
      if (result.success) {
        setDeploymentResult(result);
        toast.success(`Portfolio deployed successfully to ${selectedPlatform}!`);
      } else {
        throw new Error(result.message || 'Deployment failed');
      }
    } catch (error) {
      console.error('Deployment error:', error);
      toast.error(`Deployment failed: ${error.message}`);
    } finally {
      setDeploying(false);
    }
  };

  const handleDownload = async () => {
    if (!portfolioFiles) return;

    try {
      const zip = new JSZip();
      
      Object.entries(portfolioFiles).forEach(([filename, content]) => {
        zip.file(filename, content);
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${portfolioData?.personalInfo?.name || 'portfolio'}-files.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Portfolio files downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download portfolio files');
    }
  };

  if (!portfolioData || !portfolioFiles) {
    return (
      <div className="deploy-options-loading">
        <div className="container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading deployment options...</p>
          </div>
        </div>
      </div>
    );
  }

  if (deploymentResult) {
    return (
      <div className="deployment-success">
        <div className="container">
          <div className="success-content">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h1>Portfolio Deployed Successfully!</h1>
            <p>Your portfolio has been deployed to {selectedPlatform} and is now live.</p>
            
            {deploymentResult.siteUrl && (
              <div className="deployment-info">
                <div className="site-url">
                  <strong>Live URL:</strong>
                  <a 
                    href={deploymentResult.siteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="site-link"
                  >
                    {deploymentResult.siteUrl}
                  </a>
                </div>
                
                {deploymentResult.repoUrl && (
                  <div className="repo-url">
                    <strong>Repository:</strong>
                    <a 
                      href={deploymentResult.repoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="repo-link"
                    >
                      {deploymentResult.repoUrl}
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="success-actions">
              <a
                href={deploymentResult.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <Globe className="w-4 h-4" />
                View Live Site
              </a>
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn-secondary"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="deploy-options">
      <div className="container">
        <div className="deploy-header">
          <h1>Choose Your Deployment Platform</h1>
          <p>Select where you'd like to deploy your portfolio</p>
        </div>

        {availablePlatforms.length === 0 ? (
          <div className="no-platforms">
            <Settings className="w-16 h-16 text-gray-400" />
            <h2>No Deployment Platforms Configured</h2>
            <p>You need to configure at least one deployment platform to deploy your portfolio.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              <Settings className="w-4 h-4" />
              Configure Deployment
            </button>
          </div>
        ) : (
          <>
            <div className="platforms-grid">
              {deploymentPlatforms
                .filter(platform => availablePlatforms.includes(platform.id))
                .map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatform === platform.id;
                  
                  return (
                    <div
                      key={platform.id}
                      className={`platform-option ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedPlatform(platform.id)}
                    >
                      {platform.recommended && (
                        <div className="recommended-badge">Recommended</div>
                      )}
                      
                      <div className="platform-header">
                        <Icon className="w-8 h-8" style={{ color: platform.color }} />
                        <div>
                          <h3>{platform.name}</h3>
                          <p>{platform.description}</p>
                        </div>
                      </div>

                      <div className="platform-features">
                        <ul>
                          {platform.features.map((feature, index) => (
                            <li key={index}>
                              <CheckCircle className="w-4 h-4" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="selection-indicator">
                        {isSelected && <CheckCircle className="w-5 h-5 text-blue-500" />}
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="deploy-actions">
              <div className="action-buttons">
                <button
                  onClick={() => navigate('/preview')}
                  className="btn btn-secondary"
                >
                  <Eye className="w-4 h-4" />
                  Preview First
                </button>
                
                <button
                  onClick={handleDownload}
                  className="btn btn-secondary"
                >
                  <Download className="w-4 h-4" />
                  Download Files
                </button>
                
                <button
                  onClick={handleDeploy}
                  disabled={!selectedPlatform || deploying}
                  className="btn btn-primary"
                >
                  {deploying ? (
                    <>
                      <div className="spinner-small"></div>
                      Deploying...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      Deploy to {deploymentPlatforms.find(p => p.id === selectedPlatform)?.name}
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .deploy-options {
          min-height: calc(100vh - 80px);
          background: #f8fafc;
          padding: 2rem 0;
        }

        .deploy-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .deploy-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 1rem;
        }

        .deploy-header p {
          font-size: 1.125rem;
          color: #6b7280;
        }

        .no-platforms {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .no-platforms h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          margin: 1rem 0;
        }

        .no-platforms p {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .platforms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .platform-option {
          position: relative;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .platform-option:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .platform-option.selected {
          border-color: #3b82f6;
          background: #eff6ff;
          box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
        }

        .recommended-badge {
          position: absolute;
          top: -8px;
          right: 1rem;
          background: #10b981;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .platform-header {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .platform-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .platform-header p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .platform-features ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .platform-features li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #374151;
        }

        .platform-features li svg {
          color: #10b981;
        }

        .selection-indicator {
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        .deploy-actions {
          text-align: center;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .deployment-success {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
        }

        .success-content {
          text-align: center;
          background: white;
          padding: 3rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          max-width: 600px;
        }

        .success-content h1 {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin: 1rem 0;
        }

        .success-content p {
          color: #6b7280;
          font-size: 1.125rem;
          margin-bottom: 2rem;
        }

        .deployment-info {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
          text-align: left;
        }

        .site-url, .repo-url {
          margin-bottom: 1rem;
        }

        .site-url:last-child, .repo-url:last-child {
          margin-bottom: 0;
        }

        .site-link, .repo-link {
          display: block;
          color: #3b82f6;
          text-decoration: none;
          font-family: monospace;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          word-break: break-all;
        }

        .site-link:hover, .repo-link:hover {
          color: #2563eb;
        }

        .success-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .deploy-options-loading {
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

        .spinner-small {
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
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
          .deploy-header h1 {
            font-size: 2rem;
          }

          .platforms-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
            align-items: center;
          }

          .success-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default DeployOptions;