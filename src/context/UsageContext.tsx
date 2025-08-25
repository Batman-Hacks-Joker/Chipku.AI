
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUsageCounts, incrementUsageCount } from '@/services/usage-service';
import { useToast } from '@/hooks/use-toast';

export interface UsageCounts {
    uploads: number;
    correlations: number;
    chipkuMeter: number;
    askAI: number;
    isPremium: boolean;
}

export const USAGE_LIMITS = {
  premium: {
    correlations: 100,
    chipkuMeter: 10,
    askAI: 10,
  },
  nonPremium: {
    correlations: 3,
    chipkuMeter: 2,
    askAI: 2,
  }
}

interface UsageContextType {
  counts: UsageCounts;
  incrementCount: (feature: keyof Omit<UsageCounts, 'isPremium' | 'uploads'> | 'uploads') => void;
  isLoading: boolean;
  hasReachedLimit: (feature: keyof Omit<UsageCounts, 'isPremium' | 'uploads'>) => boolean;
}

const UsageContext = createContext<UsageContextType | undefined>(undefined);

export const UsageProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
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
                ...prevCounts, 
                ...firestoreCounts,
                uploads: prevCounts.uploads, // Keep local uploads count
            }));
            setIsLoading(false);
        } else {
            // Reset all but local uploads
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

  const hasReachedLimit = (feature: keyof Omit<UsageCounts, 'isPremium' | 'uploads'>) => {
    if (!user) return false; // Don't block for non-logged-in users, let the button show login toast
    const limit = counts.isPremium ? USAGE_LIMITS.premium[feature] : USAGE_LIMITS.nonPremium[feature];
    return counts[feature] >= limit;
  }

  const incrementCount = useCallback((feature: keyof Omit<UsageCounts, 'isPremium'>) => {
    if (feature === 'uploads') {
       setCounts(prevCounts => ({
          ...prevCounts,
          uploads: prevCounts.uploads + 1,
      }));
      return;
    }

    if (!user) {
       toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to use this feature.",
      });
      return;
    }
    
    if (hasReachedLimit(feature)) {
      toast({
        variant: "destructive",
        title: "Usage limit reached",
        description: `You've reached the limit for the ${feature} feature.`,
      });
      return;
    }

    setCounts(prevCounts => ({
        ...prevCounts,
        [feature]: prevCounts[feature] + 1,
    }));
    
    incrementUsageCount(user.uid, feature);

  }, [user, counts, hasReachedLimit, toast]);
  

  const value = {
    counts,
    incrementCount,
    isLoading,
    hasReachedLimit,
  }

  return (
    <UsageContext.Provider value={value}>
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
