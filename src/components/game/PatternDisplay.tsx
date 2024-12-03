import React from 'react';
import { Pattern } from '../../utils/roads';
import { TrendingUp, Repeat, Shuffle, Hash, GitBranch } from 'lucide-react';

interface PatternDisplayProps {
  patterns: Pattern[];
}

export function PatternDisplay({ patterns }: PatternDisplayProps) {
  if (patterns.length === 0) return null;

  const getPatternIcon = (type: Pattern['type']) => {
    switch (type) {
      case 'alternating':
        return <Shuffle className="w-4 h-4" />;
      case 'zigzag':
        return <GitBranch className="w-4 h-4" />;
      case 'streak':
        return <TrendingUp className="w-4 h-4" />;
      case 'chop':
        return <Hash className="w-4 h-4" />;
      case 'repeat':
        return <Repeat className="w-4 h-4" />;
    }
  };

  const getPatternDescription = (pattern: Pattern) => {
    switch (pattern.type) {
      case 'alternating':
        return 'Alternating between Player and Banker';
      case 'zigzag':
        return 'Zigzag pattern detected';
      case 'streak':
        return `${pattern.length}-hand streak`;
      case 'chop':
        return 'Choppy pattern detected';
      case 'repeat':
        return 'Repeating pattern detected';
    }
  };

  return (
    <div className="space-y-2">
      {patterns.map((pattern, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg"
        >
          <div className="p-2 rounded-full bg-gray-600">
            {getPatternIcon(pattern.type)}
          </div>
          <div className="flex-1">
            <div className="font-medium capitalize">
              {pattern.type} Pattern
            </div>
            <div className="text-sm text-gray-400">
              {getPatternDescription(pattern)}
            </div>
          </div>
          <div className="text-sm">
            <div className="text-gray-400">Confidence</div>
            <div className="font-medium">
              {(pattern.confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}