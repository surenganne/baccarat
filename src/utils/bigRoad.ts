import { Hand } from '../types';
import { BigRoadCell } from '../types/scorecard';

export function processBigRoad(hands: Hand[]): BigRoadCell[][] {
  const grid: BigRoadCell[][] = [];
  let currentCol = 0;
  let currentRow = 0;
  let lastOutcome: 'player' | 'banker' | null = null;
  let tieCount = 0;

  hands.forEach((hand) => {
    // Handle ties
    if (hand.result === 'tie') {
      tieCount++;
      return;
    }

    // First non-tie result
    if (lastOutcome === null) {
      grid[0] = [{
        outcome: hand.result,
        ties: tieCount,
        position: { row: 0, column: 0 },
        isNatural: hand.isNatural,
        pairs: {
          player: hand.pairs === 'player' || hand.pairs === 'both',
          banker: hand.pairs === 'banker' || hand.pairs === 'both'
        },
        gameResults: [hand]
      }];
      lastOutcome = hand.result;
      tieCount = 0;
      return;
    }

    // RULE_1: Start new column when outcome changes
    if (hand.result !== lastOutcome) {
      currentCol++;
      currentRow = 0;
    } else {
      // RULE_2: Stack same outcomes vertically in same column
      currentRow++;
      
      // RULE_3: Move to next column when column reaches maxRows (6)
      if (currentRow >= 6) {
        currentCol++;
        // RULE_7: When column is full and same outcome continues, start new column
        currentRow = 0;
      }
    }

    // Initialize column if needed
    if (!grid[currentCol]) {
      grid[currentCol] = [];
    }

    // Add cell with ties from previous result
    grid[currentCol][currentRow] = {
      outcome: hand.result,
      ties: tieCount,
      position: { row: currentRow, column: currentCol },
      isNatural: hand.isNatural,
      pairs: {
        player: hand.pairs === 'player' || hand.pairs === 'both',
        banker: hand.pairs === 'banker' || hand.pairs === 'both'
      },
      gameResults: [hand]
    };

    lastOutcome = hand.result;
    tieCount = 0;
  });

  return grid;
}