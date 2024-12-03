import React from 'react';
import { Crown, Users, Divide } from 'lucide-react';
import { useTableStore } from '../../store/tableStore';
import { GameResult } from '../../types';

const GRID_SIZE = { rows: 6, cols: 12 };

interface ResultCellProps {
  result: GameResult;
  ties?: number;
}

function ResultCell({ result, ties }: ResultCellProps) {
  return (
    <div className="relative">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-lg border ${
          result === 'player'
            ? 'bg-blue-50 border-blue-200 text-blue-600'
            : result === 'banker'
            ? 'bg-red-50 border-red-200 text-red-600'
            : 'bg-emerald-50 border-emerald-200 text-emerald-600'
        }`}
      >
        {result === 'player' ? (
          <Users className="w-6 h-6" />
        ) : result === 'banker' ? (
          <Crown className="w-6 h-6" />
        ) : (
          <Divide className="w-6 h-6" />
        )}
      </div>
      {ties && ties > 0 && (
        <div className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold ring-2 ring-white">
          {ties}
        </div>
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
  let tieCount = 0;

  hands.forEach((hand) => {
    if (hand.result === 'tie') {
      tieCount++;
      return;
    }

    if (hand.result === lastResult && lastResult !== null) {
      currentRow++;
      if (currentRow >= GRID_SIZE.rows) {
        currentRow = 0;
        currentCol++;
      }
    } else {
      if (lastResult !== null) {
        currentCol++;
        currentRow = 0;
      }
    }

    if (currentCol < GRID_SIZE.cols) {
      grid[currentRow][currentCol] = {
        result: hand.result,
        ties: tieCount
      };
      lastResult = hand.result;
      tieCount = 0;
    }
  });

  return (
    <div>
      <h3 className="text-lg font-semibold mb-6 text-gray-900">Big Road</h3>
      
      <div className="overflow-x-auto pb-2">
        <div 
          className="inline-grid gap-2"
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE.cols}, minmax(3rem, 1fr))`,
            gridTemplateRows: `repeat(${GRID_SIZE.rows}, minmax(3rem, 1fr))`
          }}
        >
          {grid.map((row, i) =>
            row.map((cell, j) =>
              cell ? (
                <ResultCell 
                  key={`${i}-${j}`} 
                  result={cell.result} 
                  ties={cell.ties} 
                />
              ) : (
                <div
                  key={`${i}-${j}`}
                  className="w-12 h-12 rounded-lg border border-gray-100"
                />
              )
            )
          )}
        </div>
      </div>
      
      <div className="mt-6 flex gap-8 text-sm text-gray-600 justify-center">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span>Player</span>
        </div>
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-red-500" />
          <span>Banker</span>
        </div>
        <div className="flex items-center gap-2">
          <Divide className="w-4 h-4 text-emerald-500" />
          <span>Tie</span>
        </div>
      </div>
    </div>
  );
}