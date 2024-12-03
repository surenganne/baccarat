import React, { useState, useEffect } from 'react';
import { useTableStore } from '../../store/tableStore';
import { usePredictionSettings } from '../../store/predictionSettings';
import { Brain, Hash, Loader2 } from 'lucide-react';
import { calculateProbabilities } from '../../utils/predictions';

interface PredictionBarProps {
  label: string;
  percentage: number;
  matches: number;
  color: string;
}

function PredictionBar({ label, percentage, matches, color }: PredictionBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">
            <Hash className="w-3 h-3 inline mr-1" />
            {matches}
          </span>
          <span className="text-gray-900">{percentage.toFixed(1)}%</span>
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function Predictions() {
  const { activeTable, tables } = useTableStore();
  const { minimumHands, setMinimumHands } = usePredictionSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [tempMinHands, setTempMinHands] = useState(minimumHands);
  const [predictions, setPredictions] = useState({
    player: 0.5,
    banker: 0.5,
    matches: { player: 0, banker: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const table = tables?.find(t => t.id === activeTable);

  useEffect(() => {
    async function updatePredictions() {
      if (!table) return;
      
      setIsLoading(true);
      try {
        const newPredictions = await calculateProbabilities(table.hands, minimumHands);
        setPredictions(newPredictions);
      } catch (error) {
        console.error('Error calculating predictions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    updatePredictions();
  }, [table, table?.hands.length, minimumHands]);

  if (!table) return null;

  const remainingHands = Math.max(0, minimumHands - table.hands.length);

  const handleSave = () => {
    const value = Math.max(3, Math.min(15, tempMinHands));
    setMinimumHands(value);
    setIsEditing(false);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary-500" />
          <h3 className="text-lg font-semibold text-gray-900">Next Hand Prediction</h3>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-500">Minimum Hands:</span>
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={tempMinHands}
                onChange={(e) => setTempMinHands(Math.max(3, Math.min(15, parseInt(e.target.value) || 3)))}
                className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                min="3"
                max="15"
              />
              <button
                onClick={handleSave}
                className="px-3 py-1 text-sm bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors"
              >
                Save
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setTempMinHands(minimumHands);
                setIsEditing(true);
              }}
              className="font-medium text-primary-500 hover:text-primary-600"
            >
              {minimumHands} (Edit)
            </button>
          )}
        </div>
      </div>

      {remainingHands > 0 && (
        <div className="mb-6 flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
          <span className="text-sm">Need {remainingHands} more hands for predictions</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <PredictionBar
            label="Player"
            percentage={predictions.player * 100}
            matches={predictions.matches.player}
            color="bg-[#4285f4]"
          />
          <PredictionBar
            label="Banker"
            percentage={predictions.banker * 100}
            matches={predictions.matches.banker}
            color="bg-[#ea4335]"
          />
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <Hash className="w-3 h-3 inline mr-1" />
        Pattern matches found in historical data
      </div>
    </div>
  );
}