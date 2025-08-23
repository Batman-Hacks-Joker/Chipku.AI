
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';

interface UsageCounts {
    uploads: number;
    correlations: number;
    chipkuMeter: number;
    askAI: number;
}

interface UsageContextType {
  counts: UsageCounts;
  incrementCount: (feature: keyof UsageCounts) => void;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export const UsageProvider = ({ children }: { children: ReactNode }) => {
  const [counts, setCounts] = useState<UsageCounts>({
    uploads: 0,
    correlations: 0,
    chipkuMeter: 0,
    askAI: 0,
  });

  const incrementCount = useCallback((feature: keyof UsageCounts) => {
    setCounts(prevCounts => ({
        ...prevCounts,
        [feature]: prevCounts[feature] + 1,
    }));
  }, []);

  return (
    <UsageContext.Provider value={{ counts, incrementCount }}>
      {children}
    </UsageContext.Provider>
  );
};

export const useUsage = () => {
  const context = useContext(UsageContext);
  if (context === undefined) {
    throw new Error('useUsage must be used within a UsageProvider');
  }
  return context;
};
