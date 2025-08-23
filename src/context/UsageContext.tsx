
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUsageCounts, incrementUsageCount } from '@/services/usage-service';

export interface UsageCounts {
    uploads: number;
    correlations: number;
    chipkuMeter: number;
    askAI: number;
    isPremium: boolean;
}

interface UsageContextType {
  counts: UsageCounts;
  incrementCount: (feature: keyof Omit<UsageCounts, 'isPremium'>) => void;
  isLoading: boolean;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export const UsageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [counts, setCounts] = useState<UsageCounts>({
    uploads: 0,
    correlations: 0,
    chipkuMeter: 0,
    askAI: 0,
    isPremium: false,
  });

  useEffect(() => {
    const fetchCounts = async () => {
        if (user) {
            setIsLoading(true);
            const firestoreCounts = await getUsageCounts(user.uid);
            setCounts(prevCounts => ({
                ...prevCounts, // keep local uploads count
                ...firestoreCounts,
            }));
            setIsLoading(false);
        } else {
            // Reset persisted counts on logout, keep local upload count
            setCounts(prevCounts => ({
                uploads: prevCounts.uploads,
                correlations: 0,
                chipkuMeter: 0,
                askAI: 0,
                isPremium: false,
            }));
            setIsLoading(false);
        }
    };
    fetchCounts();
  }, [user]);

  const incrementCount = useCallback((feature: keyof Omit<UsageCounts, 'isPremium'>) => {
    setCounts(prevCounts => ({
        ...prevCounts,
        [feature]: prevCounts[feature] + 1,
    }));
    
    // Persist to firestore only if user is logged in and it's not 'uploads'
    if (user && feature !== 'uploads') {
        incrementUsageCount(user.uid, feature);
    }
  }, [user]);

  return (
    <UsageContext.Provider value={{ counts, incrementCount, isLoading }}>
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
