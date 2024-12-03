import React from 'react';
import { useTableStore } from '../store/tableStore';
import { GameResult } from '../types';
import { Crown, Users } from 'lucide-react';

const GRID_SIZE = { rows: 6, cols: 20 };

function ResultCell({ result }: { result: GameResult }) {
  return (
    <div
      className={`w-8 h-8 flex items-center justify-center rounded ${
        result === 'player'
          ? 'bg-blue-600'
          : result === 'banker'
          ? 'bg-red-600'
          : 'bg-green-600'
      }`}
    >
      {result === 'player' ? (
        <Users className="w-4 h-4" />
      ) : result === 'banker' ? (
        <Crown className="w-4 h-4" />
      ) : (
        <div className="w-2 h-2 bg-white rounded-full" />
      )}
    </div>
  );
}

export function BaccaratScoreboard() {
  const { activeTable, tables } = useTableStore();
  const table = tables.find((t) => t.id === activeTable);
  
  if (!table) return null;

  const hands = table.hands.slice(-GRID_SIZE.rows * GRID_SIZE.cols);
  
  // Create grid representation
  const grid = Array(GRID_SIZE.rows)
    .fill(null)
    .map(() => Array(GRID_SIZE.cols).fill(null));

  // Fill grid using Big Road rules
  let currentCol = 0;
  let currentRow = 0;
  let lastResult: GameResult | null = null;

  hands.forEach((hand) => {
    if (hand.result === 'tie') {
      // Mark tie on the last non-tie result
      if (currentCol > 0 && currentRow >= 0) {
        grid[currentRow][currentCol - 1] = 'tie';
      }
      return;
    }

    if (hand.result === lastResult) {
      // Move up in the same column
      currentRow++;
      if (currentRow >= GRID_SIZE.rows) {
        currentRow = 0;
        currentCol++;
      }
    } else {
      // Start new column
      currentCol++;
      currentRow = 0;
    }

    if (currentCol < GRID_SIZE.cols) {
      grid[currentRow][currentCol] = hand.result;
      lastResult = hand.result;
    }
  });

  return (
    <div className="p-6 bg-gray-800 text-white">
      <h3 className="text-lg font-semibold mb-4">Big Road</h3>
      
      <div className="overflow-x-auto">
        <div className="inline-grid gap-1" style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE.cols}, minmax(2rem, 1fr))`,
          gridTemplateRows: `repeat(${GRID_SIZE.rows}, minmax(2rem, 1fr))`
        }}>
          {grid.map((row, i) =>
            row.map((result, j) =>
              result ? (
                <ResultCell key={`${i}-${j}`} result={result} />
              ) : (
                <div
                  key={`${i}-${j}`}
                  className="w-8 h-8 border border-gray-700 rounded"
                />
              )
            )
          )}
        </div>
      </div>
      
      <div className="mt-4 flex gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-600 rounded" />
          Player
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-600 rounded" />
          Banker
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-600 rounded" />
          Tie
        </div>
      </div>
    </div>
  );
}