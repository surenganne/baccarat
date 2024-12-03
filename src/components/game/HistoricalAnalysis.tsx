import React from 'react';
import { useTableStore } from '../../store/tableStore';
import { Hand } from '../../types';
import { History, Calendar, TrendingUp, Filter } from 'lucide-react';

interface TimeRange {
  start: Date;
  end: Date;
}

interface AnalysisStats {
  totalHands: number;
  playerWinRate: number;
  bankerWinRate: number;
  tieRate: number;
  naturalRate: number;
  avgStreak: number;
  longestStreak: number;
  pairFrequency: number;
}

function calculateStats(hands: Hand[], timeRange: TimeRange): AnalysisStats {
  const filteredHands = hands.filter(hand => {
    const handDate = new Date(hand.timestamp);
    return handDate >= timeRange.start && handDate <= timeRange.end;
  });

  const total = filteredHands.length;
  if (total === 0) return {
    totalHands: 0,
    playerWinRate: 0,
    bankerWinRate: 0,
    tieRate: 0,
    naturalRate: 0,
    avgStreak: 0,
    longestStreak: 0,
    pairFrequency: 0
  };

  let currentStreak = 1;
  let longestStreak = 1;
  let totalStreaks = 0;
  let streakCount = 0;

  const stats = filteredHands.reduce((acc, hand, index) => {
    // Basic counts
    if (hand.result === 'player') acc.playerWins++;
    if (hand.result === 'banker') acc.bankerWins++;
    if (hand.result === 'tie') acc.ties++;
    if (hand.isNatural) acc.naturals++;
    if (hand.pairs !== 'none') acc.pairs++;

    // Streak calculation
    if (index > 0 && hand.result === filteredHands[index - 1].result) {
      currentStreak++;
    } else {
      if (currentStreak > 1) {
        totalStreaks += currentStreak;
        streakCount++;
      }
      currentStreak = 1;
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    return acc;
  }, {
    playerWins: 0,
    bankerWins: 0,
    ties: 0,
    naturals: 0,
    pairs: 0
  });

  return {
    totalHands: total,
    playerWinRate: (stats.playerWins / total) * 100,
    bankerWinRate: (stats.bankerWins / total) * 100,
    tieRate: (stats.ties / total) * 100,
    naturalRate: (stats.naturals / total) * 100,
    avgStreak: streakCount ? totalStreaks / streakCount : 1,
    longestStreak,
    pairFrequency: (stats.pairs / total) * 100
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div className="flex items-center gap-2 text-gray-600 mb-2">
        {icon}
        <span className="text-sm">{title}</span>
      </div>
      <div className="text-xl font-medium text-gray-900">{value}</div>
    </div>
  );
}

export function HistoricalAnalysis() {
  const { activeTable, tables } = useTableStore();
  const table = tables.find(t => t.id === activeTable);
  const [timeRange, setTimeRange] = React.useState<TimeRange>({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
    end: new Date()
  });

  if (!table) return null;

  const stats = calculateStats(table.hands, timeRange);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900">Historical Analysis</h3>
        </div>
        
        <div className="flex gap-4">
          <input
            type="datetime-local"
            value={timeRange.start.toISOString().slice(0, 16)}
            onChange={(e) => setTimeRange(prev => ({
              ...prev,
              start: new Date(e.target.value)
            }))}
            className="px-2 py-1 rounded-lg border border-gray-200 text-sm"
          />
          <input
            type="datetime-local"
            value={timeRange.end.toISOString().slice(0, 16)}
            onChange={(e) => setTimeRange(prev => ({
              ...prev,
              end: new Date(e.target.value)
            }))}
            className="px-2 py-1 rounded-lg border border-gray-200 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Hands"
          value={stats.totalHands}
          icon={<Filter className="w-4 h-4" />}
        />
        <StatCard
          title="Win Rates"
          value={`P: ${stats.playerWinRate.toFixed(1)}% B: ${stats.bankerWinRate.toFixed(1)}%`}
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          title="Natural Rate"
          value={`${stats.naturalRate.toFixed(1)}%`}
          icon={<Calendar className="w-4 h-4" />}
        />
        <StatCard
          title="Pair Frequency"
          value={`${stats.pairFrequency.toFixed(1)}%`}
          icon={<History className="w-4 h-4" />}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Streak Analysis</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Streak Length:</span>
              <span className="font-medium text-gray-900">{stats.avgStreak.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Longest Streak:</span>
              <span className="font-medium text-gray-900">{stats.longestStreak}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Pattern Distribution</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Tie Rate:</span>
              <span className="font-medium text-gray-900">{stats.tieRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Natural Win Rate:</span>
              <span className="font-medium text-gray-900">{stats.naturalRate.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}