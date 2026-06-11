'use client';

import React from 'react';
import { Globe2, Landmark, Users, TrendingUp, Info } from 'lucide-react';
import RealityScore from '../ui/reality-score';
import WorldMapPlaceholder from '../ui/world-map-placeholder';
import { World } from '../../types';
import { useTheme } from '../../context/theme-context';

interface IntelligencePanelProps {
  world: World;
}

export default function IntelligencePanel({ world }: IntelligencePanelProps) {
  const { theme } = useTheme();
  const isNewspaper = theme.startsWith('newspaper');

  // Derive a stable, prompt-based stability score
  const calculateStability = (w: World) => {
    const seed = w.id.charCodeAt(0) + w.id.charCodeAt(w.id.length - 1);
    return 35 + (seed % 61);
  };

  const stability = calculateStability(world);

  // Generate some themed trending topics based on the world prompt
  const getTrendingTopics = (prompt: string) => {
    const combined = prompt.toLowerCase();
    if (combined.includes('rome')) {
      return [
        { tag: '#ImperiumNova', volume: '142K scrolls' },
        { tag: '#SenatusConsultum', volume: '98K scrolls' },
        { tag: '#SteamGalleyRace', volume: '44K scrolls' },
        { tag: '#BarbarianBorders', volume: '22K scrolls' },
      ];
    } else if (combined.includes('mars')) {
      return [
        { tag: '#MarsColonization', volume: '88K signal-pings' },
        { tag: '#OxygenRationAct', volume: '72K signal-pings' },
        { tag: '#SteamRockets', volume: '54K signal-pings' },
        { tag: '#PhobosMining', volume: '19K signal-pings' },
      ];
    } else {
      return [
        { tag: '#AnalyticalEngine', volume: '120K telegrams' },
        { tag: '#SteamRouterSpeed', volume: '84K telegrams' },
        { tag: '#PunchCardTax', volume: '43K telegrams' },
        { tag: '#LudditeGuilds', volume: '29K telegrams' },
      ];
    }
  };

  const trends = getTrendingTopics(world.prompt);

  return (
    <div className="flex flex-col gap-6 h-full max-h-full overflow-y-auto pr-5 custom-scrollbar select-none">
      {/* Reality Stability Section */}
      <div className="flex-shrink-0">
        <RealityScore score={stability} />
      </div>

      {/* Hologram Vector Map */}
      <div className="flex-shrink-0">
        <WorldMapPlaceholder />
      </div>

      {/* Civilization Telemetry Grid */}
      <div className={
        isNewspaper
          ? 'border border-primary-base/20 p-5 rounded-none flex flex-col gap-4 bg-black/[0.005] shadow-sm hover:shadow-md transition-all duration-300 flex-shrink-0'
          : 'glass-panel p-5 rounded-xl border border-border-color flex flex-col gap-4 flex-shrink-0'
      }>
        <h3 className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${
          isNewspaper ? 'font-serif text-primary-base font-bold' : 'font-mono text-text-dim'
        }`}>
          <Info size={14} className="text-primary-base" />
          Civilization Telemetry
        </h3>

        <div className={`flex flex-col gap-3 ${isNewspaper ? 'font-serif' : 'font-mono'}`}>
          {/* Era / Government */}
          <div className={`pb-2 flex flex-col gap-1 border-b ${isNewspaper ? 'border-primary-base/10' : 'border-white/5'}`}>
            <span className={`uppercase text-[9px] tracking-wider ${isNewspaper ? 'text-text-dim font-bold' : 'text-text-dim'}`}>Governance</span>
            <span className={`text-xs font-bold leading-normal break-words ${isNewspaper ? 'text-primary-base' : 'text-text-main'}`}>
              {world.gov_type || 'Monarchal Republic'}
            </span>
          </div>

          {/* Tech Level */}
          <div className={`pb-2 flex flex-col gap-1 border-b ${isNewspaper ? 'border-primary-base/10' : 'border-white/5'}`}>
            <span className={`uppercase text-[9px] tracking-wider ${isNewspaper ? 'text-text-dim font-bold' : 'text-text-dim'}`}>Tech Level</span>
            <span className={`text-xs font-bold leading-normal break-words ${isNewspaper ? 'text-primary-base' : 'text-text-main'}`}>
              {world.tech_level || 'Steam Computation'}
            </span>
          </div>

          {/* Population */}
          <div className={`pb-2 flex flex-col gap-1 border-b ${isNewspaper ? 'border-primary-base/10' : 'border-white/5'}`}>
            <span className={`uppercase text-[9px] tracking-wider ${isNewspaper ? 'text-text-dim font-bold' : 'text-text-dim'}`}>Est. Population</span>
            <span className={`text-xs font-bold leading-normal ${isNewspaper ? 'text-primary-base' : 'text-text-main'}`}>428.5 Million</span>
          </div>

          {/* Economic Index */}
          <div className={`pb-2 flex flex-col gap-1 border-b ${isNewspaper ? 'border-primary-base/10' : 'border-white/5'}`}>
            <span className={`uppercase text-[9px] tracking-wider ${isNewspaper ? 'text-text-dim font-bold' : 'text-text-dim'}`}>Economic Index</span>
            <div className="flex items-center gap-2">
              <span className={`w-24 h-2 overflow-hidden block ${isNewspaper ? 'bg-primary-base/10 border border-primary-base/10 rounded-none' : 'bg-white/5 rounded-full'}`}>
                <span className={`h-full block ${isNewspaper ? 'bg-primary-base' : 'bg-accent-base'}`} style={{ width: '78%' }} />
              </span>
              <span className={`text-xs font-bold ${isNewspaper ? 'text-primary-base' : 'text-text-main'}`}>7.8 / 10</span>
            </div>
          </div>

          {/* Public Sentiment */}
          <div className="flex flex-col gap-1">
            <span className={`uppercase text-[9px] tracking-wider ${isNewspaper ? 'text-text-dim font-bold' : 'text-text-dim'}`}>Public Sentiment</span>
            <div className="flex items-center gap-2">
              <span className={`w-24 h-2 overflow-hidden block ${isNewspaper ? 'bg-primary-base/10 border border-primary-base/10 rounded-none' : 'bg-white/5 rounded-full'}`}>
                <span className={`h-full block ${isNewspaper ? 'bg-primary-base/60' : 'bg-green-400'}`} style={{ width: '65%' }} />
              </span>
              <span className={`text-xs font-bold ${isNewspaper ? 'text-primary-base' : 'text-text-main'}`}>65% Content</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Temporal Hashtags */}
      <div className={
        isNewspaper
          ? 'border border-primary-base/20 p-5 rounded-none flex flex-col gap-4 bg-[var(--card-bg)] shadow-sm hover:shadow-md transition-all duration-300 flex-shrink-0'
          : 'glass-panel p-5 rounded-xl border border-border-color flex flex-col gap-4 flex-shrink-0'
      }>
        <h3 className={`text-xs uppercase tracking-wider flex items-center gap-1.5 ${
          isNewspaper ? 'font-serif text-primary-base font-bold' : 'font-mono text-text-dim'
        }`}>
          <TrendingUp size={14} className="text-primary-base" />
          Trending Chronologies
        </h3>

        <div className="flex flex-col gap-3.5">
          {trends.map((tr, idx) => (
            <div key={idx} className="flex justify-between items-center group cursor-pointer">
              <div className={`text-xs font-bold transition-colors ${
                isNewspaper
                  ? 'font-serif text-primary-base group-hover:text-text-dim'
                  : 'font-mono text-text-main group-hover:text-accent-base'
              }`}>
                {tr.tag}
              </div>
              <div className={`text-[9px] ${
                isNewspaper ? 'font-serif text-text-dim' : 'font-mono text-text-dim'
              }`}>{tr.volume}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

