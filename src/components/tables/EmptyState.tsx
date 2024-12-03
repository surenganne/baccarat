import React from 'react';
import { Plus } from 'lucide-react';

interface EmptyStateProps {
  type: 'active' | 'archived';
}

export function EmptyState({ type }: EmptyStateProps) {
  if (type === 'archived') {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-900">No closed tables</h3>
        <p className="mt-2 text-sm text-gray-500">
          You haven't closed any tables yet
        </p>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
          <Plus className="w-10 h-10 text-primary-600" />
        </div>
        
        <h3 className="text-2xl font-medium text-gray-900 mb-3">
          No active tables
        </h3>
        
        <p className="text-gray-600">
          Get started by creating your first table using the Add Table button above.
        </p>
      </div>
    </div>
  );
}