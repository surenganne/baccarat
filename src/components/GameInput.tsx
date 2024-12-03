import React from 'react';
import { useTableStore } from '../store/tableStore';
import { Hand } from '../types';
import { Crown, Users, Divide } from 'lucide-react';

export function GameInput() {
  const { activeTable, addHand } = useTableStore();
  const [isNatural, setIsNatural] = React.useState(false);
  const [pairs, setPairs] = React.useState<Hand['pairs']>('none');

  const handleResult = (result: Hand['result']) => {
    if (!activeTable) return;

    addHand(activeTable, {
      result,
      isNatural,
      pairs,
      score: {
        player: Math.floor(Math.random() * 9),
        banker: Math.floor(Math.random() * 9),
      },
    });

    // Reset for next hand
    setIsNatural(false);
    setPairs('none');
  };

  if (!activeTable) {
    return (
      <div className="p-6 text-center text-gray-500">
        Select a table to start recording hands
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 text-white">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button
          onClick={() => handleResult('player')}
          className="p-4 rounded bg-blue-600 hover:bg-blue-700 transition-colors flex flex-col items-center gap-2"
        >
          <Users className="w-6 h-6" />
          <span className="font-medium">Player</span>
        </button>
        <button
          onClick={() => handleResult('banker')}
          className="p-4 rounded bg-red-600 hover:bg-red-700 transition-colors flex flex-col items-center gap-2"
        >
          <Crown className="w-6 h-6" />
          <span className="font-medium">Banker</span>
        </button>
        <button
          onClick={() => handleResult('tie')}
          className="p-4 rounded bg-green-600 hover:bg-green-700 transition-colors flex flex-col items-center gap-2"
        >
          <Divide className="w-6 h-6" />
          <span className="font-medium">Tie</span>
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isNatural}
            onChange={(e) => setIsNatural(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          Natural Win
        </label>
      </div>

      <div className="flex gap-4">
        <select
          value={pairs}
          onChange={(e) => setPairs(e.target.value as Hand['pairs'])}
          className="bg-gray-800 text-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="none">No Pairs</option>
          <option value="player">Player Pair</option>
          <option value="banker">Banker Pair</option>
          <option value="both">Both Pairs</option>
        </select>
      </div>
    </div>
  );
}