import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Palette, Monitor, Moon, Sun, User, Bell, Shield, Database } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const Settings = () => {
  const { theme, setSpecificTheme, isAWSTheme, isBlackWhiteTheme } = useTheme();
  const { user } = useAuth();

  const themeOptions = [
    {
      id: 'aws',
      name: 'AWS Professional',
      description: 'Enterprise-grade orange and blue theme inspired by AWS design',
      icon: <Palette className="w-6 h-6" />,
      preview: 'linear-gradient(135deg, #FF9900 0%, #232F3E 100%)'
    },
    {
      id: 'blackwhite',
      name: 'Black & White',
      description: 'Clean, minimalist black and white professional theme',
      icon: <Moon className="w-6 h-6" />,
      preview: 'linear-gradient(135deg, #000000 0%, #404040 100%)'
    }
  ];

  return (
    <div className="aws-section">
      <div className="aws-container">
        <div className="aws-section-header">
          <h1 className="aws-section-title">Settings</h1>
          <p className="aws-section-subtitle">Customize your DeckFolio experience</p>
        </div>

        {/* Theme Settings */}
        <div className="settings-section">
          <div className="aws-card">
            <div className="aws-card-header">
              <h2 className="aws-card-title">
                <Palette className="w-5 h-5" />
                Theme Preferences
              </h2>
              <p className="aws-card-subtitle">Choose your preferred visual theme</p>
            </div>
            
            <div className="theme-options">
              {themeOptions.map((option) => (
                <div
                  key={option.id}
                  className={`theme-option ${theme === option.id ? 'active' : ''}`}
                  onClick={() => setSpecificTheme(option.id)}
                >
                  <div className="theme-preview" style={{ background: option.preview }}></div>
                  <div className="theme-info">
                    <div className="theme-header">
                      {option.icon}
                      <h3>{option.name}</h3>
                      {theme === option.id && <span className="active-badge">Active</span>}
                    </div>
                    <p>{option.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="theme-toggle-section">
              <div className="toggle-info">
                <h3>Quick Theme Toggle</h3>
                <p>Use this toggle to quickly switch between themes</p>
              </div>
              <ThemeToggle showLabel={true} size="large" />
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="settings-section">
          <div className="aws-card">
            <div className="aws-card-header">
              <h2 className="aws-card-title">
                <User className="w-5 h-5" />
                Account Information
              </h2>
            </div>
            
            <div className="account-info">
              <div className="info-row">
                <label>Display Name</label>
                <span>{user?.displayName || 'Not set'}</span>
              </div>
              <div className="info-row">
                <label>Email</label>
                <span>{user?.email}</span>
              </div>
              <div className="info-row">
                <label>Account Type</label>
                <span>Free Plan</span>
              </div>
              <div className="info-row">
                <label>Stories Created</label>
                <span>2/2</span>
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="settings-section">
          <div className="aws-card">
            <div className="aws-card-header">
              <h2 className="aws-card-title">
                <Bell className="w-5 h-5" />
                Preferences
              </h2>
            </div>
            
            <div className="preferences">
              <div className="preference-item">
                <div className="preference-info">
                  <h3>Email Notifications</h3>
                  <p>Receive updates about your deployments and new features</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="preference-item">
                <div className="preference-info">
                  <h3>Auto-save Progress</h3>
                  <p>Automatically save your portfolio progress as you work</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
              
              <div className="preference-item">
                <div className="preference-info">
                  <h3>Analytics</h3>
                  <p>Help improve DeckFolio by sharing anonymous usage data</p>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-section {
          margin-bottom: var(--spacing-2xl);
        }

        .theme-options {
          display: grid;
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-2xl);
        }

        .theme-option {
          display: flex;
          align-items: center;
          gap: var(--spacing-lg);
          padding: var(--spacing-lg);
          border: 2px solid var(--aws-gray-200);
          border-radius: var(--radius-lg);
          cursor: pointer;
          transition: var(--transition-normal);
        }

        .theme-option:hover {
          border-color: var(--aws-orange);
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .theme-option.active {
          border-color: var(--aws-orange);
          background: rgba(255, 153, 0, 0.05);
        }

        [data-theme="blackwhite"] .theme-option {
          border-color: var(--gray-300);
        }

        [data-theme="blackwhite"] .theme-option:hover,
        [data-theme="blackwhite"] .theme-option.active {
          border-color: var(--primary-black);
        }

        [data-theme="blackwhite"] .theme-option.active {
          background: rgba(0, 0, 0, 0.05);
        }

        .theme-preview {
          width: 80px;
          height: 60px;
          border-radius: var(--radius-md);
          border: 1px solid var(--aws-gray-300);
          flex-shrink: 0;
        }

        .theme-info {
          flex: 1;
        }

        .theme-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }

        .theme-header h3 {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--aws-blue);
        }

        [data-theme="blackwhite"] .theme-header h3 {
          color: var(--primary-black);
        }

        .active-badge {
          background: var(--aws-orange);
          color: var(--aws-white);
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        [data-theme="blackwhite"] .active-badge {
          background: var(--primary-black);
          color: var(--primary-white);
        }

        .theme-info p {
          margin: 0;
          color: var(--aws-gray-600);
          font-size: 0.875rem;
        }

        .theme-toggle-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: var(--spacing-lg);
          border-top: 1px solid var(--aws-gray-200);
        }

        .toggle-info h3 {
          margin: 0 0 var(--spacing-xs) 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--aws-blue);
        }

        [data-theme="blackwhite"] .toggle-info h3 {
          color: var(--primary-black);
        }

        .toggle-info p {
          margin: 0;
          color: var(--aws-gray-600);
          font-size: 0.875rem;
        }

        .account-info {
          display: grid;
          gap: var(--spacing-lg);
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-md) 0;
          border-bottom: 1px solid var(--aws-gray-200);
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-row label {
          font-weight: 500;
          color: var(--aws-gray-700);
        }

        .info-row span {
          color: var(--aws-gray-800);
          font-weight: 500;
        }

        .preferences {
          display: grid;
          gap: var(--spacing-lg);
        }

        .preference-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-lg) 0;
          border-bottom: 1px solid var(--aws-gray-200);
        }

        .preference-item:last-child {
          border-bottom: none;
        }

        .preference-info h3 {
          margin: 0 0 var(--spacing-xs) 0;
          font-size: 1rem;
          font-weight: 600;
          color: var(--aws-blue);
        }

        [data-theme="blackwhite"] .preference-info h3 {
          color: var(--primary-black);
        }

        .preference-info p {
          margin: 0;
          color: var(--aws-gray-600);
          font-size: 0.875rem;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--aws-gray-300);
          transition: var(--transition-fast);
          border-radius: 34px;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: var(--aws-white);
          transition: var(--transition-fast);
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: var(--aws-orange);
        }

        [data-theme="blackwhite"] input:checked + .slider {
          background-color: var(--primary-black);
        }

        input:checked + .slider:before {
          transform: translateX(26px);
        }

        @media (max-width: 768px) {
          .theme-option {
            flex-direction: column;
            text-align: center;
          }

          .theme-toggle-section {
            flex-direction: column;
            gap: var(--spacing-lg);
            text-align: center;
          }

          .preference-item {
            flex-direction: column;
            gap: var(--spacing-md);
            text-align: center;
          }

          .info-row {
            flex-direction: column;
            gap: var(--spacing-sm);
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Settings;