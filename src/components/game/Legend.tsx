import React from 'react';
import { Crown, Users, Divide, Star, CircleDot } from 'lucide-react';

export function Legend() {
  return (
    <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-blue-500" />
        <span>Player</span>
      </div>
      <div className="flex items-center gap-2">
        <Crown className="w-4 h-4 text-red-500" />
        <span>Banker</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-lg bg-emerald-500 flex items-center justify-center">
          <Divide className="w-3 h-3 text-white" />
        </div>
        <span>Tie</span>
      </div>
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 text-amber-400" />
        <span>Natural</span>
      </div>
      <div className="flex items-center gap-2">
        <CircleDot className="w-4 h-4 text-gray-600" />
        <span>Pair</span>
      </div>
    </div>
  );
}