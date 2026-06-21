'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertOctagon, ShieldCheck, ShieldAlert, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/theme-context';

interface RealityScoreProps {
  score: number; // 0 to 100
}

export default function RealityScore({ score }: RealityScoreProps) {
  const { theme } = useTheme();
  const isNewspaper = theme.startsWith('newspaper');

  // Determine state labels and styling based on stability score
  const getStatusDetails = (val: number) => {
    if (val >= 90) {
      return {
        label: 'Golden Age',
        color: isNewspaper ? 'text-primary-base' : 'text-emerald-400',
        borderColor: isNewspaper ? 'border-primary-base/20' : 'border-emerald-500/30',
        glowColor: isNewspaper ? 'rgba(0,0,0,0)' : 'rgba(16, 185, 129, 0.4)',
        icon: <Sparkles className={isNewspaper ? 'text-primary-base' : 'text-emerald-400'} size={18} />,
        bgGlow: isNewspaper ? 'bg-[var(--card-bg)]' : 'bg-emerald-500/5',
        desc: 'Civilization is at its zenith. Innovation and harmony flourish.',
      };
    } else if (val >= 70) {
      return {
        label: 'Stable Era',
        color: isNewspaper ? 'text-primary-base' : 'text-blue-400',
        borderColor: isNewspaper ? 'border-primary-base/20' : 'border-blue-500/30',
        glowColor: isNewspaper ? 'rgba(0,0,0,0)' : 'rgba(59, 130, 246, 0.4)',
        icon: <ShieldCheck className={isNewspaper ? 'text-primary-base' : 'text-blue-400'} size={18} />,
        bgGlow: isNewspaper ? 'bg-[var(--card-bg)]' : 'bg-blue-500/5',
        desc: 'Social structures hold. Minor progress-fluctuations reported.',
      };
    } else if (val >= 45) {
      return {
        label: 'Volatile State',
        color: isNewspaper ? 'text-primary-base' : 'text-amber-400',
        borderColor: isNewspaper ? 'border-primary-base/20' : 'border-amber-500/30',
        glowColor: isNewspaper ? 'rgba(0,0,0,0)' : 'rgba(245, 158, 11, 0.4)',
        icon: <ShieldAlert className={isNewspaper ? 'text-primary-base' : 'text-amber-400'} size={18} />,
        bgGlow: isNewspaper ? 'bg-[var(--card-bg)]' : 'bg-amber-500/5',
        desc: 'Civil unrest and rising ideological factions. Stability is vulnerable.',
      };
    } else if (val >= 20) {
      return {
        label: 'Revolutionary Crisis',
        color: isNewspaper ? 'text-primary-base' : 'text-orange-500',
        borderColor: isNewspaper ? 'border-primary-base/20' : 'border-orange-500/30',
        glowColor: isNewspaper ? 'rgba(0,0,0,0)' : 'rgba(249, 115, 22, 0.5)',
        icon: <AlertOctagon className={isNewspaper ? 'text-primary-base' : 'text-orange-400'} size={18} />,
        bgGlow: isNewspaper ? 'bg-[var(--card-bg)]' : 'bg-orange-500/5',
        desc: 'Active regime struggle. Core societal infrastructures are fracturing.',
      };
    } else {
      return {
        label: 'Collapse Imminent',
        color: isNewspaper ? 'text-primary-base animate-pulse' : 'text-red-500 animate-pulse',
        borderColor: isNewspaper ? 'border-primary-base/40 border-dashed' : 'border-red-500/50 border-dashed',
        glowColor: isNewspaper ? 'rgba(0,0,0,0)' : 'rgba(239, 68, 68, 0.7)',
        icon: <AlertOctagon className={isNewspaper ? 'text-primary-base animate-bounce' : 'text-red-500 animate-bounce'} size={18} />,
        bgGlow: isNewspaper ? 'bg-[var(--card-bg)] animate-pulse' : 'bg-red-500/10 animate-pulse',
        desc: 'Societal systems collapsed. Alternate reality matrix facing tear-down.',
      };
    }
  };

  const details = getStatusDetails(score);

  // Map 0-100 score to degree rotation (-90deg to +90deg) for the dial
  const rotation = -90 + (score / 100) * 180;

  return (
    <div
      className={
        isNewspaper
          ? `border border-primary-base/20 p-5 rounded-none flex flex-col gap-4 relative overflow-hidden bg-black/[0.005] shadow-sm hover:shadow-md transition-all duration-500 ${details.borderColor}`
          : `glass-panel p-5 rounded-xl border flex flex-col gap-4 relative overflow-hidden transition-all duration-500 ${details.borderColor}`
      }
      style={
        isNewspaper
          ? undefined
          : {
              boxShadow: `0 0 20px 0 ${details.glowColor}`,
            }
      }
    >
      {/* Background soft pulse */}
      <div className={`absolute inset-0 -z-10 ${details.bgGlow}`} />

      <div className="flex items-center justify-between">
        <h3 className={`uppercase tracking-wider ${
          isNewspaper ? 'font-serif text-xs text-primary-base font-bold' : 'font-mono text-xs text-text-dim'
        }`}>Reality Stability Gauge</h3>
        <div className={`flex items-center gap-1.5 ${
          isNewspaper ? 'font-serif text-[11px]' : 'font-mono text-[11px]'
        }`}>
          {details.icon}
          <span className={`font-bold ${details.color}`}>{details.label}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Steampunk / Cyberpunk Gauge Dial */}
        {isNewspaper ? (
          <div className="relative w-24 h-24 flex items-center justify-center select-none shrink-0 border-2 border-primary-base/20 rounded-full p-1 bg-black/[0.003]">
            {/* Victorian Circular Dial Face */}
            <svg className="w-full h-full text-primary-base" viewBox="0 0 100 100">
              {/* Outer dial ring */}
              <circle cx="50" cy="50" r="47" fill="none" stroke="currentColor" strokeWidth="1.2" className="opacity-40" />
              <circle cx="50" cy="50" r="43" fill="none" stroke="currentColor" strokeWidth="0.5" className="opacity-25" />
              
              {/* Dial markings ticks */}
              {[135, 168.75, 202.5, 236.25, 270, 303.75, 337.5, 371.25, 405].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const isMajor = i % 2 === 0;
                const length = isMajor ? 6 : 3;
                const x1 = 50 + Math.cos(rad) * (42 - length);
                const y1 = 50 + Math.sin(rad) * (42 - length);
                const x2 = 50 + Math.cos(rad) * 42;
                const y2 = 50 + Math.sin(rad) * 42;
                return (
                  <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth={isMajor ? 1 : 0.6} className="opacity-40" />
                );
              })}

              {/* Serif Numbers */}
              <text x="23" y="77" fontSize="7" fontFamily="serif" textAnchor="middle" className="fill-current opacity-70 font-black">0</text>
              <text x="17" y="49" fontSize="7" fontFamily="serif" textAnchor="middle" className="fill-current opacity-70 font-black">25</text>
              <text x="50" y="19" fontSize="7" fontFamily="serif" textAnchor="middle" className="fill-current opacity-70 font-black">50</text>
              <text x="83" y="49" fontSize="7" fontFamily="serif" textAnchor="middle" className="fill-current opacity-70 font-black">75</text>
              <text x="77" y="77" fontSize="7" fontFamily="serif" textAnchor="middle" className="fill-current opacity-70 font-black">100</text>

              {/* Gauge label text */}
              <text x="50" y="66" fontSize="4.5" fontFamily="serif" textAnchor="middle" className="fill-current opacity-35 font-bold tracking-widest uppercase">TEMPORAL</text>
              <text x="50" y="72" fontSize="4.5" fontFamily="serif" textAnchor="middle" className="fill-current opacity-35 italic font-bold">pressure</text>

              {/* Center pivot pin */}
              <circle cx="50" cy="50" r="3.5" className="fill-current text-primary-base" />
              <circle cx="50" cy="50" r="1.5" fill="var(--bg-color)" />
            </svg>

            {/* Steampunk Vibrating Needle */}
            <motion.div
              className="absolute w-[2px] bg-primary-base origin-bottom z-10"
              style={{
                height: '35px',
                bottom: '50%',
                left: 'calc(50% - 1px)',
              }}
              animate={{ 
                // dial ranges from -135deg (0 score) to +135deg (100 score)
                rotate: [
                  -135 + (score / 100) * 270 - 0.75,
                  -135 + (score / 100) * 270 + 0.75,
                  -135 + (score / 100) * 270
                ]
              }}
              transition={{
                rotate: {
                  repeat: Infinity,
                  repeatType: 'mirror',
                  duration: 0.15,
                  ease: 'easeInOut',
                }
              }}
            />
          </div>
        ) : (
          <div className="relative w-28 h-16 flex items-end justify-center select-none overflow-hidden shrink-0">
            {/* Arc Background */}
            <div className="absolute inset-0 w-28 h-28 border-[10px] rounded-full border-white/5" />

            {/* Color Arc Indicator (clipped to half circle) */}
            <svg className="absolute top-0 left-0 w-28 h-28 transform -rotate-180" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeDasharray="125 250"
                className={`${details.color} opacity-40`}
              />
            </svg>

            {/* Center Point */}
            <div className="absolute bottom-0 w-4 h-4 rounded-full z-20 border bg-text-main border-white/20" />

            {/* Needle Arrow */}
            <motion.div
              className="absolute bottom-0 w-1 z-10 origin-bottom bg-gradient-to-t from-text-main to-accent-base"
              style={{
                height: '42px',
                x: '-50%',
              }}
              initial={{ rotate: -90 }}
              animate={{ rotate: rotation }}
              transition={{
                type: 'spring',
                stiffness: 80,
                damping: 12,
              }}
            />
          </div>
        )}

        {/* Stability Percentage Output */}
        <div className="flex-1">
          <div className="flex items-baseline gap-1">
            <motion.span
              className={`text-4xl font-extrabold tracking-tighter ${
                isNewspaper ? 'font-serif text-primary-base font-black' : `font-mono ${details.color}`
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {score}
            </motion.span>
            <span className={`text-sm ${isNewspaper ? 'font-serif text-primary-base/60' : 'font-mono text-text-dim'}`}>/100</span>
          </div>
          <p className={`text-[11px] mt-1 leading-normal ${
            isNewspaper ? 'font-serif text-text-dim' : 'font-sans text-text-dim'
          }`}>{details.desc}</p>
        </div>
      </div>
    </div>
  );
}
