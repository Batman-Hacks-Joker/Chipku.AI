
import { rtdb } from '@/lib/firebase';
import { ref, get, runTransaction, increment } from 'firebase/database';

const COUNTER_PATH = 'chipkuLoversCount';

// Gets the current count of Chipku Lovers
export const getChipkuLoversCount = async (): Promise<number> => {
  const counterRef = ref(rtdb, COUNTER_PATH);
  const snapshot = await get(counterRef);
  return snapshot.exists() ? snapshot.val() : 0;
};

// Increments the Chipku Lovers count and returns the new value
export const incrementChipkuLoversCount = async (): Promise<number> => {
  const counterRef = ref(rtdb, COUNTER_PATH);
  
  // Use a transaction to ensure atomic increment
  const { snapshot } = await runTransaction(counterRef, (currentValue) => {
    return (currentValue || 0) + 1;
  });

  return snapshot.val() || 0;
};
