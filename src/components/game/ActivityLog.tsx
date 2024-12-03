import React from 'react';
import { useTableStore } from '../../store/tableStore';
import { History, Calendar, Clock, Filter, ArrowUpRight, Archive, Edit2, Power } from 'lucide-react';
import { ActivityLogType } from '../../types';

interface ActivityItemProps {
  type: ActivityLogType;
  timestamp: string;
  details: string;
}

function ActivityItem({ type, timestamp, details }: ActivityItemProps) {
  const getIcon = () => {
    switch (type) {
      case 'created':
        return <Calendar className="w-4 h-4 text-green-500" />;
      case 'archived':
        return <Archive className="w-4 h-4 text-red-500" />;
      case 'restored':
        return <ArrowUpRight className="w-4 h-4 text-blue-500" />;
      case 'category_updated':
        return <Edit2 className="w-4 h-4 text-purple-500" />;
      case 'imported':
        return <Filter className="w-4 h-4 text-amber-500" />;
      case 'status_updated':
        return <Power className="w-4 h-4 text-gray-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'created':
        return 'Table Created';
      case 'archived':
        return 'Table Archived';
      case 'restored':
        return 'Table Restored';
      case 'category_updated':
        return 'Category Updated';
      case 'imported':
        return 'Table Imported';
      case 'status_updated':
        return 'Status Updated';
      default:
        return 'Activity';
    }
  };

  return (
    <div className="flex gap-4 py-3">
      <div className="flex-none">
        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
          {getIcon()}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-medium text-gray-900">{getTypeLabel()}</p>
          <time className="text-xs text-gray-500">
            {new Date(timestamp).toLocaleString()}
          </time>
        </div>
        <p className="mt-1 text-sm text-gray-600">{details}</p>
      </div>
    </div>
  );
}

interface TimelineProps {
  items: ActivityItemProps[];
}

function Timeline({ items }: TimelineProps) {
  return (
    <div className="flow-root">
      <ul className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <li key={index}>
            <ActivityItem {...item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ActivityLog() {
  const { activeTable, tables } = useTableStore();
  const table = tables.find(t => t.id === activeTable);
  const [filter, setFilter] = React.useState<ActivityLogType | 'all'>('all');

  if (!table || !table.activityLog) return null;

  const filteredLogs = filter === 'all' 
    ? table.activityLog 
    : table.activityLog.filter(log => log.type === filter);

  const activityTypes: { value: ActivityLogType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Activity' },
    { value: 'created', label: 'Created' },
    { value: 'archived', label: 'Archived' },
    { value: 'restored', label: 'Restored' },
    { value: 'category_updated', label: 'Category Updates' },
    { value: 'imported', label: 'Imported' },
    { value: 'status_updated', label: 'Status Updates' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary-500" />
            <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as ActivityLogType | 'all')}
            className="text-sm border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            {activityTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-6 py-4">
        {filteredLogs.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No activity logs found
          </div>
        ) : (
          <Timeline items={filteredLogs} />
        )}
      </div>
    </div>
  );
}