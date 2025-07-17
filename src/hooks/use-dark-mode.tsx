import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        return savedMode === 'true';
      } else {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    }
    return false; // Default to false on the server
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const body = document.body;
      if (isDarkMode) {
        body.classList.add('dark');
      } else {
        body.classList.remove('dark');
      }
      localStorage.setItem('darkMode', String(isDarkMode));
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return [isDarkMode, toggleDarkMode] as const;
};

export { useDarkMode as default };