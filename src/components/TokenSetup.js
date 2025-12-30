import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Key, Github, Globe, Zap, Eye, EyeOff, ExternalLink } from 'lucide-react';
import autoDeployService from '../services/autoDeployService';

const TokenSetup = ({ onTokensConfigured }) => {
  const [tokens, setTokens] = useState({
    github: '',
    vercel: '',
    netlify: ''
  });

  const [showTokens, setShowTokens] = useState({
    github: false,
    vercel: false,
    netlify: false
  });

  const [existingTokens, setExistingTokens] = useState({
    github: false,
    vercel: false,
    netlify: false
  });

  useEffect(() => {
    // Check for existing tokens
    const existing = autoDeployService.hasDeploymentTokens();
    setExistingTokens(existing);
  }, []);

  const handleTokenChange = (platform, value) => {
    setTokens(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const toggleTokenVisibility = (platform) => {
    setShowTokens(prev => ({
      ...prev,
      [platform]: !prev[platform]
    }));
  };

  const saveToken = (platform) => {
    const token = tokens[platform].trim();
    if (!token) {
      toast.error(`Please enter a valid ${platform} token`);
      return;
    }

    autoDeployService.setDeploymentToken(platform, token);
    setExistingTokens(prev => ({
      ...prev,
      [platform]: true
    }));
    
    setTokens(prev => ({
      ...prev,
      [platform]: ''
    }));

    toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} token saved successfully!`);
    
    if (onTokensConfigured) {
      onTokensConfigured();
    }
  };

  const removeToken = (platform) => {
    localStorage.removeItem(`${platform}_token`);
    setExistingTokens(prev => ({
      ...prev,
      [platform]: false
    }));
    toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} token removed`);
  };

  const platforms = [
    {
      id: 'github',
      name: 'GitHub',
      icon: Github,
      description: 'Required for repository creation and GitHub Pages deployment',
      setupUrl: 'https://github.com/settings/tokens',
      scopes: ['repo', 'workflow'],
      color: '#333'
    },
    {
      id: 'vercel',
      name: 'Vercel',
      icon: Zap,
      description: 'Optional: For deploying to Vercel platform',
      setupUrl: 'https://vercel.com/account/tokens',
      scopes: ['Project creation', 'Deployment'],
      color: '#000'
    },
    {
      id: 'netlify',
      name: 'Netlify',
      icon: Globe,
      description: 'Optional: For deploying to Netlify platform',
      setupUrl: 'https://app.netlify.com/user/applications#personal-access-tokens',
      scopes: ['Site creation', 'Deployment'],
      color: '#00c7b7'
    }
  ];

  return (
    <div className="token-setup">
      <div className="token-setup-header">
        <Key className="w-6 h-6" />
        <h2>Deployment Configuration</h2>
        <p>Configure your deployment tokens to enable automatic portfolio deployment</p>
      </div>

      <div className="platforms-grid">
        {platforms.map((platform) => {
          const Icon = platform.icon;
          const hasToken = existingTokens[platform.id];
          
          return (
            <div key={platform.id} className="platform-card">
              <div className="platform-header">
                <div className="platform-info">
                  <Icon className="w-6 h-6" style={{ color: platform.color }} />
                  <div>
                    <h3>{platform.name}</h3>
                    <p>{platform.description}</p>
                  </div>
                </div>
                <div className={`status-badge ${hasToken ? 'configured' : 'pending'}`}>
                  {hasToken ? 'Configured' : 'Not Configured'}
                </div>
              </div>

              {!hasToken ? (
                <div className="token-input-section">
                  <div className="setup-instructions">
                    <p><strong>Required scopes:</strong> {platform.scopes.join(', ')}</p>
                    <a 
                      href={platform.setupUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="setup-link"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Create {platform.name} Token
                    </a>
                  </div>

                  <div className="token-input-group">
                    <div className="input-with-toggle">
                      <input
                        type={showTokens[platform.id] ? 'text' : 'password'}
                        placeholder={`Enter your ${platform.name} token`}
                        value={tokens[platform.id]}
                        onChange={(e) => handleTokenChange(platform.id, e.target.value)}
                        className="token-input"
                      />
                      <button
                        type="button"
                        onClick={() => toggleTokenVisibility(platform.id)}
                        className="toggle-visibility"
                      >
                        {showTokens[platform.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      onClick={() => saveToken(platform.id)}
                      className="save-token-btn"
                      disabled={!tokens[platform.id].trim()}
                    >
                      Save Token
                    </button>
                  </div>
                </div>
              ) : (
                <div className="token-configured">
                  <p className="configured-message">✅ Token configured and ready for deployment</p>
                  <button
                    onClick={() => removeToken(platform.id)}
                    className="remove-token-btn"
                  >
                    Remove Token
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="setup-note">
        <p><strong>Note:</strong> GitHub token is required for basic functionality. Vercel and Netlify tokens are optional but enable additional deployment options.</p>
      </div>

      <style jsx>{`
        .token-setup {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }

        .token-setup-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .token-setup-header h2 {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .token-setup-header p {
          color: #6b7280;
          font-size: 1.125rem;
        }

        .platforms-grid {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .platform-card {
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .platform-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .platform-info {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .platform-info h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #111827;
        }

        .platform-info p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.configured {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .setup-instructions {
          margin-bottom: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .setup-instructions p {
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #374151;
        }

        .setup-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #3b82f6;
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .setup-link:hover {
          color: #2563eb;
        }

        .token-input-group {
          display: flex;
          gap: 0.75rem;
          align-items: flex-end;
        }

        .input-with-toggle {
          position: relative;
          flex: 1;
        }

        .token-input {
          width: 100%;
          padding: 0.75rem 3rem 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 0.875rem;
          font-family: monospace;
        }

        .token-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .toggle-visibility {
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

        .toggle-visibility:hover {
          color: #374151;
        }

        .save-token-btn {
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .save-token-btn:hover:not(:disabled) {
          background: #2563eb;
        }

        .save-token-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .token-configured {
          padding: 1rem;
          background: #f0fdf4;
          border-radius: 8px;
          border: 1px solid #bbf7d0;
        }

        .configured-message {
          color: #166534;
          font-weight: 500;
          margin-bottom: 0.75rem;
        }

        .remove-token-btn {
          padding: 0.5rem 1rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .remove-token-btn:hover {
          background: #dc2626;
        }

        .setup-note {
          padding: 1rem;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
          text-align: center;
        }

        .setup-note p {
          color: #1e40af;
          font-size: 0.875rem;
          margin: 0;
        }

        @media (max-width: 768px) {
          .token-setup {
            padding: 1rem;
          }

          .platform-header {
            flex-direction: column;
            gap: 1rem;
          }

          .token-input-group {
            flex-direction: column;
          }

          .save-token-btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default TokenSetup;