import React from 'react';
import { useTableStore } from '../../store/tableStore';
import { useViewStore } from '../../store/viewStore';
import { BeadPlate } from './BeadPlate';
import { BigRoad } from './BigRoad';

export function ScoreCards() {
  const { activeTable, tables } = useTableStore();
  const { showBeadPlate, showBigRoad } = useViewStore();
  const table = tables.find(t => t.id === activeTable);

  if (!table) return null;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Bead Plate */}
      {showBeadPlate && (
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Bead Plate</h3>
          <div className="overflow-x-auto scrollbar-hide">
            <BeadPlate hands={table.hands} />
          </div>
        </div>
      )}

      {/* Big Road */}
      {showBigRoad && (
        <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Big Road</h3>
          <div className="overflow-x-auto scrollbar-hide">
            <BigRoad hands={table.hands} />
          </div>
        </div>
      )}
    </div>
  );
}