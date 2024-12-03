import React, { useEffect } from 'react';
import { Plus, LogOut, CloudOff, RefreshCw, AlertTriangle, Cloud } from 'lucide-react';
import { useTableStore } from '../../store/tableStore';
import { useAuthStore } from '../../store/authStore';
import { generateTableName } from '../../utils/tableNames';
import { ViewControls } from '../game/ViewControls';
import { useSyncStore } from '../../store/syncStore';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { addTable } = useTableStore();
  const { logout, user, isOfflineLogin, lastLoginMode } = useAuthStore();
  const { 
    isOnline, 
    setOnlineStatus, 
    pendingSyncs, 
    syncPendingData, 
    isSyncing,
    syncError,
    setSyncError
  } = useSyncStore();

  const handleAddTable = () => {
    const { name } = generateTableName();
    addTable(name, 'Standard');
  };

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setOnlineStatus(true);
      setSyncError(null);
    };
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial online status
    setOnlineStatus(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus, setSyncError]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && pendingSyncs.length > 0 && !isSyncing && lastLoginMode === 'offline') {
      // Don't auto-sync, wait for user action
      console.log('Online now, waiting for user to initiate sync');
    }
  }, [isOnline, pendingSyncs.length, isSyncing, lastLoginMode]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">3nadh Score Card</h1>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {!isOnline && (
                <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                  <CloudOff className="w-4 h-4" />
                  <span className="text-xs">Offline Mode</span>
                </div>
              )}

              {isOnline && isOfflineLogin && (
                <div className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  <Cloud className="w-4 h-4" />
                  <span className="text-xs">Online Now</span>
                </div>
              )}

              {syncError && (
                <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-xs">Sync Failed</span>
                </div>
              )}

              {pendingSyncs.length > 0 && isOnline && (
                <button
                  onClick={syncPendingData}
                  disabled={isSyncing}
                  className="flex items-center gap-1 text-primary-600 bg-primary-50 px-2 py-1 rounded-lg disabled:opacity-50 hover:bg-primary-100 transition-colors"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span className="text-xs">
                    {isSyncing ? 'Syncing...' : `Sync ${pendingSyncs.length} tables`}
                  </span>
                </button>
              )}

              {!user?.isAdmin && (
                <button 
                  onClick={handleAddTable}
                  className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Add Table</span>
                </button>
              )}
              <button
                onClick={logout}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {user && (
            <div className="pb-2 sm:pb-3">
              <p className="text-xs sm:text-sm text-gray-600">
                Logged in as: {user.username || user.mobileNumber}
                {user.isAdmin && " (Admin)"}
              </p>
            </div>
          )}

          <div className="border-t border-gray-200 py-2 sm:py-3 overflow-x-auto scrollbar-hide">
            <ViewControls />
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-6">
        {children}
      </main>
    </div>
  );
}