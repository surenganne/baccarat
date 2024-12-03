import { Hand } from '../types';

export function generateBigRoad(hands: Hand[]) {
  const nonTieHands = hands.filter(hand => hand.result !== 'tie');
  const grid: any[][] = [];
  let currentCol = 0;
  let currentRow = 0;
  let lastResult: 'player' | 'banker' | null = null;

  nonTieHands.forEach((hand) => {
    if (lastResult === null) {
      grid[0] = [hand];
      lastResult = hand.result;
      return;
    }

    if (hand.result === lastResult) {
      currentRow++;
      if (currentRow >= 6) {
        currentCol++;
        currentRow = 0;
      }
    } else {
      currentCol++;
      currentRow = 0;
    }

    if (!grid[currentCol]) {
      grid[currentCol] = [];
    }

    grid[currentCol][currentRow] = hand;
    lastResult = hand.result;
  });

  return grid;
}

export function shouldDrawBigEyeBoy(grid: any[][], col: number, row: number): boolean {
  if (col < 1 || row < 1) return false;

  const currentCell = grid[col][row];
  const comparisonCell = grid[col - 1][row - 1];

  if (!currentCell || !comparisonCell) return false;

  return currentCell.result === comparisonCell.result;
}

export function shouldDrawSmallRoad(grid: any[][], col: number, row: number): boolean {
  if (col < 2 || row < 1) return false;

  const currentCell = grid[col][row];
  const comparisonCell = grid[col - 2][row - 1];

  if (!currentCell || !comparisonCell) return false;

  return currentCell.result === comparisonCell.result;
}

export function shouldDrawCockroachRoad(grid: any[][], col: number, row: number): boolean {
  if (col < 3 || row < 1) return false;

  const currentCell = grid[col][row];
  const comparisonCell = grid[col - 3][row - 1];

  if (!currentCell || !comparisonCell) return false;

  return currentCell.result === comparisonCell.result;
}