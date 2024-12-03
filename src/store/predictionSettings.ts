import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface PredictionSettings {
  minimumHands: number;
  setMinimumHands: (hands: number) => void;
}

export const usePredictionSettings = create<PredictionSettings>()(
  persist(
    (set) => ({
      minimumHands: 3, // Default to minimum value
      setMinimumHands: (hands) => set({ minimumHands: Math.max(3, Math.min(15, hands)) }), // Clamp between 3-15
    }),
    {
      name: 'prediction-settings',
    }
  )
);