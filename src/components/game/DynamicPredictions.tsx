import React, { useState, useEffect } from 'react';
import { useTableStore } from '../../store/tableStore';
import { Zap, Loader2 } from 'lucide-react';
import { calculateProbabilities } from '../../utils/predictions';

interface PredictionBarProps {
  label: string;
  percentage: number;
  color: string;
}

function PredictionBar({ label, percentage, color }: PredictionBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-900">{percentage.toFixed(1)}%</span>
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

export function DynamicPredictions() {
  const { activeTable, tables } = useTableStore();
  const [predictions, setPredictions] = useState({
    player: 0.5,
    banker: 0.5,
    matches: { player: 0, banker: 0 }
  });
  const [isLoading, setIsLoading] = useState(true);
  
  const table = tables?.find(t => t.id === activeTable);

  useEffect(() => {
    async function updatePredictions() {
      if (!table) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Use a smaller window for dynamic predictions
        const newPredictions = await calculateProbabilities(table.hands, 3);
        setPredictions(newPredictions);
      } catch (error) {
        console.error('Error calculating dynamic predictions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    updatePredictions();
  }, [table, table?.hands.length]);

  if (!table) return null;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-amber-500" />
        <h3 className="text-lg font-semibold text-gray-900">Dynamic Prediction</h3>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <PredictionBar
            label="Player"
            percentage={predictions.player * 100}
            color="bg-[#4285f4]"
          />
          <PredictionBar
            label="Banker"
            percentage={predictions.banker * 100}
            color="bg-[#ea4335]"
          />
        </div>
      )}
    </div>
  );
}