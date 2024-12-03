import React from 'react';
import { useTableStore } from '../store/tableStore';
import { TrendingUp, Percent, Hash } from 'lucide-react';

export function Statistics() {
  const { activeTable, getTableStatistics } = useTableStore();
  
  if (!activeTable) return null;
  
  const stats = getTableStatistics(activeTable);
  const total = stats.playerWins + stats.bankerWins + stats.ties;
  
  const formatPercent = (value: number) => 
    ((value / total) * 100).toFixed(1) + '%';

  return (
    <div className="p-6 bg-gray-800 text-white">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Statistics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 p-4 rounded">
          <div className="text-sm text-gray-400">Win Rate</div>
          <div className="flex justify-between items-end mt-1">
            <div>
              <div className="text-blue-400">Player</div>
              <div className="text-xl font-bold">
                {formatPercent(stats.playerWins)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-red-400">Banker</div>
              <div className="text-xl font-bold">
                {formatPercent(stats.bankerWins)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-700 p-4 rounded">
          <div className="text-sm text-gray-400">Current Streak</div>
          <div className="mt-1">
            <div className={`text-${stats.currentStreak.type === 'player' ? 'blue' : 'red'}-400`}>
              {stats.currentStreak.type.charAt(0).toUpperCase() + 
               stats.currentStreak.type.slice(1)}
            </div>
            <div className="text-xl font-bold">{stats.currentStreak.count}</div>
          </div>
        </div>
        
        <div className="bg-gray-700 p-4 rounded">
          <div className="text-sm text-gray-400">Pairs</div>
          <div className="flex justify-between items-end mt-1">
            <div>
              <div className="text-blue-400">Player</div>
              <div className="text-xl font-bold">{stats.playerPairs}</div>
            </div>
            <div className="text-right">
              <div className="text-red-400">Banker</div>
              <div className="text-xl font-bold">{stats.bankerPairs}</div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-700 p-4 rounded">
          <div className="text-sm text-gray-400">Tie Rate</div>
          <div className="mt-1">
            <div className="text-green-400">Ties</div>
            <div className="text-xl font-bold">{formatPercent(stats.ties)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}