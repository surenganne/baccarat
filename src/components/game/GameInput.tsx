import React from 'react';
import { useTableStore } from '../../store/tableStore';
import { Users, Crown, Divide, X, Star, AlertTriangle } from 'lucide-react';

export function GameInput() {
  const { activeTable, addHand, undoLastHand, tables } = useTableStore();
  const table = tables?.find(t => t.id === activeTable);
  const handCount = table?.hands?.length || 0;
  const isAtLimit = handCount >= 100;
  const isNearLimit = handCount >= 90;

  const handleResult = (result: string, isNatural: boolean = false, isSuper6: boolean = false) => {
    if (!activeTable || isAtLimit) return;

    let finalResult = result;
    if (isNatural) {
      finalResult = `${result}Natural`;
    } else if (isSuper6) {
      finalResult = 'bankerSuper6';
    }
    
    addHand(activeTable, {
      result: finalResult,
      score: {
        player: Math.floor(Math.random() * 9),
        banker: Math.floor(Math.random() * 9),
      },
    });
  };

  if (!activeTable || !table) {
    return (
      <div className="p-6 text-center text-gray-500">
        Select a table to start recording hands
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-lg mx-auto">
        {/* Hand Count Warning */}
        {(isAtLimit || isNearLimit) && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
            isAtLimit ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
          }`}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">
              {isAtLimit 
                ? 'Maximum hand limit (100) reached. Please create a new table.'
                : `${100 - handCount} hands remaining before limit.`
              }
            </span>
          </div>
        )}

        {/* Undo Button - Top Right */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => undoLastHand(activeTable)}
            disabled={handCount === 0}
            className="px-3 py-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Undo Last"
          >
            <X className="w-4 h-4" />
            <span className="text-sm font-medium">Undo</span>
          </button>
        </div>

        {/* Main Results */}
        <div className="flex justify-center gap-8">
          <div className="flex flex-col items-center">
            <button
              onClick={() => handleResult('player')}
              disabled={isAtLimit}
              className="w-20 h-16 rounded-xl bg-[#4285f4]/10 text-[#4285f4] hover:bg-[#4285f4]/20 transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Users className="w-6 h-6" />
              <span className="text-sm font-medium">Player</span>
            </button>
            <button
              onClick={() => handleResult('player', true)}
              disabled={isAtLimit}
              className="mt-2 px-4 py-1.5 rounded-lg bg-[#4285f4]/5 hover:bg-[#4285f4]/10 text-[#4285f4] text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Star className="w-3.5 h-3.5" />
              <span>Natural</span>
            </button>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => handleResult('banker')}
              disabled={isAtLimit}
              className="w-20 h-16 rounded-xl bg-[#ea4335]/10 text-[#ea4335] hover:bg-[#ea4335]/20 transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Crown className="w-6 h-6" />
              <span className="text-sm font-medium">Banker</span>
            </button>
            <button
              onClick={() => handleResult('banker', true)}
              disabled={isAtLimit}
              className="mt-2 px-4 py-1.5 rounded-lg bg-[#ea4335]/5 hover:bg-[#ea4335]/10 text-[#ea4335] text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Star className="w-3.5 h-3.5" />
              <span>Natural</span>
            </button>
            <button
              onClick={() => handleResult('banker', false, true)}
              disabled={isAtLimit}
              className="mt-1 px-4 py-1.5 rounded-lg bg-[#ea4335]/5 hover:bg-[#ea4335]/10 text-[#ea4335] text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="w-3.5 h-3.5 font-bold">6</span>
              <span>Super 6</span>
            </button>
          </div>

          <div className="flex flex-col items-center">
            <button
              onClick={() => handleResult('tie')}
              disabled={isAtLimit}
              className="w-20 h-16 rounded-xl bg-[#34a853]/10 text-[#34a853] hover:bg-[#34a853]/20 transition-colors flex flex-col items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Divide className="w-6 h-6" />
              <span className="text-sm font-medium">Tie</span>
            </button>
            <div className="h-[72px]" /> {/* Spacer to align with other buttons */}
          </div>
        </div>

        {/* Hand Count Display */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Hands: {handCount}/100
        </div>
      </div>
    </div>
  );
}