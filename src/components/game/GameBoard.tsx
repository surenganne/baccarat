import React from 'react';
import { BaccaratScoreboard } from './BaccaratScoreboard';
import { GameHistory } from './GameHistory';

export function GameBoard() {
  return (
    <div className="flex flex-col bg-gray-800 min-h-0">
      <div className="p-4 lg:p-6">
        <BaccaratScoreboard />
      </div>
      <div className="flex-1 min-h-0">
        <GameHistory />
      </div>
    </div>
  );
}