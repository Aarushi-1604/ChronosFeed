'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Check, RefreshCw } from 'lucide-react';

interface SimulationStatusProps {
  prompt: string;
  onComplete: () => void;
}

interface Step {
  id: number;
  label: string;
  subtext: string;
  status: 'pending' | 'running' | 'done';
}

export default function SimulationStatus({ prompt, onComplete }: SimulationStatusProps) {
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, label: 'Setting Lead-Type Anchors', subtext: 'Calibrating chronological print lines...', status: 'pending' },
    { id: 2, label: 'Etching Socio-Economic Woodblocks', subtext: 'Constructing industrial yields and trade scales...', status: 'pending' },
    { id: 3, label: 'Typesetting Alternate Historical Events', subtext: 'Structuring causal chronologies and dates...', status: 'pending' },
    { id: 4, label: 'Casting Public Personas & Voices', subtext: 'Modeling profiles and specific public actors...', status: 'pending' },
    { id: 5, label: 'Inking the Alternate Social Web', subtext: 'Formulating news dispatches and timeline posts...', status: 'pending' },
  ]);

  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState({
    inkDensity: '0.00',
    stability: '100%',
    population: '0.0M',
    factions: '0',
  });

  // Log simulation updates sequentially in telegram-ticker style
  useEffect(() => {
    const messages = [
      `PROMPT REGISTERED: "${prompt.slice(0, 45)}${prompt.length > 45 ? '...' : ''}"`,
      'ALLOCATING: 64TB temporal cylinder buffer...',
      'INJECTING: Babbage steam-engine compiling matrices...',
      'TYPESETTING: Weaving causal chronology branches...',
      'ENGRAVING: Drawing vector cartography maps...',
      'CASTING: Shaping persona speech templates...',
      'PRINTING: Running press rolls at 400 dispatches/sec...',
      'STATUS: Alternate reality coordinates locked.',
    ];

    let currentMsgIdx = 0;
    setLogs([messages[0]]);
    currentMsgIdx = 1;

    const logInterval = setInterval(() => {
      if (currentMsgIdx < messages.length) {
        const nextMsg = messages[currentMsgIdx];
        setLogs((prev) => [...prev, nextMsg].slice(-4));
        currentMsgIdx++;
      }
    }, 700);

    return () => clearInterval(logInterval);
  }, [prompt]);

  // Update compiler stats based on active step to prevent jittery 40ms updates
  useEffect(() => {
    const statsPerStep = [
      { inkDensity: '0.00', stability: '100%', population: '0.0M', factions: '0' }, // Init
      { inkDensity: '0.22', stability: '92%', population: '85.4M', factions: '1' },  // Step 1
      { inkDensity: '0.45', stability: '84%', population: '192.1M', factions: '2' }, // Step 2
      { inkDensity: '0.62', stability: '75%', population: '340.5M', factions: '3' }, // Step 3
      { inkDensity: '0.74', stability: '68%', population: '425.0M', factions: '4' }, // Step 4
      { inkDensity: '0.77', stability: '64%', population: '494.0M', factions: '5' }, // Step 5 / Ready
    ];
    const currentStats = statsPerStep[Math.min(activeStepIdx, statsPerStep.length - 1)];
    setStats(currentStats);
  }, [activeStepIdx]);

  // Main simulation lifecycle
  useEffect(() => {
    if (activeStepIdx >= steps.length) {
      setTimeout(() => {
        onComplete();
      }, 800);
      return;
    }

    // Mark current step as running
    setSteps((prev) =>
      prev.map((step, idx) =>
        idx === activeStepIdx
          ? { ...step, status: 'running' }
          : step
      )
    );

    // Simulate progress bar count-up
    const stepDuration = 1200; // 1.2s per step
    const intervalTime = 40;
    const increment = 100 / (stepDuration / intervalTime);

    let currentStepProgress = 0;
    const progressTimer = setInterval(() => {
      currentStepProgress += increment;
      setProgress((prev) => Math.min(Math.round(activeStepIdx * 20 + currentStepProgress * 0.2), 100));
    }, intervalTime);

    // Transition to next step
    const stepTimer = setTimeout(() => {
      clearInterval(progressTimer);
      setSteps((prev) =>
        prev.map((step, idx) =>
          idx === activeStepIdx
            ? { ...step, status: 'done' }
            : step
        )
      );
      setActiveStepIdx((prev) => prev + 1);
    }, stepDuration);

    return () => {
      clearTimeout(stepTimer);
      clearInterval(progressTimer);
    };
  }, [activeStepIdx, steps.length, onComplete]);

  return (
    <div className="fixed inset-0 bg-background z-50 flex items-center justify-center p-4">
      {/* Tiny aged print overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:4px_4px]" />

      <div className="max-w-xl w-full border-8 border-double border-primary-base bg-background p-8 rounded-none flex flex-col gap-6 relative overflow-hidden text-primary-base font-serif shadow-xl">
        {/* Masthead Header */}
        <div className="flex items-center justify-between border-b-2 border-primary-base pb-3">
          <div className="flex items-center gap-2 text-primary-base font-serif text-sm font-black uppercase tracking-wider">
            <Settings size={16} className="animate-spin" style={{ animationDuration: '4s' }} />
            The Divergence Press
          </div>
          <div className="text-text-dim font-serif text-xs font-bold tracking-widest uppercase">
            Compiling Dispatch...
          </div>
        </div>

        {/* Printing Press Clockwork Spinner */}
        <div className="flex justify-center py-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 opacity-80 text-primary-base flex items-center justify-center"
          >
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 7" />
              <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1.5" />
              <path d="M50,8 L50,92 M8,50 L92,50 M20,20 L80,80 M20,80 L80,20" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="6" fill="currentColor" />
            </svg>
          </motion.div>
        </div>

        {/* Console Grid for Stats */}
        <div className="grid grid-cols-4 gap-2 text-center border-y-2 border-double border-primary-base/30 py-3 font-serif">
          <div>
            <div className="text-[9px] text-text-dim font-bold uppercase">Ink density</div>
            <div className="text-sm font-black text-primary-base">{stats.inkDensity}</div>
          </div>
          <div>
            <div className="text-[9px] text-text-dim font-bold uppercase">Stability</div>
            <div className="text-sm font-black text-primary-base">{stats.stability}</div>
          </div>
          <div>
            <div className="text-[9px] text-text-dim font-bold uppercase">Pop. Scale</div>
            <div className="text-sm font-black text-primary-base">{stats.population}</div>
          </div>
          <div>
            <div className="text-[9px] text-text-dim font-bold uppercase">Factions</div>
            <div className="text-sm font-black text-primary-base">{stats.factions}</div>
          </div>
        </div>

        {/* Progress Ink Bar */}
        <div className="flex flex-col gap-2">
          <div className="w-full bg-primary-base/10 border border-primary-base/30 rounded-none h-4 p-[2px]">
            <motion.div
              className="h-full bg-primary-base"
              style={{ width: `${progress}%` }}
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between font-serif text-[10px] text-text-dim font-bold uppercase">
            <span>PRESS PROGRESS: {progress}%</span>
            <span>TYPESETTING ARCHIVES...</span>
          </div>
        </div>

        {/* Typeset Checklist */}
        <div className="flex flex-col gap-2 my-1 font-serif">
          {steps.map((step) => {
            const isPending = step.status === 'pending';
            const isRunning = step.status === 'running';
            const isDone = step.status === 'done';

            return (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-2 border transition-all duration-300 ${
                  isRunning ? 'border-primary-base/20 bg-black/[0.01]' : 'border-transparent'
                }`}
              >
                <div className="mt-0.5 text-xs font-bold flex-shrink-0 w-5 text-center">
                  {isDone && <Check size={14} className="text-primary-base mx-auto" />}
                  {isRunning && <RefreshCw size={12} className="animate-spin text-primary-base mx-auto" />}
                  {isPending && <span className="text-primary-base/30">[ ]</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-xs font-black uppercase ${isRunning ? 'text-primary-base' : isDone ? 'text-primary-base/80' : 'text-primary-base/40'}`}>
                    {step.label}
                  </div>
                  <div className={`text-[10px] italic leading-normal ${isRunning ? 'text-primary-base/90' : isDone ? 'text-primary-base/60' : 'text-primary-base/30'}`}>
                    {step.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Compositor Ticker logs */}
        <div className="bg-black/[0.015] border border-primary-base/10 rounded-none p-3.5 font-mono text-[9px] text-primary-base/80 min-h-[90px] flex flex-col gap-1 justify-end overflow-hidden">
          <AnimatePresence>
            {logs.map((log, index) => (
              <motion.div
                key={index + '-' + log.slice(0, 6)}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="truncate uppercase tracking-tight"
              >
                &gt;&gt; {log}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
