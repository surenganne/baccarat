import React from 'react';
import { useTableStore } from '../../store/tableStore';
import { Trophy, Users, Crown, Repeat } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor: string;
  subStats?: { label: string; value: number }[];
}

function StatCard({ title, value, icon, iconColor, subStats }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-100">
      <div className="flex items-center gap-2 text-gray-600 mb-2">
        <div className={`${iconColor}`}>{icon}</div>
        <span className="text-sm">{title}</span>
      </div>
      <div className="text-xl font-semibold text-gray-900">{value}</div>
      {subStats && (
        <div className="mt-2 space-y-1">
          {subStats.map((stat, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-500">{stat.label}:</span>
              <span className="font-medium text-gray-700">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function GameStats() {
  const { activeTable, tables } = useTableStore();
  const table = tables.find((t) => t.id === activeTable);

  if (!table) return null;

  const stats = {
    playerWins: table.hands.filter(h => h.result === 'player').length,
    playerNaturalWins: table.hands.filter(h => h.result === 'playerNatural').length,
    bankerWins: table.hands.filter(h => h.result === 'banker').length,
    bankerNaturalWins: table.hands.filter(h => h.result === 'bankerNatural').length,
    bankerSuper6Wins: table.hands.filter(h => h.result === 'bankerSuper6').length,
    ties: table.hands.filter(h => h.result === 'tie').length,
  };

  const totalHands = table.hands.length;
  const playerWinPercentage = totalHands ? (((stats.playerWins + stats.playerNaturalWins) / totalHands) * 100).toFixed(1) : '0.0';
  const bankerWinPercentage = totalHands ? (((stats.bankerWins + stats.bankerNaturalWins + stats.bankerSuper6Wins) / totalHands) * 100).toFixed(1) : '0.0';
  const tiePercentage = totalHands ? ((stats.ties / totalHands) * 100).toFixed(1) : '0.0';

  // Calculate current streak
  let currentStreak = { type: table.hands[table.hands.length - 1]?.result || 'player', count: 0 };
  for (let i = table.hands.length - 1; i >= 0; i--) {
    const baseResult = table.hands[i].result.replace('Natural', '').replace('Super6', '');
    if (baseResult === currentStreak.type.replace('Natural', '').replace('Super6', '')) {
      currentStreak.count++;
    } else {
      break;
    }
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-6 text-gray-900">Game Statistics</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Player Wins"
          value={`${stats.playerWins + stats.playerNaturalWins} (${playerWinPercentage}%)`}
          icon={<Users className="w-5 h-5" />}
          iconColor="text-blue-500"
          subStats={[
            { label: 'Regular', value: stats.playerWins },
            { label: 'Natural', value: stats.playerNaturalWins }
          ]}
        />
        <StatCard
          title="Banker Wins"
          value={`${stats.bankerWins + stats.bankerNaturalWins + stats.bankerSuper6Wins} (${bankerWinPercentage}%)`}
          icon={<Crown className="w-5 h-5" />}
          iconColor="text-red-500"
          subStats={[
            { label: 'Regular', value: stats.bankerWins },
            { label: 'Natural', value: stats.bankerNaturalWins },
            { label: 'Super 6', value: stats.bankerSuper6Wins }
          ]}
        />
        <StatCard
          title="Ties"
          value={`${stats.ties} (${tiePercentage}%)`}
          icon={<Trophy className="w-5 h-5" />}
          iconColor="text-emerald-500"
        />
        <StatCard
          title="Current Streak"
          value={`${currentStreak.count} ${currentStreak.type.replace('Natural', '').replace('Super6', '')}`}
          icon={<Repeat className="w-5 h-5" />}
          iconColor="text-amber-500"
        />
      </div>
    </div>
  );
}