import React, { useEffect, useRef } from 'react';
import { useTableStore } from '../../store/tableStore';
import { Hand } from '../../types';
import { Clock, Crown, Users, Divide, Star } from 'lucide-react';

interface HandResultProps {
  hand: Hand;
}

function HandResult({ hand }: HandResultProps) {
  const getIcon = () => {
    switch (hand.result) {
      case 'player':
        return <Users className="w-4 h-4 text-blue-500" />;
      case 'banker':
        return <Crown className="w-4 h-4 text-red-500" />;
      case 'tie':
        return <Divide className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="flex items-center gap-2">
      {getIcon()}
      <span className="capitalize text-gray-900">{hand.result}</span>
      {hand.isNatural && (
        <div className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
          <Star className="w-3 h-3" />
          Natural
        </div>
      )}
    </div>
  );
}

export function GameHistory() {
  const { activeTable, tables } = useTableStore();
  const activeTableData = tables.find((t) => t.id === activeTable);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Scroll to bottom when new hands are added
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTableData?.hands.length]);
  
  if (!activeTableData) return null;
  
  const recentHands = [...activeTableData.hands].reverse();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary-600" />
          Game History
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {recentHands.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No hands recorded yet
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentHands.map((hand) => (
              <div key={hand.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <HandResult hand={hand} />
                  <span className="text-sm text-gray-500">
                    {new Date(hand.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <div className="flex gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="text-blue-500 font-medium">{hand.score.player}</span>
                    <span>-</span>
                    <span className="text-red-500 font-medium">{hand.score.banker}</span>
                  </div>
                  {hand.pairs !== 'none' && (
                    <div className="flex items-center gap-1">
                      <span>Pairs:</span>
                      <span className="font-medium">
                        {hand.pairs === 'both' ? 'Both' : hand.pairs}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>
    </div>
  );
}