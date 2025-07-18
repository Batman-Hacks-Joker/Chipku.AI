import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved === 'true'; // only true if user has toggled it
    }
    return false; // default light mode
  });

  useEffect(() => {
    const body = document.body;

    if (isDarkMode) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }

    localStorage.setItem('darkMode', String(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return [isDarkMode, toggleDarkMode] as const;
};

export { useDarkMode as default };
