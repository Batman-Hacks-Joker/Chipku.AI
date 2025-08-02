import { useState, useEffect } from 'react';

const useDarkMode = (): readonly [boolean, () => void] => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) {
        try {
          return JSON.parse(saved);
        } catch {
          return false;
        }
      }

      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    }
    return false;
  });

  useEffect(() => {
    if (typeof document !== 'undefined' && typeof localStorage !== 'undefined') {
      const body = document.body;
      if (isDarkMode) {
        body.classList.add('dark');
      } else {
        body.classList.remove('dark');
      }
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return [isDarkMode, toggleDarkMode] as const;
};

export default useDarkMode;
