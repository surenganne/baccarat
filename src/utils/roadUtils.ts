import { Hand } from '../types';

export interface RoadCell {
  result: 'player' | 'banker';
  ties: number;
  isNatural: boolean;
  pairs?: {
    player: boolean;
    banker: boolean;
  };
}

export function generateBigRoad(hands: Hand[]): RoadCell[][] {
  const grid: RoadCell[][] = [];
  let currentCol = 0;
  let currentRow = 0;
  let lastResult: 'player' | 'banker' | null = null;
  let tieCount = 0;

  hands.forEach((hand) => {
    if (hand.result === 'tie') {
      tieCount++;
      return;
    }

    if (hand.result === 'player' || hand.result === 'banker') {
      // First non-tie result
      if (lastResult === null) {
        grid[0] = [{
          result: hand.result,
          ties: tieCount,
          isNatural: hand.isNatural,
          pairs: {
            player: hand.pairs === 'player' || hand.pairs === 'both',
            banker: hand.pairs === 'banker' || hand.pairs === 'both'
          }
        }];
      } else {
        // Start new column when outcome changes
        if (hand.result !== lastResult) {
          currentCol++;
          currentRow = 0;
        } else {
          // Stack same outcomes vertically
          currentRow++;
          if (currentRow >= 6) {
            currentCol++;
            currentRow = 0;
          }
        }

        if (!grid[currentCol]) {
          grid[currentCol] = [];
        }

        grid[currentCol][currentRow] = {
          result: hand.result,
          ties: tieCount,
          isNatural: hand.isNatural,
          pairs: {
            player: hand.pairs === 'player' || hand.pairs === 'both',
            banker: hand.pairs === 'banker' || hand.pairs === 'both'
          }
        };
      }

      lastResult = hand.result;
      tieCount = 0;
    }
  });

  return grid;
}

export interface DerivedCell {
  type: 'player' | 'banker';
  filled: boolean;
}

export function generateBigEyeBoy(hands: Hand[]): DerivedCell[][] {
  const grid: DerivedCell[][] = [];
  const GRID_SIZE = { rows: 3, cols: 16 };

  for (let i = 0; i < GRID_SIZE.rows; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE.cols; j++) {
      if (j > 0 && i > 0 && j < hands.length - 1) {
        const prevResult = hands[j - 1]?.result;
        const comparisonResult = hands[j - 2]?.result;
        
        if (prevResult && comparisonResult) {
          grid[i][j] = {
            type: prevResult === 'banker' ? 'banker' : 'player',
            filled: prevResult === comparisonResult
          };
        }
      }
    }
  }

  return grid;
}

export function generateSmallRoad(hands: Hand[]): DerivedCell[][] {
  const grid: DerivedCell[][] = [];
  const GRID_SIZE = { rows: 3, cols: 16 };

  for (let i = 0; i < GRID_SIZE.rows; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE.cols; j++) {
      if (j > 1 && i > 0 && j < hands.length - 2) {
        const prevResult = hands[j - 2]?.result;
        const comparisonResult = hands[j - 3]?.result;
        
        if (prevResult && comparisonResult) {
          grid[i][j] = {
            type: prevResult === 'banker' ? 'banker' : 'player',
            filled: prevResult === comparisonResult
          };
        }
      }
    }
  }

  return grid;
}

export function generateCockroachRoad(hands: Hand[]): DerivedCell[][] {
  const grid: DerivedCell[][] = [];
  const GRID_SIZE = { rows: 3, cols: 16 };

  for (let i = 0; i < GRID_SIZE.rows; i++) {
    grid[i] = [];
    for (let j = 0; j < GRID_SIZE.cols; j++) {
      if (j > 2 && i > 0 && j < hands.length - 3) {
        const prevResult = hands[j - 3]?.result;
        const comparisonResult = hands[j - 4]?.result;
        
        if (prevResult && comparisonResult) {
          grid[i][j] = {
            type: prevResult === 'banker' ? 'banker' : 'player',
            filled: prevResult === comparisonResult
          };
        }
      }
    }
  }

  return grid;
}