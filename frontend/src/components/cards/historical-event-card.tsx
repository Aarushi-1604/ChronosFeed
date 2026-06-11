'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Calendar, GitFork } from 'lucide-react';
import { HistoricalEvent } from '../../types';
import { useTheme } from '../../context/theme-context';

interface HistoricalEventCardProps {
  event: HistoricalEvent;
  index: number;
}

export default function HistoricalEventCard({ event, index }: HistoricalEventCardProps) {
  const [isOpen, setIsOpen] = useState(index === 0); // Open the first event by default
  const { theme } = useTheme();
  const isNewspaper = theme.startsWith('newspaper');

  return (
    <div className="flex gap-4 relative">
      {/* Visual vertical line connectors */}
      <div className="flex flex-col items-center">
        <div className={
          isNewspaper
            ? "w-10 h-10 rounded-none border-2 border-primary-base bg-background z-10 flex items-center justify-center font-serif text-[11px] font-black text-primary-base select-none hover:scale-105 transition-transform duration-300 shadow-sm"
            : "w-8 h-8 rounded-full border border-border-color bg-background z-10 flex items-center justify-center font-mono text-[10px] font-bold text-accent-base tracking-tighter shadow-md select-none group-hover:scale-110 transition-transform duration-300"
        }>
          {event.year}
        </div>
        
        {isNewspaper ? (
          <div className="w-0 flex-1 border-r-2 border-dashed border-primary-base/20 relative my-1" />
        ) : (
          <div className="w-0.5 flex-1 bg-white/5 relative">
            <div className="absolute inset-x-0 top-0 bottom-0 temporal-line opacity-20 group-hover:opacity-40 transition-opacity" />
          </div>
        )}
      </div>

      {/* Main card box */}
      <div className="flex-1 pb-6">
        <motion.div
          className={
            isNewspaper
              ? "border border-primary-base/20 p-4 rounded-none cursor-pointer flex flex-col gap-2 relative overflow-hidden select-none hover:border-primary-base/40 bg-[var(--card-bg)] transition-all"
              : "glass-panel p-4 rounded-xl border border-border-color cursor-pointer flex flex-col gap-2 relative overflow-hidden select-none"
          }
          onClick={() => setIsOpen(!isOpen)}
          layout
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <h4 className="text-sm font-bold font-serif text-text-main pr-4 leading-snug">
              {event.title}
            </h4>
            <span className={`text-[9px] uppercase tracking-widest mt-0.5 ${
              isNewspaper ? 'font-serif text-text-dim' : 'font-mono text-text-dim/50'
            }`}>
              Node #{index + 1}
            </span>
          </div>

          {/* Expandable details */}
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className={`pt-2.5 flex flex-col gap-3 mt-2 text-xs border-t ${
                  isNewspaper ? 'border-primary-base/10' : 'border-white/5'
                }`}>
                  {/* Summary */}
                  <div>
                    <div className={`text-[9px] uppercase mb-1 ${
                      isNewspaper ? 'font-serif text-text-dim font-bold' : 'font-mono text-text-dim/60'
                    }`}>
                      Dossier Log
                    </div>
                    <p className={`leading-relaxed ${
                      isNewspaper ? 'text-primary-base/90 font-serif' : 'text-text-dim font-sans'
                    }`}>
                      {event.description}
                    </p>
                  </div>

                  {/* Cause & Effect Impact */}
                  <div className={
                    isNewspaper
                      ? "p-2.5 bg-black/[0.015] border border-primary-base/15 rounded-none flex flex-col gap-1.5 font-serif text-[11px] text-primary-base relative"
                      : "p-2.5 bg-white/5 border border-white/10 rounded-lg flex flex-col gap-1.5 font-mono text-[11px] text-accent-base relative"
                  }>
                    <div className={`text-[8px] uppercase flex items-center gap-1 ${
                      isNewspaper ? 'text-text-dim font-bold' : 'text-text-dim/60'
                    }`}>
                      <GitFork size={10} />
                      Causal Consequence
                    </div>
                    <div className="flex items-center gap-1.5 text-text-main font-bold">
                      <span>{event.title}</span>
                      <ArrowDown size={12} className={isNewspaper ? 'text-primary-base' : 'text-accent-base animate-pulse'} />
                    </div>
                    <p className={`text-[10px] leading-normal italic ${
                      isNewspaper ? 'text-primary-base/80 font-serif' : 'text-text-dim font-sans'
                    }`}>
                      {event.impact}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
