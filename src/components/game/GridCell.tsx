import React from 'react';
import { Crown, Users, Divide, Star } from 'lucide-react';

interface GridCellProps {
  result: 'player' | 'banker';
  ties?: number;
  isNatural?: boolean;
  pairs?: {
    player: boolean;
    banker: boolean;
  };
}

export function GridCell({ result, ties = 0, isNatural, pairs }: GridCellProps) {
  return (
    <div className="relative w-10 h-10">
      {/* Main Cell - Perfect Circle with Border */}
      <div className={`
        absolute inset-0
        flex items-center justify-center 
        rounded-xl
        border-2
        ${result === 'player' 
          ? 'border-[#4285f4] bg-[#4285f4]/10' 
          : 'border-[#ea4335] bg-[#ea4335]/10'}
      `}>
        {result === 'player' ? (
          <Users className={`w-5 h-5 ${result === 'player' ? 'text-[#4285f4]' : 'text-[#ea4335]'}`} />
        ) : (
          <Crown className={`w-5 h-5 ${result === 'player' ? 'text-[#4285f4]' : 'text-[#ea4335]'}`} />
        )}
      </div>

      {/* All Indicators Container - Bottom Right */}
      <div className="absolute -bottom-1 -right-1 flex flex-col gap-0.5">
        {/* Tie Indicator */}
        {ties > 0 && (
          <div className="w-3 h-3 rounded-full bg-[#34a853] flex items-center justify-center">
            <Divide className="w-2 h-2 text-white" />
          </div>
        )}

        {/* Natural Win Indicator */}
        {isNatural && (
          <div className="w-3 h-3 rounded-full border border-amber-500 bg-white flex items-center justify-center">
            <Star className="w-2 h-2 text-amber-500" />
          </div>
        )}

        {/* Pair Indicators */}
        {pairs && (pairs.player || pairs.banker) && (
          <div className="w-3 h-3 rounded-full border border-gray-300 bg-white flex items-center justify-center">
            <div className={`w-1.5 h-1.5 rounded-full ${
              pairs.player && pairs.banker
                ? 'bg-gradient-to-r from-[#4285f4] to-[#ea4335]'
                : pairs.player
                ? 'bg-[#4285f4]'
                : 'bg-[#ea4335]'
            }`} />
          </div>
        )}
      </div>
    </div>
  );
}