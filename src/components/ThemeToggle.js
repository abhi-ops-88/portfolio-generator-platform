import React from 'react';
import { Palette, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ showLabel = true, size = 'default' }) => {
  const { theme, toggleTheme, isAWSTheme, isBlackWhiteTheme } = useTheme();

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8 text-sm';
      case 'large':
        return 'w-12 h-12 text-lg';
      default:
        return 'w-10 h-10 text-base';
    }
  };

  const getIcon = () => {
    if (isAWSTheme) {
      return <Palette className="w-4 h-4" />;
    } else {
      return <Moon className="w-4 h-4" />;
    }
  };

  const getThemeLabel = () => {
    if (isAWSTheme) {
      return 'AWS';
    } else {
      return 'B&W';
    }
  };

  const getTooltip = () => {
    if (isAWSTheme) {
      return 'Switch to Black & White theme';
    } else {
      return 'Switch to AWS theme';
    }
  };

  return (
    <div className="theme-toggle-container">
      <button
        onClick={toggleTheme}
        className={`theme-toggle-btn ${getSizeClasses()}`}
        title={getTooltip()}
        aria-label={getTooltip()}
      >
        {getIcon()}
      </button>
      
      {showLabel && (
        <span className="theme-label">
          {getThemeLabel()}
        </span>
      )}

      <style jsx>{`
        .theme-toggle-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          z-index: 100;
        }

        .theme-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          border: 2px solid;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }

        /* AWS Theme Styles */
        [data-theme="aws"] .theme-toggle-btn {
          border-color: var(--aws-orange);
          color: var(--aws-orange);
        }

        [data-theme="aws"] .theme-toggle-btn:hover {
          background: var(--aws-orange);
          color: var(--aws-white);
          transform: rotate(180deg) scale(1.1);
          box-shadow: 0 4px 15px rgba(255, 153, 0, 0.3);
        }

        [data-theme="aws"] .theme-label {
          color: var(--aws-gray-700);
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
        }

        /* Black & White Theme Styles */
        [data-theme="blackwhite"] .theme-toggle-btn {
          border-color: var(--primary-black);
          color: var(--primary-black);
        }

        [data-theme="blackwhite"] .theme-toggle-btn:hover {
          background: var(--primary-black);
          color: var(--primary-white);
          transform: rotate(180deg) scale(1.1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        [data-theme="blackwhite"] .theme-label {
          color: var(--gray-700);
          font-size: 0.875rem;
          font-weight: 600;
          white-space: nowrap;
        }

        /* Animation for theme transition */
        .theme-toggle-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: currentColor;
          transition: all 0.3s ease;
          transform: translate(-50%, -50%);
          opacity: 0;
        }

        .theme-toggle-btn:hover::before {
          width: 100%;
          height: 100%;
          opacity: 0.1;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .theme-label {
            display: none;
          }
          
          .theme-toggle-container {
            gap: 0.25rem;
          }
        }

        /* Focus styles for accessibility */
        .theme-toggle-btn:focus {
          outline: 2px solid;
          outline-offset: 2px;
        }

        [data-theme="aws"] .theme-toggle-btn:focus {
          outline-color: var(--aws-orange);
        }

        [data-theme="blackwhite"] .theme-toggle-btn:focus {
          outline-color: var(--primary-black);
        }

        /* Prevent text selection on button */
        .theme-toggle-btn {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
      `}</style>
    </div>
  );
};

export default ThemeToggle;