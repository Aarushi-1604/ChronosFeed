'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/theme-context';

export default function WorldMapPlaceholder() {
  const [coords, setCoords] = useState({ lat: '51.5074° N', lon: '0.1278° W' });
  const { theme } = useTheme();
  const isNewspaper = theme.startsWith('newspaper');

  // Update mock coordinate telemetry periodically
  useEffect(() => {
    const timer = setInterval(() => {
      const latDeg = (40 + Math.random() * 20).toFixed(4);
      const lonDeg = (Math.random() * 10).toFixed(4);
      setCoords({
        lat: `${latDeg}° N`,
        lon: `${lonDeg}° W`,
      });
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={
      isNewspaper
        ? "border border-primary-base/20 p-4 rounded-none flex flex-col gap-3 relative overflow-hidden h-[240px] select-none bg-[var(--card-bg)] hover:border-primary-base/40 transition-all shadow-sm hover:shadow-md"
        : "glass-panel p-4 rounded-xl border border-border-color flex flex-col gap-3 relative overflow-hidden h-[240px] select-none"
    }>
      {/* HUD Telemetry header */}
      <div className={`flex items-center justify-between border-b pb-2 ${
        isNewspaper ? 'font-serif text-[9px] text-text-dim border-primary-base/10' : 'font-mono text-[9px] text-text-dim border-white/5'
      }`}>
        <div className="flex items-center gap-1.5">
          {!isNewspaper && <span className="w-1.5 h-1.5 rounded-full bg-primary-base animate-ping" />}
          <span>REAL-TIME TEMPORAL PLOTTING</span>
        </div>
        <div className="flex gap-4">
          <span>LAT: {coords.lat}</span>
          <span>LON: {coords.lon}</span>
        </div>
      </div>

      {/* Map Content */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Holographic grid lines - hide for newspaper */}
        {!isNewspaper && <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />}

        {/* Vector SVG Map */}
        <svg className="w-full h-full opacity-60 text-primary-base" viewBox="0 0 400 180" fill="none">
          {/* Graticule Circles */}
          <circle cx="200" cy="90" r="80" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 6" className={isNewspaper ? 'opacity-20' : 'opacity-30'} />
          <circle cx="200" cy="90" r="140" stroke="currentColor" strokeWidth="0.5" strokeDasharray="5 10" className={isNewspaper ? 'opacity-10' : 'opacity-20'} />

          {/* Stylized Vector Landmasses */}
          <path
            d="M50,70 Q70,50 90,65 T130,60 T160,80 T130,120 T90,105 T60,110 Z"
            fill="currentColor"
            fillOpacity={isNewspaper ? '0.07' : '0.04'}
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M220,50 Q260,30 300,50 T340,80 T300,130 T250,110 T230,80 Z"
            fill="currentColor"
            fillOpacity={isNewspaper ? '0.07' : '0.04'}
            stroke="currentColor"
            strokeWidth="1"
          />
          <path
            d="M160,110 Q180,95 200,120 T220,140 T170,160 Z"
            fill="currentColor"
            fillOpacity={isNewspaper ? '0.07' : '0.04'}
            stroke="currentColor"
            strokeWidth="0.8"
          />

          {/* Sector grid markers */}
          <line x1="200" y1="0" x2="200" y2="180" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4" className={isNewspaper ? 'opacity-20' : 'opacity-30'} />
          <line x1="0" y1="90" x2="400" y2="90" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4" className={isNewspaper ? 'opacity-20' : 'opacity-30'} />

          {/* Pulse points representing temporal hubs */}
          <g>
            <circle cx="110" cy="80" r="3" fill="currentColor" className={isNewspaper ? 'text-primary-base' : 'text-accent-base'} />
            <circle cx="110" cy="80" r="8" stroke="currentColor" strokeWidth="0.5" className={`origin-center ${isNewspaper ? 'text-primary-base opacity-40' : 'text-accent-base animate-ping'}`} />
          </g>
          <g>
            <circle cx="280" cy="70" r="3" fill="currentColor" className={isNewspaper ? 'text-primary-base' : 'text-accent-base'} />
            <circle cx="280" cy="70" r="8" stroke="currentColor" strokeWidth="0.5" className={`origin-center ${isNewspaper ? 'text-primary-base opacity-40' : 'text-accent-base animate-ping'}`} />
          </g>
          <g>
            <circle cx="260" cy="110" r="2.5" fill="currentColor" className={isNewspaper ? 'text-primary-base' : 'text-primary-base'} />
            <circle cx="260" cy="110" r="6" stroke="currentColor" strokeWidth="0.5" className={`origin-center ${isNewspaper ? 'text-primary-base opacity-40' : 'text-primary-base animate-ping'}`} />
          </g>
        </svg>

        {/* Compass Dial overlay */}
        <motion.div
          className={`absolute bottom-2 right-2 w-16 h-16 border border-dashed rounded-full pointer-events-none flex items-center justify-center ${
            isNewspaper ? 'border-primary-base/30 text-primary-base opacity-30' : 'border-current text-primary-base opacity-40'
          }`}
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
        >
          <div className="w-10 h-0.5 bg-current absolute" />
          <div className="h-10 w-0.5 bg-current absolute" />
        </motion.div>
      </div>

      {/* Subtext telemetry info */}
      <div className={`flex justify-between mt-1 ${
        isNewspaper ? 'font-serif text-[9px] text-text-dim' : 'font-mono text-[9px] text-text-dim'
      }`}>
        <span>SECTOR: DELTA-9</span>
        <span>ENGINE STABILIZATION: OPTIMAL</span>
      </div>
    </div>
  );
}
