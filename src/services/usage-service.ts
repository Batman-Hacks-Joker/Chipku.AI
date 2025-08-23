import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import type { UsageCounts } from '@/context/UsageContext';

const initialCounts: Omit<UsageCounts, 'uploads'> = {
  correlations: 0,
  chipkuMeter: 0,
  askAI: 0,
};

// Gets usage counts for a user from Firestore
export const getUsageCounts = async (userId: string): Promise<Omit<UsageCounts, 'uploads'>> => {
  const docRef = doc(db, 'userUsage', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Omit<UsageCounts, 'uploads'>;
  } else {
    // If no document exists, create one with initial counts
    await setDoc(docRef, initialCounts);
    return initialCounts;
  }
};

// Increments a specific feature count for a user in Firestore
export const incrementUsageCount = async (userId: string, feature: keyof Omit<UsageCounts, 'uploads'>) => {
  const docRef = doc(db, 'userUsage', userId);
  
  try {
    // Atomically increment the feature count
    await setDoc(docRef, { [feature]: increment(1) }, { merge: true });
  } catch (error) {
    console.error(`Failed to increment ${feature} count for user ${userId}:`, error);
  }
};
