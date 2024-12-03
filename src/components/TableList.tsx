import React from 'react';
import { PlusCircle, Table as TableIcon } from 'lucide-react';
import { useTableStore } from '../store/tableStore';

export function TableList() {
  const { tables, activeTable, addTable, setActiveTable } = useTableStore();
  const [newTableName, setNewTableName] = React.useState('');

  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTableName.trim()) {
      addTable(newTableName.trim());
      setNewTableName('');
    }
  };

  return (
    <div className="p-4 bg-gray-800 text-white h-screen">
      <h2 className="text-xl font-bold mb-4">Baccarat Tables</h2>
      
      <form onSubmit={handleAddTable} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
            placeholder="New table name"
            className="flex-1 px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 rounded bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-6 h-6" />
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {tables.map((table) => (
          <button
            key={table.id}
            onClick={() => setActiveTable(table.id)}
            className={`w-full p-3 rounded flex items-center gap-3 transition-colors ${
              activeTable === table.id
                ? 'bg-blue-600'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <TableIcon className="w-5 h-5" />
            <div className="flex-1 text-left">
              <div className="font-medium">{table.name}</div>
              <div className="text-sm text-gray-400">
                {table.hands.length} hands recorded
              </div>
            </div>
            <div
              className={`w-2 h-2 rounded-full ${
                table.isActive ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}