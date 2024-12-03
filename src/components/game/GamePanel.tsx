import React from 'react';
import { GameInput } from './GameInput';
import { ScoreCards } from './ScoreCards';
import { Analytics } from './Analytics';
import { Predictions } from './Predictions';
import { DynamicPredictions } from './DynamicPredictions';
import { useTableStore } from '../../store/tableStore';
import { useAuthStore } from '../../store/authStore';
import { useViewStore } from '../../store/viewStore';
import { BarChart2, Layout } from 'lucide-react';

export function GamePanel() {
  const { user } = useAuthStore();
  const { activeTable, tables } = useTableStore();
  const { showPredictions, showGameInput } = useViewStore();
  const [view, setView] = React.useState<'game' | 'analytics'>('game');
  
  // Find the active table
  const table = tables?.find(t => t.id === activeTable);
  
  // Early return if no table is found
  if (!table) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-gray-500">
        Select a table to start recording hands
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Table Name Header */}
      <div className="flex-none border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">{table.name}</h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              {table.category} • {table.hands?.length || 0}/100 hands recorded
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              <button
                onClick={() => setView('game')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 ${
                  view === 'game'
                    ? 'bg-primary-50 text-primary-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Layout className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Game</span>
              </button>
              <button
                onClick={() => setView('analytics')}
                className={`px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 ${
                  view === 'analytics'
                    ? 'bg-primary-50 text-primary-600'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BarChart2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Stats</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {view === 'game' ? (
        <div className="flex-1 flex flex-col h-full relative">
          {/* Mobile Layout */}
          <div className="md:hidden flex flex-col h-full">
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 space-y-4">
                {showPredictions && (
                  <>
                    <Predictions />
                    <DynamicPredictions />
                  </>
                )}
                <ScoreCards />
              </div>
            </div>
            
            {/* Fixed Game Input */}
            {table.status === 'active' && !user?.isAdmin && showGameInput && (
              <div className="sticky bottom-0 border-t border-gray-200 bg-white">
                <GameInput />
              </div>
            )}
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex md:flex-col h-full">
            {table.status === 'active' && !user?.isAdmin && showGameInput && (
              <div className="flex-none border-b border-gray-200">
                <GameInput />
              </div>
            )}
            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="h-full overflow-y-auto p-6">
                <div className="space-y-6">
                  {showPredictions && (
                    <>
                      <Predictions />
                      <DynamicPredictions />
                    </>
                  )}
                  <ScoreCards />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <Analytics />
        </div>
      )}
    </div>
  );
}