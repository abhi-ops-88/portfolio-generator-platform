import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Code, Download, ArrowRight, RefreshCw } from 'lucide-react';

const Preview = () => {
  const navigate = useNavigate();
  const [portfolioFiles, setPortfolioFiles] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [previewMode, setPreviewMode] = useState('desktop');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedFiles = localStorage.getItem('generatedPortfolio');
    const savedData = localStorage.getItem('portfolioData');
    
    if (savedFiles && savedData) {
      setPortfolioFiles(JSON.parse(savedFiles));
      setPortfolioData(JSON.parse(savedData));
      setLoading(false);
    } else {
      navigate('/generator');
    }
  }, [navigate]);

  const downloadPortfolio = () => {
    if (!portfolioFiles) return;

    // Create a zip file with all portfolio files
    const files = Object.entries(portfolioFiles);
    files.forEach(([filename, content]) => {
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const proceedToDeploy = () => {
    navigate('/deploy');
  };

  const goBackToEdit = () => {
    navigate('/generator');
  };

  if (loading) {
    return (
      <div className="preview-loading">
        <div className="container text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <h2>Loading Preview...</h2>
        </div>
      </div>
    );
  }

  if (!portfolioFiles) {
    return (
      <div className="preview-error">
        <div className="container text-center">
          <h2>No Portfolio Generated</h2>
          <p>Please generate your portfolio first.</p>
          <button onClick={() => navigate('/generator')} className="btn btn-primary">
            Go to Generator
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="preview">
      <div className="preview-header">
        <div className="container">
          <div className="header-content">
            <div className="header-info">
              <h1>Portfolio Preview</h1>
              <p>Review your generated portfolio before deployment</p>
            </div>
            <div className="header-actions">
              <div className="preview-controls">
                <button
                  className={`preview-btn ${previewMode === 'desktop' ? 'active' : ''}`}
                  onClick={() => setPreviewMode('desktop')}
                >
                  Desktop
                </button>
                <button
                  className={`preview-btn ${previewMode === 'tablet' ? 'active' : ''}`}
                  onClick={() => setPreviewMode('tablet')}
                >
                  Tablet
                </button>
                <button
                  className={`preview-btn ${previewMode === 'mobile' ? 'active' : ''}`}
                  onClick={() => setPreviewMode('mobile')}
                >
                  Mobile
                </button>
              </div>
              <div className="action-buttons">
                <button onClick={goBackToEdit} className="btn btn-secondary">
                  <Code className="w-4 h-4" />
                  Edit
                </button>
                <button onClick={downloadPortfolio} className="btn btn-secondary">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <button onClick={proceedToDeploy} className="btn btn-primary">
                  Deploy
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="preview-content">
        <div className="container">
          <div className={`preview-frame ${previewMode}`}>
            <div className="frame-header">
              <div className="frame-controls">
                <span className="frame-dot red"></span>
                <span className="frame-dot yellow"></span>
                <span className="frame-dot green"></span>
              </div>
              <div className="frame-url">
                {portfolioData?.personalInfo?.name?.toLowerCase().replace(/\s+/g, '-')}.netlify.app
              </div>
            </div>
            <div className="frame-content">
              <iframe
                srcDoc={portfolioFiles['index.html']}
                title="Portfolio Preview"
                className="preview-iframe"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="preview-info">
        <div className="container">
          <div className="info-grid">
            <div className="info-card">
              <h3>Portfolio Details</h3>
              <div className="info-list">
                <div className="info-item">
                  <span className="label">Name:</span>
                  <span className="value">{portfolioData?.personalInfo?.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Title:</span>
                  <span className="value">{portfolioData?.personalInfo?.title}</span>
                </div>
                <div className="info-item">
                  <span className="label">Projects:</span>
                  <span className="value">{portfolioData?.projects?.length || 0}</span>
                </div>
                <div className="info-item">
                  <span className="label">Skills:</span>
                  <span className="value">{portfolioData?.about?.skills?.length || 0}</span>
                </div>
              </div>
            </div>
            
            <div className="info-card">
              <h3>Generated Files</h3>
              <div className="files-list">
                {Object.keys(portfolioFiles).map((filename) => (
                  <div key={filename} className="file-item">
                    <Eye className="w-4 h-4" />
                    <span>{filename}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .preview {
          min-height: calc(100vh - 80px);
        }

        .preview-header {
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
          margin-bottom: 0.5rem;
          color: #111827;
        }

        .header-info p {
          color: #6b7280;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .preview-controls {
          display: flex;
          background: #f3f4f6;
          border-radius: 0.5rem;
          padding: 0.25rem;
        }

        .preview-btn {
          padding: 0.5rem 1rem;
          border: none;
          background: transparent;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .preview-btn.active {
          background: white;
          color: #3b82f6;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .preview-content {
          padding: 2rem 0;
          background: #f8fafc;
        }

        .preview-frame {
          background: white;
          border-radius: 0.75rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          margin: 0 auto;
          transition: all 0.3s ease;
        }

        .preview-frame.desktop {
          max-width: 1200px;
        }

        .preview-frame.tablet {
          max-width: 768px;
        }

        .preview-frame.mobile {
          max-width: 375px;
        }

        .frame-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          background: #f3f4f6;
          border-bottom: 1px solid #e5e7eb;
        }

        .frame-controls {
          display: flex;
          gap: 0.5rem;
        }

        .frame-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .frame-dot.red {
          background: #ef4444;
        }

        .frame-dot.yellow {
          background: #f59e0b;
        }

        .frame-dot.green {
          background: #10b981;
        }

        .frame-url {
          font-size: 0.875rem;
          color: #6b7280;
          font-family: monospace;
        }

        .frame-content {
          height: 600px;
          overflow: hidden;
        }

        .preview-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        .preview-info {
          padding: 2rem 0;
          background: white;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .info-card {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .info-card h3 {
          margin-bottom: 1rem;
          color: #374151;
          font-weight: 600;
        }

        .info-list {
          space-y: 0.75rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .info-item .label {
          color: #6b7280;
          font-weight: 500;
        }

        .info-item .value {
          color: #374151;
          font-weight: 600;
        }

        .files-list {
          space-y: 0.5rem;
        }

        .file-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .preview-loading,
        .preview-error {
          min-height: calc(100vh - 80px);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .header-actions {
            flex-direction: column;
            gap: 1rem;
          }

          .action-buttons {
            justify-content: center;
          }

          .preview-frame {
            margin: 0 1rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Preview;