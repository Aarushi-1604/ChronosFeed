'use client';

import React from 'react';
import { GitBranch, History } from 'lucide-react';
import HistoricalEventCard from '../cards/historical-event-card';
import { HistoricalEvent } from '../../types';
import { useTheme } from '../../context/theme-context';

interface TimelineSidebarProps {
  events: HistoricalEvent[];
}

export default function TimelineSidebar({ events }: TimelineSidebarProps) {
  const { theme } = useTheme();
  const isNewspaper = theme.startsWith('newspaper');

  return (
    <div className="flex flex-col gap-5 h-full max-h-full overflow-y-auto pr-5 custom-scrollbar select-none">
      {/* Sidebar Header */}
      <div className={`flex items-center gap-2.5 pb-3.5 border-b ${
        isNewspaper ? 'border-primary-base/20' : 'border-white/5'
      } flex-shrink-0`}>
        <div className={`w-7 h-7 flex items-center justify-center text-primary-base ${
          isNewspaper
            ? 'rounded-none bg-black/[0.02] border border-primary-base/20'
            : 'rounded bg-primary-base/10 border border-primary-base/20'
        }`}>
          <History size={15} />
        </div>
        <div>
          <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 ${
            isNewspaper ? 'font-serif text-primary-base' : 'font-mono text-text-main'
          }`}>
            Chronology Branch
          </h2>
          <p className={`text-[10px] ${isNewspaper ? 'font-serif text-text-dim' : 'text-text-dim'}`}>
            Historical milestones of divergence
          </p>
        </div>
      </div>

      {/* Events Stream */}
      {events && events.length > 0 ? (
        <div className="flex flex-col pl-2.5 flex-shrink-0">
          {events.map((event, index) => (
            <HistoricalEventCard key={event.id} event={event} index={index} />
          ))}
        </div>
      ) : (
        <div className={`flex flex-col items-center justify-center p-8 text-center border ${
          isNewspaper
            ? 'border-dashed border-primary-base/30 bg-transparent rounded-none'
            : 'border border-white/5 bg-white/25 rounded-xl'
        } flex-shrink-0`}>
          <GitBranch size={28} className={`mb-2.5 ${
            isNewspaper ? 'text-primary-base/40' : 'text-text-dim/40 animate-pulse'
          }`} />
          <span className={`${isNewspaper ? 'font-serif text-xs text-text-dim' : 'font-mono text-xs text-text-dim'}`}>
            No historical branches detected
          </span>
        </div>
      )}
    </div>
  );
}

