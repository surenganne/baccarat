import React from 'react';
import { useTableStore } from '../store/tableStore';
import { Hand } from '../types';
import { Clock, Crown, Users, Divide } from 'lucide-react';

function HandResult({ hand }: { hand: Hand }) {
  const getIcon = () => {
    switch (hand.result) {
      case 'player':
        return <Users className="w-4 h-4 text-blue-400" />;
      case 'banker':
        return <Crown className="w-4 h-4 text-red-400" />;
      case 'tie':
        return <Divide className="w-4 h-4 text-green-400" />;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getIcon()}
      <span className="capitalize">{hand.result}</span>
      {hand.isNatural && (
        <span className="text-xs bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded">
          Natural
        </span>
      )}
    </div>
  );
}

export function GameHistory() {
  const { activeTable, tables } = useTableStore();
  const activeTableData = tables.find((t) => t.id === activeTable);
  
  if (!activeTableData) return null;
  
  const recentHands = [...activeTableData.hands]
    .reverse()
    .slice(0, 10);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-gray-800">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Hands
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {recentHands.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No hands recorded yet
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {recentHands.map((hand) => (
              <div key={hand.id} className="p-4 hover:bg-gray-700/50">
                <div className="flex justify-between items-start mb-2">
                  <HandResult hand={hand} />
                  <span className="text-sm text-gray-400">
                    {new Date(hand.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="flex gap-4 text-sm text-gray-400">
                  <div>
                    Score: {hand.score.player}-{hand.score.banker}
                  </div>
                  {hand.pairs !== 'none' && (
                    <div>
                      Pairs: {hand.pairs === 'both' ? 'Both' : hand.pairs}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}