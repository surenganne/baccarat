import { Hand, GameResult } from '../types';
import { mapGameResult, loadHistoricalData } from './historicalData';

let historicalDataCache: Record<string, number[]> | null = null;

async function ensureHistoricalData() {
  if (!historicalDataCache) {
    historicalDataCache = await loadHistoricalData();
  }
  return historicalDataCache;
}

export async function calculateProbabilities(hands: Hand[], minHands: number): Promise<{
  player: number;
  banker: number;
  matches: {
    player: number;
    banker: number;
  };
}> {
  // Get historical data
  const historicalData = await ensureHistoricalData();
  
  // Filter out ties and map current hands to 0/1
  const currentHands = hands
    .map(hand => mapGameResult(hand.result))
    .filter(result => result !== -1);

  if (currentHands.length < minHands) {
    return { 
      player: 0.5, 
      banker: 0.5,
      matches: { player: 0, banker: 0 }
    };
  }

  // Get the last window of hands
  const lastWindowHands = currentHands.slice(-minHands);

  // Initialize match predictions
  const matchPredictions = { 0: 0, 1: 0 };

  // Process historical data from all tables
  Object.values(historicalData).forEach(tableHands => {
    let leftPointer = 0;
    let rightPointer = minHands;

    while (rightPointer < tableHands.length - 1) {
      // Get current window
      const window = tableHands.slice(leftPointer, rightPointer);
      
      // Check if window matches our pattern
      if (window.length === lastWindowHands.length && 
          window.every((val, index) => val === lastWindowHands[index])) {
        const nextHand = tableHands[rightPointer + 1];
        if (nextHand === 0 || nextHand === 1) {
          matchPredictions[nextHand]++;
        }
      }
      
      // Slide window
      leftPointer++;
      rightPointer++;
    }
  });

  const total = matchPredictions[0] + matchPredictions[1];
  
  if (total === 0) {
    return { 
      player: 0.5, 
      banker: 0.5,
      matches: { player: 0, banker: 0 }
    };
  }

  const playerProb = matchPredictions[0] / total;
  const bankerProb = matchPredictions[1] / total;

  return {
    player: playerProb,
    banker: bankerProb,
    matches: {
      player: matchPredictions[0],
      banker: matchPredictions[1]
    }
  };
}