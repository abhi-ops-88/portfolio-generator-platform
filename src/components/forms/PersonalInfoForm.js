import React from 'react';
import { User, Mail, Briefcase, MessageSquare } from 'lucide-react';
import ImageUpload from '../ImageUpload';

const PersonalInfoForm = ({ data, updateData, files, updateFiles }) => {
  const handleChange = (field, value) => {
    updateData('personalInfo', {
      ...data.personalInfo,
      [field]: value
    });
  };

  return (
    <div className="personal-info-form">
      <div className="form-section">
        <h3 className="section-title">
          <User className="w-5 h-5" />
          Personal Information
        </h3>
        
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              value={data.personalInfo.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Professional Title *</label>
            <input
              type="text"
              className="form-input"
              value={data.personalInfo.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Full Stack Developer"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email Address *</label>
          <input
            type="email"
            className="form-input"
            value={data.personalInfo.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john.doe@example.com"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Professional Tagline</label>
          <textarea
            className="form-textarea"
            value={data.personalInfo.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
            placeholder="Passionate developer creating innovative solutions..."
            rows="3"
          />
          <small className="form-help">A brief description that appears on your homepage</small>
        </div>
      </div>

      <div className="form-section">
        <h3 className="section-title">
          <MessageSquare className="w-5 h-5" />
          Images
        </h3>
        
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Profile Image</label>
            <ImageUpload
              onImageSelect={(file) => updateFiles('profileImage', file)}
              currentImage={files.profileImage}
              placeholder="Upload your profile photo"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Background Image</label>
            <ImageUpload
              onImageSelect={(file) => updateFiles('backgroundImage', file)}
              currentImage={files.backgroundImage}
              placeholder="Upload a background image for your hero section"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .personal-info-form {
          space-y: 2rem;
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
          margin-bottom: 1.5rem;
          color: #374151;
        }

        .form-help {
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};

export default PersonalInfoForm;