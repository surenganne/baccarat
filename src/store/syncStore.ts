import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import { Hand, Table } from '../types';
import { useAuthStore } from './authStore';

interface PendingSync {
  tableId: string;
  tableName: string;
  hands: Hand[];
  timestamp: string;
  retryCount: number;
  userId: string;
}

interface SyncState {
  pendingSyncs: PendingSync[];
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncAttempt: string | null;
  syncError: string | null;
  addPendingSync: (table: Table) => void;
  removePendingSync: (tableId: string) => void;
  setOnlineStatus: (status: boolean) => void;
  syncPendingData: () => Promise<void>;
  setSyncError: (error: string | null) => void;
  reset: () => void;
}

const initialState: SyncState = {
  pendingSyncs: [],
  isOnline: navigator.onLine,
  isSyncing: false,
  lastSyncAttempt: null,
  syncError: null,
  addPendingSync: () => {},
  removePendingSync: () => {},
  setOnlineStatus: () => {},
  syncPendingData: async () => {},
  setSyncError: () => {},
  reset: () => {}
};

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addPendingSync: (table) => {
        const user = useAuthStore.getState().user;
        if (!user) return;

        set(state => ({
          pendingSyncs: [
            ...state.pendingSyncs,
            {
              tableId: table.id,
              tableName: table.name,
              hands: table.hands,
              timestamp: new Date().toISOString(),
              retryCount: 0,
              userId: user.id
            }
          ],
          syncError: null
        }));
      },

      removePendingSync: (tableId) => {
        set(state => ({
          pendingSyncs: state.pendingSyncs.filter(sync => sync.tableId !== tableId),
          syncError: null
        }));
      },

      setOnlineStatus: (status) => {
        set({ isOnline: status });
        
        if (status && get().pendingSyncs.length > 0) {
          get().syncPendingData();
        }
      },

      setSyncError: (error) => {
        set({ syncError: error });
      },

      syncPendingData: async () => {
        const state = get();
        const user = useAuthStore.getState().user;
        
        if (!user || !state.isOnline || state.isSyncing || state.pendingSyncs.length === 0) {
          return;
        }

        set({ 
          isSyncing: true, 
          lastSyncAttempt: new Date().toISOString(),
          syncError: null 
        });

        try {
          const userSyncs = state.pendingSyncs.filter(sync => sync.userId === user.id);

          for (const sync of userSyncs) {
            try {
              if (!navigator.onLine) {
                throw new Error('Network connection lost during sync');
              }

              const { error: handsError } = await supabase
                .from('hands')
                .insert(
                  sync.hands.map(hand => ({
                    table_id: sync.tableId,
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
                  archived_at: sync.timestamp,
                  updated_at: new Date().toISOString()
                })
                .eq('id', sync.tableId);

              if (tableError) throw tableError;

              get().removePendingSync(sync.tableId);

              supabase.channel('sync-status')
                .send({
                  type: 'broadcast',
                  event: 'sync-complete',
                  payload: {
                    tableId: sync.tableId,
                    userId: user.id,
                    timestamp: new Date().toISOString()
                  }
                });
            } catch (error) {
              console.error(`Failed to sync table ${sync.tableId}:`, error);
              
              set(state => ({
                pendingSyncs: state.pendingSyncs.map(s => 
                  s.tableId === sync.tableId 
                    ? { ...s, retryCount: s.retryCount + 1 }
                    : s
                ),
                syncError: error instanceof Error ? error.message : 'Failed to sync data'
              }));

              if (sync.retryCount >= 3) {
                set(state => ({
                  syncError: `Max retry attempts reached for table ${sync.tableName}`
                }));
              }
            }
          }
        } finally {
          set({ isSyncing: false });
        }
      },

      reset: () => set(initialState)
    }),
    {
      name: 'sync-storage',
      version: 4,
      partialize: (state) => ({
        pendingSyncs: state.pendingSyncs,
        lastSyncAttempt: state.lastSyncAttempt
      }),
      migrate: (persistedState: any, version: number) => {
        if (version < 4) {
          // Migrate to v4 schema
          return {
            ...initialState,
            ...persistedState,
            pendingSyncs: persistedState.pendingSyncs || [],
            lastSyncAttempt: null,
            syncError: null,
            isOnline: navigator.onLine,
            isSyncing: false
          };
        }
        return persistedState as SyncState;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isSyncing = false;
          state.syncError = null;
          state.isOnline = navigator.onLine;
        }
      }
    }
  )
);