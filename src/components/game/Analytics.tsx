import React from 'react';
import { useTableStore } from '../../store/tableStore';
import { Hash, Users, Crown, Divide, Star } from 'lucide-react';

interface WinDistributionProps {
  playerWins: number;
  playerNaturalWins: number;
  bankerWins: number;
  bankerNaturalWins: number;
  bankerSuper6Wins: number;
  ties: number;
  total: number;
}

function WinDistribution({ 
  playerWins, 
  playerNaturalWins,
  bankerWins, 
  bankerNaturalWins,
  bankerSuper6Wins,
  ties, 
  total 
}: WinDistributionProps) {
  const getPercentage = (value: number) => ((value / total) * 100).toFixed(1);
  const getWidth = (value: number) => `${(value / total) * 100}%`;

  const totalPlayerWins = playerWins + playerNaturalWins;
  const totalBankerWins = bankerWins + bankerNaturalWins + bankerSuper6Wins;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-8 shadow-sm">
      {/* Total Hands */}
      <div className="flex items-center gap-2 sm:gap-3 text-gray-500 mb-4 sm:mb-6">
        <Hash className="w-5 h-5 sm:w-6 sm:h-6" />
        <h3 className="text-sm sm:text-base font-medium">Total Hands</h3>
      </div>

      {/* Counter */}
      <div className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6 sm:mb-8">{total}</div>

      {/* Distribution List */}
      <div className="space-y-4 sm:space-y-6">
        {/* Player */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[#4285f4]">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Player</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-sm sm:text-base">
                {totalPlayerWins} ({getPercentage(totalPlayerWins)}%)
              </div>
              {playerNaturalWins > 0 && (
                <div className="flex items-center gap-1 text-xs sm:text-sm text-amber-500">
                  <Star className="w-3 h-3" />
                  <span>{playerNaturalWins} Natural</span>
                </div>
              )}
            </div>
          </div>
          <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#4285f4] transition-all duration-500"
              style={{ width: getWidth(totalPlayerWins) }}
            />
          </div>
        </div>

        {/* Banker */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[#ea4335]">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Banker</span>
            </div>
            <div className="text-right">
              <div className="font-semibold text-sm sm:text-base">
                {totalBankerWins} ({getPercentage(totalBankerWins)}%)
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                {bankerNaturalWins > 0 && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3 h-3" />
                    <span>{bankerNaturalWins} Natural</span>
                  </div>
                )}
                {bankerSuper6Wins > 0 && (
                  <div className="flex items-center gap-1 text-amber-500">
                    <span className="font-bold">6</span>
                    <span>{bankerSuper6Wins} Super 6</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#ea4335] transition-all duration-500"
              style={{ width: getWidth(totalBankerWins) }}
            />
          </div>
        </div>

        {/* Tie */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[#34a853]">
              <Divide className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Tie</span>
            </div>
            <span className="font-semibold text-sm sm:text-base">
              {ties} ({getPercentage(ties)}%)
            </span>
          </div>
          <div className="h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#34a853] transition-all duration-500"
              style={{ width: getWidth(ties) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Analytics() {
  const { activeTable, tables } = useTableStore();
  const table = tables.find(t => t.id === activeTable);

  if (!table) return null;

  const stats = {
    playerWins: table.hands.filter(h => h.result === 'player').length,
    playerNaturalWins: table.hands.filter(h => h.result === 'playerNatural').length,
    bankerWins: table.hands.filter(h => h.result === 'banker').length,
    bankerNaturalWins: table.hands.filter(h => h.result === 'bankerNatural').length,
    bankerSuper6Wins: table.hands.filter(h => h.result === 'bankerSuper6').length,
    ties: table.hands.filter(h => h.result === 'tie').length,
    total: table.hands.length
  };

  return (
    <div className="p-4 sm:p-6">
      <WinDistribution {...stats} />
    </div>
  );
}