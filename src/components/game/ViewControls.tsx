import React from 'react';
import { Eye, EyeOff, Brain, Grid, GitCommit, List, Gamepad2 } from 'lucide-react';
import { useViewStore } from '../../store/viewStore';
import { useAuthStore } from '../../store/authStore';

export function ViewControls() {
  const { user } = useAuthStore();
  const { 
    showPredictions, 
    showBeadPlate, 
    showBigRoad,
    showTableList,
    showGameInput,
    togglePredictions,
    toggleBeadPlate,
    toggleBigRoad,
    toggleTableList,
    toggleGameInput,
    toggleAll
  } = useViewStore();

  const allVisible = showPredictions && showBeadPlate && showBigRoad && showTableList && (!user?.isAdmin && showGameInput);

  return (
    <div className="flex items-center gap-2 min-w-max">
      <button
        onClick={() => toggleAll(!allVisible)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
      >
        {allVisible ? (
          <>
            <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Hide All</span>
          </>
        ) : (
          <>
            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Show All</span>
          </>
        )}
      </button>

      <div className="h-4 w-px bg-gray-200" />

      <div className="flex items-center gap-1">
        <button
          onClick={toggleTableList}
          className={`p-1.5 sm:p-2 rounded-lg transition-colors flex items-center gap-1 ${
            showTableList 
              ? 'text-primary-600 bg-primary-50 hover:bg-primary-100' 
              : 'text-gray-400 hover:bg-gray-100'
          }`}
          title="Toggle Table List"
        >
          <List className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs">Tables</span>
        </button>

        {/* Only show game input toggle for non-admin users */}
        {!user?.isAdmin && (
          <button
            onClick={toggleGameInput}
            className={`p-1.5 sm:p-2 rounded-lg transition-colors flex items-center gap-1 ${
              showGameInput 
                ? 'text-primary-600 bg-primary-50 hover:bg-primary-100' 
                : 'text-gray-400 hover:bg-gray-100'
            }`}
            title="Toggle Game Input"
          >
            <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs">Input</span>
          </button>
        )}

        <button
          onClick={togglePredictions}
          className={`p-1.5 sm:p-2 rounded-lg transition-colors flex items-center gap-1 ${
            showPredictions 
              ? 'text-primary-600 bg-primary-50 hover:bg-primary-100' 
              : 'text-gray-400 hover:bg-gray-100'
          }`}
          title="Toggle Predictions"
        >
          <Brain className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs">Predict</span>
        </button>

        <button
          onClick={toggleBeadPlate}
          className={`p-1.5 sm:p-2 rounded-lg transition-colors flex items-center gap-1 ${
            showBeadPlate 
              ? 'text-primary-600 bg-primary-50 hover:bg-primary-100' 
              : 'text-gray-400 hover:bg-gray-100'
          }`}
          title="Toggle Bead Plate"
        >
          <Grid className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs">Bead</span>
        </button>

        <button
          onClick={toggleBigRoad}
          className={`p-1.5 sm:p-2 rounded-lg transition-colors flex items-center gap-1 ${
            showBigRoad 
              ? 'text-primary-600 bg-primary-50 hover:bg-primary-100' 
              : 'text-gray-400 hover:bg-gray-100'
          }`}
          title="Toggle Big Road"
        >
          <GitCommit className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs">Road</span>
        </button>
      </div>
    </div>
  );
}