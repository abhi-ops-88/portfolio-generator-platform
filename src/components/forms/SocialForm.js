import React from 'react';
import { Share2, Linkedin, Github, Twitter, Instagram } from 'lucide-react';

const SocialForm = ({ data, updateData }) => {
  const handleChange = (field, value) => {
    updateData('social', {
      ...data.social,
      [field]: value
    });
  };

  return (
    <div className="social-form">
      <div className="form-section">
        <h3 className="section-title">
          <Share2 className="w-5 h-5" />
          Social Media Links
        </h3>
        <p className="section-description">
          Add your social media profiles to help visitors connect with you
        </p>
        
        <div className="social-inputs">
          <div className="form-group">
            <label className="form-label">
              <Linkedin className="w-4 h-4" />
              LinkedIn Profile
            </label>
            <input
              type="url"
              className="form-input"
              value={data.social.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/your-profile"
            />
            <small className="form-help">Your professional LinkedIn profile URL</small>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Github className="w-4 h-4" />
              GitHub Profile
            </label>
            <input
              type="url"
              className="form-input"
              value={data.social.github}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="https://github.com/your-username"
            />
            <small className="form-help">Your GitHub profile to showcase your code</small>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Twitter className="w-4 h-4" />
              Twitter Profile
            </label>
            <input
              type="url"
              className="form-input"
              value={data.social.twitter}
              onChange={(e) => handleChange('twitter', e.target.value)}
              placeholder="https://twitter.com/your-handle"
            />
            <small className="form-help">Your Twitter profile (optional)</small>
          </div>

          <div className="form-group">
            <label className="form-label">
              <Instagram className="w-4 h-4" />
              Instagram Profile
            </label>
            <input
              type="url"
              className="form-input"
              value={data.social.instagram}
              onChange={(e) => handleChange('instagram', e.target.value)}
              placeholder="https://instagram.com/your-handle"
            />
            <small className="form-help">Your Instagram profile (optional)</small>
          </div>
        </div>

        <div className="social-preview">
          <h4>Preview</h4>
          <p>These links will appear as social icons in your portfolio:</p>
          <div className="social-icons-preview">
            {data.social.linkedin && (
              <div className="social-icon-preview">
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </div>
            )}
            {data.social.github && (
              <div className="social-icon-preview">
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </div>
            )}
            {data.social.twitter && (
              <div className="social-icon-preview">
                <Twitter className="w-5 h-5" />
                <span>Twitter</span>
              </div>
            )}
            {data.social.instagram && (
              <div className="social-icon-preview">
                <Instagram className="w-5 h-5" />
                <span>Instagram</span>
              </div>
            )}
            {!data.social.linkedin && !data.social.github && !data.social.twitter && !data.social.instagram && (
              <p className="no-social">No social links added yet</p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .social-form {
          max-width: 600px;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .section-description {
          color: #6b7280;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .social-inputs {
          space-y: 1.5rem;
          margin-bottom: 2rem;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #374151;
        }

        .form-help {
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .social-preview {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .social-preview h4 {
          margin: 0 0 0.5rem;
          color: #374151;
          font-weight: 600;
        }

        .social-preview p {
          margin: 0 0 1rem;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .social-icons-preview {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .social-icon-preview {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          color: #374151;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .no-social {
          color: #9ca3af;
          font-style: italic;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default SocialForm;