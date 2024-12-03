import React, { useEffect, useRef } from 'react';
import { Crown, Users, Divide, Star } from 'lucide-react';
import { Hand } from '../../types';

interface BigRoadProps {
  hands: Hand[];
}

export function BigRoad({ hands }: BigRoadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Calculate required columns based on actual data
  const requiredCols = Math.max(
    hands.reduce((cols, hand, index) => {
      const prevHand = index > 0 ? hands[index - 1] : null;
      if (!prevHand || (hand.result !== 'tie' && hand.result !== prevHand.result)) {
        return cols + 1;
      }
      return cols;
    }, 1),
    50 // Minimum columns
  );

  const GRID_SIZE = { rows: 6, cols: requiredCols };
  const grid: Array<Array<Hand | null>> = 
    Array(GRID_SIZE.cols).fill(null).map(() => Array(GRID_SIZE.rows).fill(null));
  
  let currentCol = 0;
  let currentRow = 0;
  let lastResult: string | null = null;
  let isDragonTail = false;
  let lastTieCol = -1;
  let lastTieRow = -1;

  // Process all hands
  hands.forEach((hand, index) => {
    const baseResult = hand.result.replace('Natural', '').replace('Super6', '');

    // Handle first hand
    if (index === 0) {
      grid[currentCol][currentRow] = hand;
      if (baseResult !== 'tie') {
        lastResult = baseResult;
      }
      return;
    }

    // Handle ties
    if (baseResult === 'tie') {
      if (lastTieCol === currentCol && lastTieRow === currentRow) {
        // Continue tie sequence
        currentRow++;
        if (currentRow >= GRID_SIZE.rows) {
          currentCol++;
          currentRow = GRID_SIZE.rows - 1;
          isDragonTail = true;
        }
      } else {
        // First tie in sequence
        if (isDragonTail || currentRow === GRID_SIZE.rows - 1) {
          currentCol++;
          currentRow = GRID_SIZE.rows - 1;
        } else {
          currentRow++;
        }
      }
      
      if (currentCol < grid.length && currentRow < grid[currentCol].length) {
        grid[currentCol][currentRow] = hand;
        lastTieCol = currentCol;
        lastTieRow = currentRow;
      }
      return;
    }

    // Reset tie tracking for non-tie results
    lastTieCol = -1;
    lastTieRow = -1;

    // Handle regular results (Player/Banker)
    if (lastResult === null || baseResult === lastResult) {
      // Continue current sequence
      if (!isDragonTail) {
        currentRow++;
        if (currentRow >= GRID_SIZE.rows) {
          currentCol++;
          currentRow = GRID_SIZE.rows - 1;
          isDragonTail = true;
        }
      } else {
        currentCol++;
      }
    } else {
      // Start new column for different result
      currentCol++;
      currentRow = 0;
      isDragonTail = false;
    }

    if (currentCol < grid.length && currentRow < grid[currentCol].length) {
      grid[currentCol][currentRow] = hand;
      lastResult = baseResult;
    }
  });

  // Auto-scroll to the latest results
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: scrollRef.current.scrollWidth,
        behavior: 'smooth'
      });
    }
  }, [hands.length]);

  return (
    <div className="relative w-full overflow-hidden">
      <div 
        ref={scrollRef}
        className="overflow-x-auto"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          maxWidth: '100%',
          overflowY: 'hidden'
        }}
      >
        <div 
          className="inline-block min-w-max p-2"
        >
          <div className="flex gap-1">
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
    </div>
  );
}