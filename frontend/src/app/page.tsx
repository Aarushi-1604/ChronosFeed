'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Globe, Compass, Anchor, Waves, Zap } from 'lucide-react';
import ChronosLogo from '../components/branding/chronos-logo';
import CanvasGrid from '../components/ui/canvas-grid';
import SimulationStatus from '../components/ui/simulation-status';
import WorldCard from '../components/cards/world-card';
import { World } from '../types';
import { api } from '../lib/api';
import { useWorldStatus } from '../hooks/useWorldStatus';
import { useTheme } from '../context/theme-context';

type RealityMode = 'anchored' | 'ripple' | 'chaos';

const EXAMPLE_PROMPTS = [
  'What if the internet was invented in 1890?',
  'What if Rome never fell?',
  'What if humanity colonized Mars in 1900?',
  'What if Narendra Modi was the president of China and Trump was president of India?',
  'What if Tanjiro became the King of Jaipur in 2026?',
  'What if Tesla won the War of Currents against Edison?',
  'What if the Library of Alexandria was never burned?',
  'What if Julius Caesar survived the Ides of March?',
];

const REALITY_MODES: { id: RealityMode; label: string; sublabel: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'anchored',
    label: 'Reality Anchored',
    sublabel: 'Strict Mode',
    icon: <Anchor size={14} />,
    description: 'Only the divergence changes. All other world leaders, nations, and institutions remain exactly as in reality.',
  },
  {
    id: 'ripple',
    label: 'Ripple Mode',
    sublabel: 'Butterfly Effect',
    icon: <Waves size={14} />,
    description: 'The divergence creates cascading consequences that logically affect related real-world entities and alliances.',
  },
  {
    id: 'chaos',
    label: 'Chaos Mode',
    sublabel: 'Maximum Divergence',
    icon: <Zap size={14} />,
    description: 'Unpredictable butterfly effects cascade across the entire world. Maximum creative freedom and disruption.',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [prompt, setPrompt] = useState('');
  const [realityMode, setRealityMode] = useState<RealityMode>('anchored');
  const [formattedDate, setFormattedDate] = useState('');
  const [compilationError, setCompilationError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorldId, setGeneratedWorldId] = useState<string | null>(null);
  const [worlds, setWorlds] = useState<World[]>([]);
  const [isLoadingWorlds, setIsLoadingWorlds] = useState(true);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  // Populate formatted date only on client to prevent SSR hydration mismatch
  useEffect(() => {
    setFormattedDate(new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  // Poll status of the compiled world
  const { status: worldStatus } = useWorldStatus(
    generatedWorldId && generatedWorldId !== 'stub-world-id' ? generatedWorldId : null
  );

  const effectiveStatus = generatedWorldId === 'stub-world-id' ? 'ready' : worldStatus;

  // Handle navigation once both animation and backend generation are ready
  useEffect(() => {
    if (isAnimationComplete && effectiveStatus === 'ready' && generatedWorldId) {
      router.push(`/world/${generatedWorldId}?compiled=true`);
    } else if (effectiveStatus === 'error') {
      setIsGenerating(false);
      setIsAnimationComplete(false);
      setGeneratedWorldId(null);
      setCompilationError('The Babbage Engine encountered a fault during compilation. Check your API key or try a different divergence anchor.');
    }
  }, [isAnimationComplete, effectiveStatus, generatedWorldId, router]);

  // Load live worlds from backend or fallback to stub seeds
  useEffect(() => {
    async function loadWorlds() {
      try {
        const fetched = await api.getWorlds();
        if (fetched && fetched.length > 0) {
          const readyWorlds = fetched.filter((w) => w.status === 'ready');
          setWorlds(readyWorlds.length > 0 ? readyWorlds : getFallbackWorlds());
        } else {
          setWorlds(getFallbackWorlds());
        }
      } catch (err) {
        console.warn('Backend worlds query failed, using seeded worlds:', err);
        setWorlds(getFallbackWorlds());
      } finally {
        setIsLoadingWorlds(false);
      }
    }
    loadWorlds();
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setCompilationError(null);
    setIsGenerating(true);
    setIsAnimationComplete(false);
    setGeneratedWorldId(null);

    // Prepend mode prefix to the prompt
    const fullPrompt = `[Mode: ${realityMode}] ${prompt.trim()}`;

    try {
      const result = await api.createWorld(fullPrompt);
      setGeneratedWorldId(result.worldId);
    } catch (err) {
      console.error('Error generating world, falling back to stub-world-id:', err);
      setGeneratedWorldId('stub-world-id');
    }
  };

  const handlePromptClick = (p: string) => {
    setPrompt(p);
  };

  const handleSimulationComplete = () => {
    setIsAnimationComplete(true);
  };

  const getFallbackWorlds = (): World[] => [
    {
      id: 'stub-world-id',
      prompt: 'What if the internet was invented in 1890?',
      name: 'The Victorian Web',
      summary: 'In 1890, Charles Babbage completed the Analytical Engine, leading to a primitive steam-powered global network connecting major British colonies. The Empire\'s telegraph corps was repurposed overnight, as Reuters dispatches began flowing through electromechanical relays across three continents.',
      era: 'Victorian Cyberpunk',
      tech_level: 'Mechanical steam computation, punch-card routers',
      gov_type: 'Corporatist Monarchy',
      status: 'ready',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'roman-world-id',
      prompt: 'What if Rome never fell?',
      name: 'Imperium Nova',
      summary: 'The Roman Empire survives into the modern era, merging ancient senatorial systems with geothermal grids and steam-powered legions. The Senate still convenes in the Curia Julia, now broadcasting imperial decrees via the Aetherwire — the world\'s only legal telecommunications grid.',
      era: 'Roman Cyberpunk',
      tech_level: 'Geothermal combustion, senatorial lattices',
      gov_type: 'Senatorial Republic',
      status: 'ready',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'mars-world-id',
      prompt: 'What if humanity colonized Mars in 1900?',
      name: 'The Rusty Mars Empire',
      summary: 'Victorian steamships equipped with atmospheric coal sails colonized the red sands of Mars in 1900, creating a feudal station network ruled by copper baronies. The British Crown and German Kaiser both claim sovereignty over Olympus Mons, as reported by The Martian Gazette.',
      era: 'Steampunk Space Era',
      tech_level: 'Coal-sails space flight, pressurized biodomes',
      gov_type: 'Industrial Feudalism',
      status: 'ready',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const selectedMode = REALITY_MODES.find(m => m.id === realityMode)!;

  return (
    <main className="md:h-screen min-h-screen md:overflow-y-auto overflow-x-hidden relative flex flex-col p-4 md:p-8 select-none border-8 border-double border-primary-base bg-background text-primary-base font-serif">
      {/* Dynamic particles and grid background */}
      <CanvasGrid />

      {/* Cinematic printing press loader overlay */}
      <AnimatePresence>
        {isGenerating && (
          <SimulationStatus prompt={prompt} onComplete={handleSimulationComplete} />
        )}
      </AnimatePresence>

      {/* Header Log */}
      <header className="w-full max-w-7xl mx-auto flex flex-col items-center border-b-4 border-double border-primary-base pb-3.5 mb-8 z-10 text-primary-base font-serif">
        <div className="relative flex justify-between w-full text-[10px] uppercase tracking-widest border-b border-primary-base/20 pb-2 mb-3 items-center font-bold">
          <span>REALITY SIMULATION CONSOLE</span>
          <span className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">VOLUME CCLXVIII // NO. 45090</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              suppressHydrationWarning
              className="border border-primary-base px-2.5 py-0.5 font-serif text-[9px] tracking-wider font-bold uppercase hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer flex items-center gap-1"
            >
              {theme === 'newspaper' ? '☾ Dark Press' : '☼ Light Press'}
            </button>
            <span>PRICE: FREE PRESS</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between w-full py-1">
          <div className="hidden md:block w-24 h-[1px] bg-primary-base/30" />
          <div className="flex flex-col items-center">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight font-serif text-center leading-none text-primary-base flex items-center gap-3">
              <ChronosLogo size={46} className="text-primary-base" />
              CHRONOS REALITY PRESS
            </h1>
            <p className="text-[10px] tracking-[0.22em] uppercase mt-2.5 text-center text-text-dim font-bold italic">
              Dispatches from Divergent Timelines — Where History Chose Differently
            </p>
          </div>
          <div className="hidden md:block w-24 h-[1px] bg-primary-base/30" />
        </div>
        <div className="relative flex justify-between w-full text-[10px] uppercase tracking-widest border-t border-primary-base/20 pt-2.5 mt-3 font-bold items-center">
          <span>PORTAL KEY: CF-9901</span>
          <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 flex gap-2.5">
            <button
              onClick={() => router.push('/guide')}
              suppressHydrationWarning
              className="border border-primary-base px-3 py-1 font-serif text-[10px] tracking-wider font-bold uppercase hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer"
            >
              How to Use
            </button>
            <button
              onClick={() => router.push('/developers')}
              suppressHydrationWarning
              className="border border-primary-base px-3 py-1 font-serif text-[10px] tracking-wider font-bold uppercase hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer"
            >
              Developer Portal
            </button>
          </div>
          <span suppressHydrationWarning>{formattedDate}</span>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-16 justify-center z-10">
        
        {/* Prompt Console (Hero Section) */}
        <section className="flex flex-col items-center text-center max-w-3xl mx-auto gap-8 pt-8">
          <div className="flex flex-col gap-3">
            <span className="font-serif text-xs uppercase tracking-widest text-text-dim flex items-center justify-center gap-2 font-bold">
              <Compass size={14} className="animate-spin text-primary-base" style={{ animationDuration: '16s' }} />
              Alternate History Compositor
            </span>
            <h1 className="text-4xl md:text-6xl font-black font-serif tracking-tight leading-[1.15] text-primary-base uppercase">
              WHAT IF HISTORY WAS A{' '}
              <span className="border-b-4 border-double border-primary-base pb-1">
                LIVING DISPATCH?
              </span>
            </h1>
            <p className="text-sm md:text-base text-text-dim max-w-xl mx-auto mt-4 leading-relaxed font-serif italic">
              &ldquo;The Babbage engines stand ready. Propose your divergence and witness reality reshape itself — post by post, person by person, institution by institution.&rdquo;
            </p>
          </div>

          {/* ── REALITY MODE SELECTOR ── */}
          <div className="w-full max-w-2xl flex flex-col gap-2">
            <span className="font-serif text-[10px] text-text-dim uppercase tracking-widest font-bold text-left border-b border-primary-base/20 pb-1.5">
              ◈ Select Reality Simulation Mode
            </span>
            <div className="grid grid-cols-3 gap-0 border-2 border-primary-base/40 font-serif">
              {REALITY_MODES.map((mode, idx) => (
                <button
                  key={mode.id}
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setRealityMode(mode.id)}
                  className={`
                    relative flex flex-col items-center gap-1 px-3 py-3 text-center transition-all duration-200 cursor-pointer
                    ${idx < 2 ? 'border-r border-primary-base/30' : ''}
                    ${realityMode === mode.id
                      ? 'bg-primary-base text-[var(--bg-color)]'
                      : 'bg-transparent text-text-dim hover:bg-primary-base/10 hover:text-primary-base'
                    }
                  `}
                >
                  <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold">
                    {mode.icon}
                    {mode.label}
                  </span>
                  <span className={`text-[8px] uppercase tracking-wider opacity-70 ${realityMode === mode.id ? 'text-[var(--bg-color)]' : 'text-text-dim'}`}>
                    {mode.sublabel}
                  </span>
                </button>
              ))}
            </div>
            {/* Mode description */}
            <motion.div
              key={realityMode}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="border border-dashed border-primary-base/30 px-4 py-2 text-[10px] font-serif text-text-dim italic leading-relaxed text-left"
            >
              <span className="font-bold not-italic text-primary-base uppercase tracking-wider">{selectedMode.label}:</span>{' '}
              {selectedMode.description}
            </motion.div>
          </div>

          {/* Compilation Error Banner */}
          {compilationError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="w-full max-w-2xl border-2 border-dashed border-red-500/60 bg-red-500/5 px-5 py-3 font-serif text-left"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-red-500">⚠ ENGINE FAULT — TRANSMISSION INTERRUPTED</span>
                  <span className="text-[11px] text-text-dim leading-relaxed">{compilationError}</span>
                </div>
                <button
                  type="button"
                  suppressHydrationWarning
                  onClick={() => setCompilationError(null)}
                  className="text-[9px] uppercase tracking-wider font-bold text-text-dim hover:text-primary-base border border-primary-base/30 px-2 py-1 shrink-0 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}

          {/* Large Console Prompt Input */}
          <form onSubmit={handleGenerate} className="w-full border-4 border-double border-primary-base p-2 bg-transparent max-w-2xl flex items-center gap-2 rounded-none shadow-sm hover:shadow-md transition-shadow duration-300">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. What if Narendra Modi was President of China?"
              suppressHydrationWarning
              className="flex-1 bg-transparent border-none focus:outline-none p-3 font-serif text-base text-primary-base placeholder-primary-base/40 ml-2"
            />
            <button
              type="submit"
              suppressHydrationWarning
              disabled={!prompt.trim()}
              className="border-2 border-primary-base px-6 py-3 font-serif text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 rounded-none"
            >
              <Sparkles size={14} className="text-primary-base group-hover:text-[var(--bg-color)]" />
              <span>Compile Reality</span>
            </button>
          </form>

          {/* Quick Seed Prompts */}
          <div className="flex flex-col items-center gap-3">
            <span className="font-serif text-[10px] text-text-dim uppercase tracking-widest font-bold">
              Select Divergence Seed
            </span>
            <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl">
              {EXAMPLE_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  suppressHydrationWarning
                  onClick={() => handlePromptClick(p)}
                  className="px-4 py-2 border border-primary-base/30 text-text-dim hover:border-primary-base hover:text-primary-base hover:bg-black/[0.015] font-serif text-xs cursor-pointer transition-all duration-300 rounded-none"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Live generated Worlds Gallery */}
        <section className="flex flex-col gap-6 pt-8 pb-16">
          <div className="flex items-center justify-between border-b-2 border-primary-base/20 pb-3.5">
            <div className="flex items-center gap-2.5">
              <Globe size={18} className="text-primary-base" />
              <h2 className="text-xl font-bold font-serif text-primary-base uppercase tracking-tight">
                Compiled Alternate Realities
              </h2>
            </div>
            <span className="font-serif text-[10px] text-text-dim font-bold">
              ARCHIVE INDEX: {worlds.length} SYSTEM{worlds.length !== 1 && 'S'}
            </span>
          </div>

          {isLoadingWorlds ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="border border-primary-base/20 p-6 rounded-none bg-black/[0.005] h-[300px] flex flex-col justify-between animate-pulse">
                  <div className="flex flex-col gap-3">
                    <div className="w-16 h-3 bg-primary-base/10" />
                    <div className="w-48 h-6 bg-primary-base/15" />
                    <div className="w-full h-12 bg-primary-base/10" />
                  </div>
                  <div className="w-full h-8 bg-primary-base/10" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {worlds.map((world) => (
                <WorldCard key={world.id} world={world} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Newspaper Footer */}
      <footer className="w-full max-w-7xl mx-auto border-t-2 border-double border-primary-base/20 mt-8 pt-3.5 pb-1 text-center text-[9px] tracking-[0.22em] font-serif text-text-dim uppercase font-bold z-10">
        AI CLUB | SIT PUNE | AARUSHI | ADITYA | YESHWANT | v1.2.0 | 2026
      </footer>
    </main>
  );
}
