import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './authStore';
import { Table, Hand } from '../types';

interface TableState {
  tables: Table[];
  activeTable: string | null;
  isLoading: boolean;
  error: string | null;
  deviceId: string;
  setTables: (tables: Table[]) => void;
  setActiveTable: (id: string | null) => void;
  addTable: (name: string, category?: string) => Promise<void>;
  updateTable: (id: string, updates: Partial<Table>) => Promise<void>;
  deleteTable: (id: string) => Promise<void>;
  addHand: (tableId: string, hand: Omit<Hand, 'id' | 'timestamp'>) => void;
  undoLastHand: (tableId: string) => void;
  closeTable: (id: string, saveToDb: boolean) => Promise<void>;
  syncLocalState: (deviceId: string, state: Partial<TableState>) => void;
  clearError: () => void;
  reset: () => void;
  initialize: () => Promise<void>;
}

// Generate a unique device ID
const generateDeviceId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const initialState = {
  tables: [],
  activeTable: null,
  isLoading: false,
  error: null,
  deviceId: generateDeviceId()
};

export const useTableStore = create<TableState>()(
  persist(
    (set, get) => ({
      ...initialState,

      initialize: async () => {
        const user = useAuthStore.getState().user;
        if (!user) {
          set({ ...initialState });
          return;
        }

        try {
          set({ isLoading: true, error: null });
          
          let query = supabase
            .from('tables')
            .select(`
              *,
              users (
                username,
                mobile_number
              )
            `)
            .order('created_at', { ascending: false });

          if (!user.isAdmin) {
            query = query.eq('user_id', user.id);
          }

          const { data: tables, error } = await query;

          if (error) throw error;

          const validTables = tables?.map(table => ({
            ...table,
            hands: table.hands || []
          })) || [];

          set({ 
            tables: validTables, 
            activeTable: null,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('Error initializing tables:', error);
          set({ 
            ...initialState,
            error: 'Failed to load tables. Please try again.'
          });
        }
      },

      setTables: (tables) => {
        set({ 
          tables: tables.map(table => ({
            ...table,
            hands: table.hands || []
          })),
          error: null 
        });
      },

      setActiveTable: (id) => {
        set({ activeTable: id, error: null });
      },

      addTable: async (name, category = 'Default') => {
        const user = useAuthStore.getState().user;
        if (!user || user.isAdmin) {
          set({ error: 'Unauthorized operation' });
          return;
        }

        try {
          set({ error: null });
          const { data: table, error } = await supabase
            .from('tables')
            .insert({
              name,
              category,
              user_id: user.id,
              status: 'active'
            })
            .select(`
              *,
              users (
                username,
                mobile_number
              )
            `)
            .single();

          if (error) throw error;

          const newTable = { ...table, hands: [] };
          const newTables = [newTable, ...get().tables];
          
          set({ 
            tables: newTables,
            activeTable: table.id,
            error: null
          });
        } catch (error) {
          console.error('Error adding table:', error);
          set({ error: 'Failed to add table' });
          throw error;
        }
      },

      addHand: (tableId, hand) => {
        const newHand = {
          ...hand,
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString()
        };

        const newTables = get().tables.map(table => {
          if (table.id === tableId) {
            return {
              ...table,
              hands: [...(table.hands || []), newHand]
            };
          }
          return table;
        });

        set({ tables: newTables, error: null });
      },

      undoLastHand: (tableId) => {
        const newTables = get().tables.map(table => {
          if (table.id === tableId && table.hands?.length > 0) {
            const newHands = [...(table.hands || [])];
            newHands.pop();
            return { ...table, hands: newHands };
          }
          return table;
        });

        set({ tables: newTables, error: null });
      },

      closeTable: async (id, saveToDb) => {
        const table = get().tables.find(t => t.id === id);
        if (!table) {
          set({ error: 'Table not found' });
          return;
        }

        try {
          set({ error: null });

          if (saveToDb && table.hands?.length > 0) {
            const { error: handsError } = await supabase
              .from('hands')
              .insert(
                table.hands.map(hand => ({
                  table_id: id,
                  result: hand.result,
                  player_score: hand.score.player,
                  banker_score: hand.score.banker,
                  created_at: hand.timestamp
                }))
              );

            if (handsError) throw handsError;

            const { error: tableError } = await supabase
              .from('tables')
              .update({ 
                status: 'archived',
                archived_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('id', id);

            if (tableError) throw tableError;
          }

          const newTables = get().tables.filter(t => t.id !== id);
          set({ 
            tables: newTables, 
            activeTable: get().activeTable === id ? null : get().activeTable,
            error: null 
          });
        } catch (error) {
          console.error('Error closing table:', error);
          set({ error: 'Failed to close table. Please try again.' });
          throw error;
        }
      },

      updateTable: async (id, updates) => {
        try {
          set({ error: null });
          const { error } = await supabase
            .from('tables')
            .update(updates)
            .eq('id', id);

          if (error) throw error;

          const newTables = get().tables.map(table =>
            table.id === id ? { ...table, ...updates } : table
          );

          set({ tables: newTables, error: null });
        } catch (error) {
          console.error('Error updating table:', error);
          set({ error: 'Failed to update table' });
          throw error;
        }
      },

      deleteTable: async (id) => {
        try {
          set({ error: null });
          const { error } = await supabase
            .from('tables')
            .delete()
            .eq('id', id);

          if (error) throw error;

          const newTables = get().tables.filter(table => table.id !== id);
          set({ 
            tables: newTables, 
            activeTable: get().activeTable === id ? null : get().activeTable,
            error: null 
          });
        } catch (error) {
          console.error('Error deleting table:', error);
          set({ error: 'Failed to delete table' });
          throw error;
        }
      },

      syncLocalState: (deviceId: string, state: Partial<TableState>) => {
        if (deviceId !== get().deviceId) {
          set({ ...state, error: null });
        }
      },

      clearError: () => set({ error: null }),

      reset: () => set(initialState)
    }),
    {
      name: 'table-storage',
      version: 2,
      partialize: (state) => ({
        tables: [],  // Don't persist tables to avoid stale data
        activeTable: null,
        deviceId: state.deviceId
      }),
      onRehydrateStorage: () => (state) => {
        // Clear any persisted error state and tables on rehydration
        if (state) {
          state.error = null;
          state.tables = [];
          state.activeTable = null;
        }
      }
    }
  )
);