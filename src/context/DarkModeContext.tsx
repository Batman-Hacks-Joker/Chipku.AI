"use client";

import { createContext, useContext, ReactNode } from 'react';
import useDarkMode from '@/hooks/use-dark-mode';

type DarkModeContextType = readonly [boolean, () => void];

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
  const darkModeState = useDarkMode();
  return (
    <DarkModeContext.Provider value={darkModeState}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkModeContext = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkModeContext must be used within a DarkModeProvider');
  }
  return context;
};
