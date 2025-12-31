import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to 'aws'
    return localStorage.getItem('deckfolio-theme') || 'aws';
  });

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('deckfolio-theme', theme);
    
    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', theme);
    
    // Update body class for theme-specific styles
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'aws' ? 'blackwhite' : 'aws');
  };

  const setSpecificTheme = (newTheme) => {
    if (['aws', 'blackwhite'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  const value = {
    theme,
    toggleTheme,
    setSpecificTheme,
    isAWSTheme: theme === 'aws',
    isBlackWhiteTheme: theme === 'blackwhite'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};