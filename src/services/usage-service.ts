
import { rtdb } from '@/lib/firebase';
import { ref, get, set, update, increment } from 'firebase/database';
import type { UsageCounts } from '@/context/UsageContext';

const initialCounts: Omit<UsageCounts, 'uploads'> = {
  correlations: 0,
  chipkuMeter: 0,
  askAI: 0,
};

// Gets usage counts for a user from Realtime Database
export const getUsageCounts = async (userId: string): Promise<Omit<UsageCounts, 'uploads'>> => {
  const userRef = ref(rtdb, `userUsage/${userId}`);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    return { ...initialCounts, ...snapshot.val() };
  } else {
    // If no data exists, create it with initial counts
    await set(userRef, initialCounts);
    return initialCounts;
  }
};

// Increments a specific feature count for a user in Realtime Database
export const incrementUsageCount = async (userId: string, feature: keyof Omit<UsageCounts, 'uploads'>) => {
  const userRef = ref(rtdb, `userUsage/${userId}`);
  
  try {
    // Atomically increment the feature count
    const updates: Record<string, any> = {};
    updates[feature] = increment(1);
    await update(userRef, updates);
  } catch (error) {
    // If the path does not exist, set it first
    if (error instanceof Error && error.message.includes("path does not exist")) {
        await set(userRef, { ...initialCounts, [feature]: 1 });
    } else {
        console.error(`Failed to increment ${feature} count for user ${userId}:`, error);
    }
  }
};
