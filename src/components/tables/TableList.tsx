import React, { useState } from 'react';
import { useTableStore } from '../../store/tableStore';
import { useAuthStore } from '../../store/authStore';
import { Table } from '../../types';
import { Play, Square, X, CheckSquare, Square as SquareIcon, Shield, User, Calendar } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { CreateTableModal } from './CreateTableModal';
import { CloseTableDialog } from './CloseTableDialog';
import { Pagination } from '../common/Pagination';

const ITEMS_PER_PAGE = 5;

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function TableList() {
  const { user } = useAuthStore();
  const store = useTableStore();
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tableToClose, setTableToClose] = useState<Table | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const [closeError, setCloseError] = useState<string | null>(null);

  // Filter tables based on status
  const filteredTables = store.tables.filter(table => 
    activeTab === 'active' 
      ? table.status === 'active'
      : table.status === 'archived'
  );

  // Calculate table counts for admin view
  const activeTables = store.tables.filter(t => t.status === 'active').length;
  const closedTables = store.tables.filter(t => t.status === 'archived').length;

  // Calculate pagination
  const totalPages = Math.ceil(filteredTables.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTables = filteredTables.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  
  const allSelected = !user?.isAdmin && paginatedTables.length > 0 && 
    paginatedTables.every(table => selectedTables.includes(table.id));

  const handleSelectAll = () => {
    if (user?.isAdmin) return;
    
    if (allSelected) {
      setSelectedTables([]);
    } else {
      setSelectedTables(paginatedTables.map(table => table.id));
    }
  };

  const handleSelectTable = (tableId: string) => {
    if (user?.isAdmin) return;
    
    setSelectedTables(prev => 
      prev.includes(tableId) 
        ? prev.filter(id => id !== tableId)
        : [...prev, tableId]
    );
  };

  const handleTableAction = (tableId: string) => {
    if (store.activeTable === tableId) {
      store.setActiveTable(null);
    } else {
      store.setActiveTable(tableId);
    }
  };

  const handleCloseGame = (table: Table) => {
    if (user?.isAdmin) return;
    setTableToClose(table);
    setCloseError(null);
  };

  const confirmCloseTable = async (saveToDb: boolean) => {
    if (!tableToClose) return;
    
    setIsClosing(true);
    setCloseError(null);
    
    try {
      await store.closeTable(tableToClose.id, saveToDb);
      setTableToClose(null);
    } catch (error) {
      setCloseError(error instanceof Error ? error.message : 'Failed to close table');
    } finally {
      setIsClosing(false);
    }
  };

  const handleTabChange = (tab: 'active' | 'archived') => {
    setActiveTab(tab);
    setCurrentPage(1);
    store.setActiveTable(null);
    setSelectedTables([]);
  };

  const getHandsCount = (table: Table) => {
    return table.hands?.length || 0;
  };

  return (
    <div className="space-y-4">
      {/* Admin Status */}
      {user?.isAdmin && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg">
            <Shield className="w-4 h-4" />
            <span>Admin Mode - View Only Access</span>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg">
              Active Tables: {activeTables}
            </div>
            <div className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg">
              Closed Tables: {closedTables}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto pb-px">
        {(['active', 'archived'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
              activeTab === tab
                ? 'text-primary-600 border-b-2 border-primary-500'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'archived' ? 'Closed Tables' : 'Active Tables'}
          </button>
        ))}
      </div>

      {filteredTables.length === 0 ? (
        <EmptyState type={activeTab} />
      ) : (
        <div className="relative overflow-hidden rounded-lg border border-gray-200">
          {/* Bulk Actions */}
          {!user?.isAdmin && selectedTables.length > 0 && (
            <div className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-gray-50 border-b border-gray-200">
              <span className="text-sm text-gray-600">
                {selectedTables.length} selected
              </span>
              <div className="h-4 w-px bg-gray-300 mx-2" />
              {activeTab === 'active' && (
                <button
                  onClick={() => {
                    const tablesToClose = store.tables.filter(t => selectedTables.includes(t.id));
                    if (tablesToClose.length === 1) {
                      handleCloseGame(tablesToClose[0]);
                    } else {
                      // Handle bulk close - you might want to add a separate confirmation for this
                      selectedTables.forEach(id => store.closeTable(id, true));
                      setSelectedTables([]);
                    }
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Close Tables
                </button>
              )}
              <button
                onClick={() => setSelectedTables([])}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg ml-auto"
              >
                Cancel
              </button>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {!user?.isAdmin && (
                      <th className="px-6 py-3 text-left">
                        <div className="flex items-center">
                          <button
                            onClick={handleSelectAll}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {allSelected ? (
                              <CheckSquare className="w-5 h-5" />
                            ) : (
                              <SquareIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    {user?.isAdmin && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hands
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTables.map((table) => (
                    <tr
                      key={table.id}
                      className={`${
                        store.activeTable === table.id ? 'bg-primary-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {!user?.isAdmin && (
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleSelectTable(table.id)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            {selectedTables.includes(table.id) ? (
                              <CheckSquare className="w-5 h-5" />
                            ) : (
                              <SquareIcon className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{table.name}</div>
                        <div className="text-sm text-gray-500">{table.category}</div>
                      </td>
                      {user?.isAdmin && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{table.users?.username || table.users?.mobile_number || 'Unknown'}</span>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(table.created_at)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{getHandsCount(table)}/100</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleTableAction(table.id)}
                            className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg ${
                              store.activeTable === table.id
                                ? 'text-amber-600 hover:bg-amber-50'
                                : 'text-primary-600 hover:bg-primary-50'
                            }`}
                          >
                            {store.activeTable === table.id ? (
                              <>
                                <Square className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Hide</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-1" />
                                <span className="hidden sm:inline">Show</span>
                              </>
                            )}
                          </button>

                          {table.status === 'active' && !user?.isAdmin && (
                            <button
                              onClick={() => handleCloseGame(table)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <X className="w-4 h-4 mr-1" />
                              <span className="hidden sm:inline">Close</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}

      {!user?.isAdmin && (
        <>
          <CreateTableModal 
            isOpen={showCreateModal} 
            onClose={() => setShowCreateModal(false)} 
          />
          <CloseTableDialog
            isOpen={!!tableToClose}
            onClose={() => {
              setTableToClose(null);
              setCloseError(null);
            }}
            onConfirm={confirmCloseTable}
            handCount={tableToClose ? getHandsCount(tableToClose) : 0}
            tableName={tableToClose?.name || ''}
            isLoading={isClosing}
            error={closeError}
          />
        </>
      )}
    </div>
  );
}