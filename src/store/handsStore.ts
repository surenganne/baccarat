import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { Hand } from '../types';

interface HandsState {
  handsByTable: Record<string, Hand[]>;
  isLoading: boolean;
  error: string | null;
  addHand: (tableId: string, hand: Omit<Hand, 'id' | 'timestamp'>) => void;
  removeLastHand: (tableId: string) => void;
  loadHandsForTable: (tableId: string) => Promise<void>;
  clearHandsForTable: (tableId: string) => void;
  clearError: () => void;
}

export const useHandsStore = create<HandsState>()(
  persist(
    (set, get) => ({
      handsByTable: {},
      isLoading: false,
      error: null,

      addHand: (tableId, hand) => {
        const newHand = {
          ...hand,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString()
        };

        set(state => ({
          handsByTable: {
            ...state.handsByTable,
            [tableId]: [...(state.handsByTable[tableId] || []), newHand]
          },
          error: null
        }));
      },

      removeLastHand: (tableId) => {
        set(state => {
          const tableHands = state.handsByTable[tableId];
          if (!tableHands?.length) return state;

          const newHands = [...tableHands];
          newHands.pop();

          return {
            handsByTable: {
              ...state.handsByTable,
              [tableId]: newHands
            },
            error: null
          };
        });
      },

      loadHandsForTable: async (tableId) => {
        try {
          set({ isLoading: true, error: null });

          const { data: hands, error } = await supabase
            .from('hands')
            .select('*')
            .eq('table_id', tableId)
            .order('created_at', { ascending: true });

          if (error) throw error;

          set(state => ({
            handsByTable: {
              ...state.handsByTable,
              [tableId]: hands || []
            },
            isLoading: false,
            error: null
          }));
        } catch (error) {
          console.error('Error loading hands:', error);
          set({ 
            isLoading: false, 
            error: 'Failed to load hands' 
          });
        }
      },

      clearHandsForTable: (tableId) => {
        set(state => {
          const { [tableId]: _, ...rest } = state.handsByTable;
          return {
            handsByTable: rest,
            error: null
          };
        });
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'hands-storage',
      version: 1,
      partialize: (state) => ({
        handsByTable: {},  // Don't persist hands to avoid stale data
      })
    }
  )
);