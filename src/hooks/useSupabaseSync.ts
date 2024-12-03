import { useEffect } from 'react';
import { useTableStore } from '../store/tableStore';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export function useSupabaseSync() {
  const { setTables, syncLocalState } = useTableStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (!user) return;

    // Helper function to fetch tables with proper filtering
    const fetchTables = async () => {
      let query = supabase
        .from('tables')
        .select(`
          *,
          hands (*),
          users (
            username,
            mobile_number
          )
        `)
        .order('created_at', { ascending: false });

      // Filter by user_id unless admin
      if (!user.isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data: tables, error } = await query;

      if (!error && tables) {
        setTables(tables);
      }
    };

    // Set up real-time subscriptions
    const tablesChannel = supabase.channel('tables-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tables',
          filter: user.isAdmin ? undefined : `user_id=eq.${user.id}`
        },
        () => fetchTables()
      )
      .subscribe();

    const handsChannel = supabase.channel('hands-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'hands',
          filter: user.isAdmin ? undefined : `table_id=in.(select id from tables where user_id=eq.${user.id})`
        },
        () => fetchTables()
      )
      .subscribe();

    // Subscribe to state sync channel
    const stateSyncChannel = supabase.channel('state-sync')
      .on(
        'broadcast',
        { event: 'state-sync' },
        ({ payload }) => {
          if (payload.userId === user.id) {
            syncLocalState(payload.deviceId, payload.state);
          }
        }
      )
      .subscribe();

    // Initial fetch
    fetchTables();

    // Cleanup subscriptions
    return () => {
      tablesChannel.unsubscribe();
      handsChannel.unsubscribe();
      stateSyncChannel.unsubscribe();
    };
  }, [user, setTables, syncLocalState]);
}