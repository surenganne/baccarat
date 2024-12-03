import React from 'react';
import { Crown, Users, Divide, Star } from 'lucide-react';
import { Hand } from '../../types';

interface BeadPlateProps {
  hands: Hand[];
}

export function BeadPlate({ hands = [] }: BeadPlateProps) {
  // Calculate required columns based on actual data
  const ROWS = 6;
  const requiredCols = Math.ceil((hands?.length || 0) / ROWS);
  const GRID_SIZE = { rows: ROWS, cols: Math.max(requiredCols, 12) }; // Minimum 12 columns

  const grid: (Hand | null)[][] = Array(GRID_SIZE.cols)
    .fill(null)
    .map(() => Array(GRID_SIZE.rows).fill(null));

  // Fill grid vertically (top to bottom, then left to right)
  hands?.forEach((hand, index) => {
    const col = Math.floor(index / ROWS);
    const row = index % ROWS;
    if (col < GRID_SIZE.cols) {
      grid[col][row] = hand;
    }
  });

  return (
    <div className="relative w-full overflow-hidden">
      <div className="overflow-x-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
        <div className="inline-flex gap-1 p-2 min-w-max">
          {grid.map((column, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-1">
              {column.map((hand, rowIndex) => (
                <div key={`${colIndex}-${rowIndex}`} className="h-7 sm:h-8">
                  {hand && (
                    <div className="relative">
                      <div
                        className={`
                          w-7 h-7 sm:w-8 sm:h-8
                          flex items-center justify-center 
                          rounded-md border
                          ${hand.result.includes('player') 
                            ? 'border-[#4285f4] bg-[#4285f4]/10'
                            : hand.result === 'bankerSuper6'
                            ? 'border-[#ea4335] bg-[#ea4335]/20 ring-2 ring-amber-400'
                            : hand.result.includes('banker')
                            ? 'border-[#ea4335] bg-[#ea4335]/10'
                            : 'border-[#34a853] bg-[#34a853]/10'}
                        `}
                      >
                        {hand.result.includes('player') ? (
                          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#4285f4]" />
                        ) : hand.result === 'bankerSuper6' ? (
                          <span className="text-[#ea4335] font-bold text-sm sm:text-base">6</span>
                        ) : hand.result.includes('banker') ? (
                          <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ea4335]" />
                        ) : (
                          <Divide className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#34a853]" />
                        )}
                      </div>
                      {hand.result.includes('Natural') && (
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-amber-400 rounded-full flex items-center justify-center">
                          <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}