import React from 'react';
import { Palette, Eye } from 'lucide-react';
import { ChromePicker } from 'react-color';

const ThemeForm = ({ data, updateData }) => {
  const [showColorPicker, setShowColorPicker] = React.useState(null);

  const handleColorChange = (field, color) => {
    updateData('theme', {
      ...data.theme,
      [field]: color.hex
    });
  };

  const presetThemes = [
    {
      name: 'Ocean Blue',
      primaryColor: '#3b82f6',
      accentColor: '#ffd700',
      primaryColorDark: '#2563eb'
    },
    {
      name: 'Forest Green',
      primaryColor: '#10b981',
      accentColor: '#f59e0b',
      primaryColorDark: '#059669'
    },
    {
      name: 'Purple Gradient',
      primaryColor: '#8b5cf6',
      accentColor: '#f472b6',
      primaryColorDark: '#7c3aed'
    },
    {
      name: 'Sunset Orange',
      primaryColor: '#f97316',
      accentColor: '#fbbf24',
      primaryColorDark: '#ea580c'
    },
    {
      name: 'Deep Red',
      primaryColor: '#dc2626',
      accentColor: '#fbbf24',
      primaryColorDark: '#b91c1c'
    },
    {
      name: 'Teal',
      primaryColor: '#0d9488',
      accentColor: '#f59e0b',
      primaryColorDark: '#0f766e'
    }
  ];

  const applyPresetTheme = (theme) => {
    updateData('theme', theme);
  };

  return (
    <div className="theme-form">
      <div className="form-section">
        <h3 className="section-title">
          <Palette className="w-5 h-5" />
          Theme & Colors
        </h3>
        <p className="section-description">
          Customize the colors of your portfolio to match your personal brand
        </p>

        {/* Preset Themes */}
        <div className="preset-themes">
          <h4>Quick Themes</h4>
          <div className="themes-grid">
            {presetThemes.map((theme, index) => (
              <div
                key={index}
                className="theme-preset"
                onClick={() => applyPresetTheme(theme)}
              >
                <div className="theme-colors">
                  <div 
                    className="color-circle primary"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <div 
                    className="color-circle accent"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                </div>
                <span className="theme-name">{theme.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Colors */}
        <div className="custom-colors">
          <h4>Custom Colors</h4>
          <div className="color-inputs">
            <div className="color-input-group">
              <label className="form-label">Primary Color</label>
              <div className="color-input">
                <div
                  className="color-swatch"
                  style={{ backgroundColor: data.theme.primaryColor }}
                  onClick={() => setShowColorPicker(showColorPicker === 'primary' ? null : 'primary')}
                />
                <input
                  type="text"
                  className="form-input"
                  value={data.theme.primaryColor}
                  onChange={(e) => updateData('theme', { ...data.theme, primaryColor: e.target.value })}
                  placeholder="#3b82f6"
                />
              </div>
              {showColorPicker === 'primary' && (
                <div className="color-picker-popup">
                  <div 
                    className="color-picker-overlay"
                    onClick={() => setShowColorPicker(null)}
                  />
                  <ChromePicker
                    color={data.theme.primaryColor}
                    onChange={(color) => handleColorChange('primaryColor', color)}
                  />
                </div>
              )}
              <small className="form-help">Main color for buttons, links, and highlights</small>
            </div>

            <div className="color-input-group">
              <label className="form-label">Accent Color</label>
              <div className="color-input">
                <div
                  className="color-swatch"
                  style={{ backgroundColor: data.theme.accentColor }}
                  onClick={() => setShowColorPicker(showColorPicker === 'accent' ? null : 'accent')}
                />
                <input
                  type="text"
                  className="form-input"
                  value={data.theme.accentColor}
                  onChange={(e) => updateData('theme', { ...data.theme, accentColor: e.target.value })}
                  placeholder="#ffd700"
                />
              </div>
              {showColorPicker === 'accent' && (
                <div className="color-picker-popup">
                  <div 
                    className="color-picker-overlay"
                    onClick={() => setShowColorPicker(null)}
                  />
                  <ChromePicker
                    color={data.theme.accentColor}
                    onChange={(color) => handleColorChange('accentColor', color)}
                  />
                </div>
              )}
              <small className="form-help">Secondary color for special highlights</small>
            </div>

            <div className="color-input-group">
              <label className="form-label">Primary Dark</label>
              <div className="color-input">
                <div
                  className="color-swatch"
                  style={{ backgroundColor: data.theme.primaryColorDark }}
                  onClick={() => setShowColorPicker(showColorPicker === 'primaryDark' ? null : 'primaryDark')}
                />
                <input
                  type="text"
                  className="form-input"
                  value={data.theme.primaryColorDark}
                  onChange={(e) => updateData('theme', { ...data.theme, primaryColorDark: e.target.value })}
                  placeholder="#2563eb"
                />
              </div>
              {showColorPicker === 'primaryDark' && (
                <div className="color-picker-popup">
                  <div 
                    className="color-picker-overlay"
                    onClick={() => setShowColorPicker(null)}
                  />
                  <ChromePicker
                    color={data.theme.primaryColorDark}
                    onChange={(color) => handleColorChange('primaryColorDark', color)}
                  />
                </div>
              )}
              <small className="form-help">Darker shade for hover effects</small>
            </div>
          </div>
        </div>

        {/* Theme Preview */}
        <div className="theme-preview">
          <h4>
            <Eye className="w-4 h-4" />
            Theme Preview
          </h4>
          <div className="preview-card">
            <div className="preview-header" style={{ backgroundColor: data.theme.primaryColor }}>
              <h5 style={{ color: 'white' }}>Your Portfolio</h5>
            </div>
            <div className="preview-content">
              <h6>Welcome to my portfolio</h6>
              <p>This is how your content will look with the selected colors.</p>
              <div className="preview-buttons">
                <button 
                  className="preview-btn primary"
                  style={{ 
                    backgroundColor: data.theme.primaryColor,
                    borderColor: data.theme.primaryColor 
                  }}
                >
                  Primary Button
                </button>
                <button 
                  className="preview-btn accent"
                  style={{ 
                    backgroundColor: data.theme.accentColor,
                    borderColor: data.theme.accentColor,
                    color: '#333'
                  }}
                >
                  Accent Button
                </button>
              </div>
              <div className="preview-links">
                <a href="#" style={{ color: data.theme.primaryColor }}>Sample Link</a>
                <span> | </span>
                <a href="#" style={{ color: data.theme.accentColor }}>Accent Link</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .theme-form {
          max-width: 700px;
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

        .preset-themes {
          margin-bottom: 2rem;
        }

        .preset-themes h4,
        .custom-colors h4 {
          margin: 0 0 1rem;
          color: #374151;
          font-weight: 600;
        }

        .themes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
        }

        .theme-preset {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .theme-preset:hover {
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        .theme-colors {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .color-circle {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .theme-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          text-align: center;
        }

        .custom-colors {
          margin-bottom: 2rem;
        }

        .color-inputs {
          space-y: 1.5rem;
        }

        .color-input-group {
          position: relative;
        }

        .color-input {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .color-swatch {
          width: 40px;
          height: 40px;
          border-radius: 0.5rem;
          border: 2px solid #e5e7eb;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .color-swatch:hover {
          transform: scale(1.1);
        }

        .color-input .form-input {
          flex: 1;
          font-family: monospace;
        }

        .color-picker-popup {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 1000;
          margin-top: 0.5rem;
        }

        .color-picker-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
        }

        .form-help {
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .theme-preview {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .theme-preview h4 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 1rem;
          color: #374151;
          font-weight: 600;
        }

        .preview-card {
          background: white;
          border-radius: 0.5rem;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .preview-header {
          padding: 1rem 1.5rem;
        }

        .preview-header h5 {
          margin: 0;
          font-weight: 600;
        }

        .preview-content {
          padding: 1.5rem;
        }

        .preview-content h6 {
          margin: 0 0 0.5rem;
          color: #374151;
          font-weight: 600;
        }

        .preview-content p {
          margin: 0 0 1.5rem;
          color: #6b7280;
        }

        .preview-buttons {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .preview-btn {
          padding: 0.5rem 1rem;
          border: 1px solid;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          color: white;
        }

        .preview-links {
          font-size: 0.875rem;
        }

        .preview-links a {
          text-decoration: none;
          font-weight: 500;
        }

        .preview-links a:hover {
          text-decoration: underline;
        }

        .preview-links span {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};

export default ThemeForm;