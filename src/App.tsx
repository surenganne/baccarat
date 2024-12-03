import React, { useEffect } from 'react';
import { Layout } from './components/layout/Layout';
import { TableList } from './components/tables/TableList';
import { GamePanel } from './components/game/GamePanel';
import { useTableStore } from './store/tableStore';
import { useAuthStore } from './store/authStore';
import { useSupabaseSync } from './hooks/useSupabaseSync';
import { AlertCircle } from 'lucide-react';
import { AuthScreen } from './components/auth/AuthScreen';
import { useViewStore } from './store/viewStore';

export default function App() {
  const { activeTable, tables, isLoading, error, initialize } = useTableStore();
  const { user } = useAuthStore();
  const { showTableList } = useViewStore();

  // Set up Supabase real-time sync
  useSupabaseSync();

  // Initialize tables when user logs in
  useEffect(() => {
    if (user) {
      initialize();
    }
  }, [user, initialize]);

  if (!user) {
    return <AuthScreen />;
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div>
                <h3 className="font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {showTableList && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <TableList />
          </div>
        )}
        
        {activeTable && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <GamePanel />
          </div>
        )}
      </div>
    </Layout>
  );
}