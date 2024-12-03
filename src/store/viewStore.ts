import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ViewState {
  showPredictions: boolean;
  showBeadPlate: boolean;
  showBigRoad: boolean;
  showTableList: boolean;
  showGameInput: boolean;
  togglePredictions: () => void;
  toggleBeadPlate: () => void;
  toggleBigRoad: () => void;
  toggleTableList: () => void;
  toggleGameInput: () => void;
  toggleAll: (show: boolean) => void;
}

export const useViewStore = create<ViewState>()(
  persist(
    (set) => ({
      showPredictions: true,
      showBeadPlate: true,
      showBigRoad: true,
      showTableList: true,
      showGameInput: true,
      togglePredictions: () => set(state => ({ showPredictions: !state.showPredictions })),
      toggleBeadPlate: () => set(state => ({ showBeadPlate: !state.showBeadPlate })),
      toggleBigRoad: () => set(state => ({ showBigRoad: !state.showBigRoad })),
      toggleTableList: () => set(state => ({ showTableList: !state.showTableList })),
      toggleGameInput: () => set(state => ({ showGameInput: !state.showGameInput })),
      toggleAll: (show) => set({ 
        showPredictions: show, 
        showBeadPlate: show, 
        showBigRoad: show,
        showTableList: show,
        showGameInput: show
      })
    }),
    {
      name: 'view-settings'
    }
  )
);