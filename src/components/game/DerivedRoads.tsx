import React from 'react';
import { useTableStore } from '../../store/tableStore';
import { Crown, Users, Info } from 'lucide-react';
import { generateBigEyeBoy, generateSmallRoad, generateCockroachRoad } from '../../utils/roadUtils';

interface RoadDescriptionProps {
  title: string;
  description: string;
}

function RoadDescription({ title, description }: RoadDescriptionProps) {
  const [showInfo, setShowInfo] = React.useState(false);

  return (
    <div className="flex items-center gap-2 mb-3">
      <h4 className="text-sm font-medium text-gray-900">{title}</h4>
      <div className="relative">
        <button
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <Info className="w-4 h-4 text-gray-400" />
        </button>
        {showInfo && (
          <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-white rounded-lg shadow-lg border border-gray-200 z-10 text-sm text-gray-600">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

function DerivedRoadSection({ 
  title, 
  description,
  grid,
  cellSize = 8
}: { 
  title: string;
  description: string;
  grid: Array<Array<{ type: 'player' | 'banker'; filled: boolean } | null>>; 
  cellSize?: number;
}) {
  return (
    <div>
      <RoadDescription title={title} description={description} />
      <div 
        className="inline-grid gap-px bg-gray-100 p-px rounded border border-gray-200"
        style={{ 
          gridTemplateColumns: `repeat(${grid[0]?.length || 16}, minmax(${cellSize}px, 1fr))`,
          gridTemplateRows: `repeat(${grid.length || 3}, minmax(${cellSize}px, 1fr))`
        }}
      >
        {grid.map((row, i) => (
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`
                w-${cellSize} h-${cellSize} 
                flex items-center justify-center
                ${cell ? `
                  ${cell.type === 'banker' ? 'text-[#ea4335]' : 'text-[#4285f4]'}
                  ${cell.filled ? 'bg-white' : 'bg-opacity-10'}
                ` : 'bg-white'}
                transition-colors
              `}
            >
              {cell?.filled && (
                cell.type === 'banker' ? (
                  <Crown className="w-3 h-3" />
                ) : (
                  <Users className="w-3 h-3" />
                )
              )}
            </div>
          ))
        ))}
      </div>
    </div>
  );
}

export function DerivedRoads() {
  const { activeTable, tables } = useTableStore();
  const table = tables.find(t => t.id === activeTable);

  if (!table) return null;

  const nonTieHands = table.hands.filter(hand => hand.result !== 'tie');
  
  const bigEyeBoy = generateBigEyeBoy(nonTieHands);
  const smallRoad = generateSmallRoad(nonTieHands);
  const cockroachRoad = generateCockroachRoad(nonTieHands);

  return (
    <div className="grid grid-cols-1 gap-6">
      <DerivedRoadSection 
        title="Big Eye Boy" 
        description="Derived from the Big Road, this pattern looks at whether consecutive entries in adjacent columns are on the same row. It helps predict short-term trend changes and is considered the most reliable of the derived roads."
        grid={bigEyeBoy}
      />
      <DerivedRoadSection 
        title="Small Road" 
        description="Looks at entries one column further apart than the Big Eye Boy. This road starts its analysis with entries two columns behind the current column, helping identify medium-term pattern shifts."
        grid={smallRoad}
      />
      <DerivedRoadSection 
        title="Cockroach Road" 
        description="The most sensitive of the derived roads, it analyzes entries three columns apart. While more volatile, it can provide early signals of potential trend changes and complements the other roads."
        grid={cockroachRoad}
      />

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h5 className="text-sm font-medium text-gray-900 mb-2">Understanding Derived Roads</h5>
        <p className="text-sm text-gray-600">
          Derived roads are predictive tools used in Baccarat to identify potential pattern changes. Each road analyzes different column relationships in the Big Road, providing multiple perspectives on trend development. When all three roads show similar signals, it's considered a stronger indication of the next outcome.
        </p>
      </div>
    </div>
  );
}