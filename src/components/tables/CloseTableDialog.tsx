import React from 'react';
import { X, AlertTriangle, Save, Trash2, Loader2 } from 'lucide-react';

interface CloseTableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (saveToDb: boolean) => Promise<void>;
  handCount: number;
  tableName: string;
  isLoading?: boolean;
  error?: string | null;
}

export function CloseTableDialog({ 
  isOpen, 
  onClose, 
  onConfirm, 
  handCount, 
  tableName,
  isLoading,
  error 
}: CloseTableDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Close Table</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="p-2 bg-amber-50 rounded-full">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-base font-medium text-gray-900">
                Close table: {tableName}
              </h4>
              <p className="mt-1 text-sm text-gray-600">
                This table has {handCount} recorded hands. How would you like to proceed?
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 rounded-lg flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => onConfirm(true)}
              disabled={isLoading}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save and Close Table</span>
                </>
              )}
            </button>

            <button
              onClick={() => onConfirm(false)}
              disabled={isLoading}
              className="w-full px-4 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Table Without Saving</span>
            </button>

            <button
              onClick={onClose}
              disabled={isLoading}
              className="w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}