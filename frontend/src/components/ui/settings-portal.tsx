'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, Volume2, VolumeX, Type, LayoutGrid, Check, Moon, Sun, ArrowUpRight, Coins,
  X, Activity, GitFork, Map, Compass, BookOpen, UserCheck 
} from 'lucide-react';
import { useTheme, ThemeName } from '../../context/theme-context';
import { getAudioEngine } from '../../lib/audio-engine';
import { api } from '../../lib/api';

const segmentData = {
  stability: {
    title: 'Reality Stability Gauge',
    subtitle: 'Causal Pressure & Coherence Diagnostics',
    icon: Activity,
    desc: 'A high-precision chronometric dial monitoring the overall structural integrity of the loaded alternate timeline. It measures temporal fluctuations and causal divergence rates in real-time.',
    tells: 'Displays the causal pressure, dimensional variance, and baseline narrative consistency of the timeline on a standardized 0–100 index.',
    means: 'A high score (70–100) reflects a timeline that adheres closely to calculated divergence vectors. A low score (under 40) signals that reality is warping, causing historical leakage, temporal loops, and paradoxes to bleed into public dispatches.',
    importance: 'Crucial for determining the behavioral volatility of the simulation. When stability drops, advertisements for non-existent or impossible products (e.g., chronos-stabilizers or loop-insurance) will appear, and comments from citizens will grow increasingly confused and erratic.',
    needed: 'Without continuous monitoring of reality stability, the operator cannot detect incoming timeline collapses or causality reboots, which would lead to complete loss of simulated data.'
  },
  chronology: {
    title: 'Chronology Branch',
    subtitle: 'Timeline Bifurcation & Milestone Tracker',
    icon: GitFork,
    desc: 'A vertical timeline listing the key historical nodes and divergence points that led to the creation of this alternate reality.',
    tells: 'Displays the exact years, historical milestones, and causal pivots (e.g., policy changes, election results, or mechanical innovations) that diverted this reality from the Prime Timeline.',
    means: 'Each node is a temporal milestone representing a permanent redirection of historical events. Reading these nodes reveals the exact chain of causality that built the current alternate world.',
    importance: 'Provides the historical skeleton of the simulation. It connects the macro-indicators (telemetry) to their historical causes, allowing the operator to trace exactly why the present looks different.',
    needed: 'Essential for diagnostic navigation. Without the Chronology Branch, the operator is blind to the history of the world they are observing, making it impossible to identify the root cause of timeline anomalies.'
  },
  plotting: {
    title: 'Temporal Plotting Map',
    subtitle: 'Causality Vectors & Spatial Mapping',
    icon: Map,
    desc: 'An interactive geographical plotter mapping localized density fields of chronological pressure and geopolitical changes.',
    tells: 'Shows exact geographic coordinates, density vectors, and narrative friction regions where the alternate history is actively reshaping borders and human settlements.',
    means: 'Indicates the spatial hubs where chronological energy is highest. The denser the plotting lines in a region, the more news articles and social dispatches will be generated from that physical location.',
    importance: 'Enables spatial analysis of alternate geopolitical trends. It tracks how a single local policy change or battle ripples across neighboring nations, visually rendering the physical borders of alternate empires.',
    needed: 'Causality does not affect the globe uniformly; it aggregates in major centers. The Plotter Map is necessary to pinpoint where chronological dampeners should be deployed to prevent regional collapse.'
  },
  telemetry: {
    title: 'Civilization Telemetry',
    subtitle: 'Societal & Institutional Macro-Diagnostics',
    icon: Compass,
    desc: 'A system-level telemetry board displaying the macro-organization indicators of the alternate civilization, such as technology, governance, and economics.',
    tells: 'Decodes and displays three primary institutional matrices: the governing regime (e.g., Parliamentary Democracy), the technology tier (e.g., Steam Computation), and the prevailing economic model.',
    means: 'Indicates how the population has structurally adapted to the divergence. It determines the underlying rules of the simulation, influencing what kind of institutions, services, and laws exist in the alternate world.',
    importance: 'Sets the stylistic and thematic boundaries of the timeline feed. A higher technology tier introduces distinct terms (analytical engines, clockwork automata) into dispatches, while governance types change the tone of state-backed news.',
    needed: 'Required for quick categorization. Rather than reading thousands of individual posts to understand the society, the operator gets an instant, high-level structural breakdown of the civilization.'
  },
  feed: {
    title: 'Timeline Feed & News',
    subtitle: 'Social, Editorial, & Commercial Observations',
    icon: BookOpen,
    desc: 'A unified stream of personal citizen logs, professional editorial reports, and target corporate marketing materials reflecting daily life in the timeline.',
    tells: 'Combines raw citizen dispatches (social posts), verified journalistic publications (news articles), and contextual advertisements (consequences ads) into a single chronological stream.',
    means: 'Exposes the direct cultural, political, and economic thoughts of the simulated populace. It shows how macro-historical events are discussed, rationalized, or ignored by average people.',
    importance: 'Serves as the narrative verification layer. While other panels display metrics, maps, and nodes, the feed is where the actual consequence of those metrics is observed in the voices of the citizens.',
    needed: 'Metrics without narrative are meaningless. To truly understand an alternate reality, one must observe how its citizens live, buy products, and communicate. The feed is the raw observation window.'
  },
  dossier: {
    title: 'Biometric Scanner',
    subtitle: 'Individual Profiles & Relationship Networks',
    icon: UserCheck,
    desc: 'A micro-intelligence panel displaying deep psychological files, biometric readings, and faction connection networks for key historical actors.',
    tells: 'Profiles major figures of the timeline, mapping their influence ratings, personal philosophies, and direct relations to other figures via an interactive social graph.',
    means: 'Exposes the hidden networks of power and influence. It shows who is allied with whom, who controls the major factions, and which individuals hold the greatest sway over the timeline\'s destiny.',
    importance: 'Identifies key nodes of intervention. Alternate history is often driven by the actions of extraordinary individuals; mapping their relations allows the operator to understand the personal rivalries shaping major world events.',
    needed: 'Systemic timeline adjustments are best achieved by influencing key decision-makers. The dossier system provides the tactical intelligence needed to influence these pivot-point actors.'
  },
  modes: {
    title: 'Reality Simulation Engine',
    subtitle: 'Reality Modes & Chronometric Themes',
    icon: Settings,
    desc: 'The underlying parameters governing the chronological rules, temporal drift, and visual aesthetics of the console.',
    tells: 'Displays the active Reality Mode (Anchored, Ripple, or Chaos) and allows switching between different historical aesthetic templates.',
    means: 'Governs how strictly the AI generator enforces historical continuity. Anchored is highly realistic; Ripple allows minor logical deviations; Chaos suspends the laws of probability entirely.',
    importance: 'Allows the operator to calibrate the intensity of the divergence. Higher chaos creates more entertaining, volatile timelines, while lighter themes ensure historical rigor.',
    needed: 'Without control over the simulation rules, operators could not test extreme temporal stress-testing scenarios or adjust the interface for low-light observation environments.'
  }
};

export default function SettingsPortal() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [activeSegment, setActiveSegment] = useState('stability');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [fontZoom, setFontZoom] = useState('100%');
  
  // Token Counters State
  const [sessionTokens, setSessionTokens] = useState<number>(0);
  const [historicalTokens, setHistoricalTokens] = useState<number>(0);
  const [currentWorldTokens, setCurrentWorldTokens] = useState<number>(0);

  // Initialize values on mount
  useEffect(() => {
    // Audio
    const savedAudio = localStorage.getItem('chronos-audio') === 'true';
    setAudioEnabled(savedAudio);

    // Font Zoom
    const savedZoom = localStorage.getItem('chronos-font-zoom') || '100%';
    setFontZoom(savedZoom);
    document.documentElement.style.fontSize = savedZoom;

    // Tokens
    const savedHistorical = parseInt(localStorage.getItem('chronos-total-tokens') || '0', 10);
    setHistoricalTokens(savedHistorical);
  }, []);

  // Sync Audio Toggle with Audio Engine and LocalStorage
  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return;

    if (audioEnabled) {
      engine.startAmbient();
      localStorage.setItem('chronos-audio', 'true');
    } else {
      engine.stopAmbient();
      localStorage.setItem('chronos-audio', 'false');
    }
  }, [audioEnabled]);

  // Audio typewriter listener
  useEffect(() => {
    if (!audioEnabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.length === 1 ||
        e.key === 'Backspace' ||
        e.key === 'Enter' ||
        e.key === 'Spacebar' ||
        e.key === ' '
      ) {
        const engine = getAudioEngine();
        engine?.playClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [audioEnabled]);

  // Page rustle sound on navigation when audio is enabled
  useEffect(() => {
    if (!audioEnabled) return;
    const engine = getAudioEngine();
    engine?.playPageRustle();
  }, [audioEnabled]);

  // Poll active world status to count tokens live
  useEffect(() => {
    let timerId: ReturnType<typeof setInterval> | null = null;
    let isMounted = true;

    async function checkActiveWorldTokens() {
      const activeWorldId = localStorage.getItem('chronos-active-world-id');
      if (!activeWorldId) {
        if (currentWorldTokens > 0) {
          // If world ID cleared, add current session to historical
          setHistoricalTokens(prev => {
            const next = prev + currentWorldTokens;
            localStorage.setItem('chronos-total-tokens', next.toString());
            return next;
          });
          setSessionTokens(prev => prev + currentWorldTokens);
          setCurrentWorldTokens(0);
        }
        return;
      }

      try {
        const statusData = await api.getWorldStatus(activeWorldId);
        if (!isMounted) return;

        if (statusData && statusData.tokensUsed !== undefined) {
          setCurrentWorldTokens(statusData.tokensUsed);
        }

        // If ready or failed, generation has completed: finalize tokens
        if (statusData.status === 'ready' || statusData.status === 'failed' || statusData.status === 'error') {
          const finalTokens = statusData.tokensUsed || 0;
          setHistoricalTokens(prev => {
            const next = prev + finalTokens;
            localStorage.setItem('chronos-total-tokens', next.toString());
            return next;
          });
          setSessionTokens(prev => prev + finalTokens);
          setCurrentWorldTokens(0);
          localStorage.removeItem('chronos-active-world-id');
        }
      } catch (err) {
        console.warn('Settings portal failed to poll active world tokens:', err);
      }
    }

    // Run check once immediately on mount/update
    checkActiveWorldTokens();

    timerId = setInterval(() => {
      checkActiveWorldTokens();
    }, 1500);

    return () => {
      isMounted = false;
      if (timerId) clearInterval(timerId);
    };
  }, [currentWorldTokens]);

  const handleAudioToggle = () => {
    setAudioEnabled(prev => !prev);
    const engine = getAudioEngine();
    engine?.playClick();
  };

  const handleZoomChange = (zoom: string) => {
    setFontZoom(zoom);
    document.documentElement.style.fontSize = zoom;
    localStorage.setItem('chronos-font-zoom', zoom);
    const engine = getAudioEngine();
    engine?.playClick();
  };

  const resetTokenCounter = () => {
    setHistoricalTokens(0);
    setSessionTokens(0);
    setCurrentWorldTokens(0);
    localStorage.setItem('chronos-total-tokens', '0');
    localStorage.removeItem('chronos-active-world-id');
    const engine = getAudioEngine();
    engine?.playClick();
  };

  const toggleDarkMode = () => {
    const nextTheme = theme.includes('dark') ? 'newspaper' : 'newspaper-dark';
    setTheme(nextTheme);
    const engine = getAudioEngine();
    engine?.playClick();
  };

  const themesList = [
    { id: 'newspaper', name: 'Vintage Press (Light)', style: 'bg-[#ede6d6] border-[#24180d] text-[#24180d]' },
    { id: 'newspaper-dark', name: 'Vintage Press (Dark)', style: 'bg-[#1a1613] border-[#e8e1d5] text-[#e8e1d5]' },
    { id: 'default', name: 'Neo-Cyberpunk (Neon)', style: 'bg-[#030712] border-indigo-500 text-indigo-400' },
    { id: 'steam', name: 'SteamNet (Brass)', style: 'bg-[#0e0a07] border-amber-600 text-amber-500' },
    { id: 'roman', name: 'Neo-Roman (Imperial)', style: 'bg-[#0a0410] border-violet-500 text-violet-400' },
    { id: 'mars', name: 'Mars Space (Rust)', style: 'bg-[#0f0404] border-red-500 text-red-500' },
  ] as const;

  return (
    <div className="relative font-serif">
      {/* Settings Floating Trigger Gear */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          const engine = getAudioEngine();
          engine?.playClick();
        }}
        title="Open simulation configurations"
        className="p-3 rounded-full border border-primary-base bg-[var(--card-bg)] text-primary-base hover:bg-primary-base hover:text-[var(--bg-color)] shadow-lg hover:shadow-[0_0_15px_rgba(var(--glow-color),0.45)] transition-all duration-300 cursor-pointer group flex items-center justify-center"
      >
        <Settings className={`w-5 h-5 transition-transform duration-700 ${isOpen ? 'rotate-180' : 'group-hover:rotate-90'}`} />
      </button>

      {/* Configuration Drawer Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-6 w-[290px] border-4 border-double border-primary-base p-5 rounded-none bg-[var(--card-bg)] backdrop-blur-md shadow-2xl z-50 flex flex-col gap-4 animate-[fadeIn_0.25s_ease-out] text-primary-base">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-primary-base/20 pb-2">
            <span className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 font-bold">
              <Settings size={11} className="animate-spin" style={{ animationDuration: '6s' }} />
              Operator Config Panel
            </span>
            <span className="text-[7.5px] font-mono text-primary-base/60 uppercase">SYSTEM: ONLINE</span>
          </div>

          {/* Duality Dark/Light quick toggle */}
          <div className="flex items-center justify-between border-b border-primary-base/10 pb-3 font-serif">
            <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              {theme.includes('dark') ? <Moon size={10} /> : <Sun size={10} />}
              Dark Mode Option
            </span>
            <button
              onClick={toggleDarkMode}
              className="border border-primary-base px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer"
            >
              {theme.includes('dark') ? '☼ Toggle Light' : '☾ Toggle Dark'}
            </button>
          </div>

          {/* Sizing Scale */}
          <div className="flex flex-col gap-1.5 border-b border-primary-base/10 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Type size={11} />
              Chronology Text Scaling
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {['90%', '100%', '115%', '130%'].map(zoom => (
                <button
                  key={zoom}
                  onClick={() => handleZoomChange(zoom)}
                  className={`border text-[9px] py-1 font-bold rounded-none cursor-pointer transition-all duration-300 ${
                    fontZoom === zoom
                      ? 'border-primary-base bg-primary-base text-[var(--bg-color)]'
                      : 'border-primary-base/35 hover:border-primary-base'
                  }`}
                >
                  {zoom}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector (Initializer) */}
          <div className="flex flex-col gap-1.5 border-b border-primary-base/10 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <LayoutGrid size={11} />
              Select Alternate Theme
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {themesList.map(t => {
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id as ThemeName);
                      const engine = getAudioEngine();
                      engine?.playClick();
                    }}
                    title={t.name}
                    className={`border text-[8.5px] p-1.5 text-center font-bold tracking-tight leading-tight rounded-none cursor-pointer transition-all duration-300 flex items-center justify-between ${t.style} ${
                      isActive
                        ? 'ring-2 ring-primary-base border-transparent font-black'
                        : 'opacity-70 hover:opacity-100 border-primary-base/30'
                    }`}
                  >
                    <span className="truncate pr-0.5">{t.name.split(' ')[0]} {t.name.split(' ')[1] || ''}</span>
                    {isActive && <Check size={8} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tokens Counter */}
          <div className="flex flex-col gap-1.5 border-b border-primary-base/10 pb-3">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
              <span className="flex items-center gap-1">
                <Coins size={11} />
                Telemetry Tokens Used
              </span>
              <button
                onClick={resetTokenCounter}
                className="text-[7.5px] border border-primary-base/30 px-1 py-0.2 hover:bg-primary-base hover:text-[var(--bg-color)] transition-all cursor-pointer uppercase"
              >
                Reset
              </button>
            </div>
            <div className="p-2 bg-black/10 border border-primary-base/15 flex flex-col gap-1 text-[9px] font-mono leading-normal">
              {currentWorldTokens > 0 && (
                <div className="flex justify-between items-center text-primary-base">
                  <span>LIVE GENERATION:</span>
                  <span className="font-bold animate-pulse">{currentWorldTokens.toLocaleString()} TKN</span>
                </div>
              )}
              <div className="flex justify-between items-center text-text-dim">
                <span>SESSION TOTAL:</span>
                <span>{(sessionTokens + currentWorldTokens).toLocaleString()} TKN</span>
              </div>
              <div className="flex justify-between items-center text-primary-base font-bold">
                <span>CUMULATIVE TOTAL:</span>
                <span>{(historicalTokens + currentWorldTokens).toLocaleString()} TKN</span>
              </div>
            </div>
          </div>

          {/* Audio Engine */}
          <div className="flex items-center justify-between border-b border-primary-base/10 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              {audioEnabled ? <Volume2 size={11} className="animate-pulse" /> : <VolumeX size={11} />}
              Engine Soundscape
            </span>
            <button
              onClick={handleAudioToggle}
              className={`border px-2.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                audioEnabled
                  ? 'border-primary-base bg-primary-base text-[var(--bg-color)]'
                  : 'border-primary-base/35 hover:border-primary-base'
              }`}
            >
              {audioEnabled ? '♨ Sound On' : '♨ Sound Off'}
            </button>
          </div>

          {/* Telemetry Operations Guide */}
          <button
            onClick={() => {
              setIsManualOpen(true);
              const engine = getAudioEngine();
              engine?.playPageRustle();
            }}
            className="w-full border border-primary-base py-1.5 text-[9px] font-bold uppercase tracking-widest hover:bg-primary-base hover:text-[var(--bg-color)] bg-primary-base/10 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 mb-2"
          >
            <span>❓ Telemetry Operations Guide</span>
          </button>

          {/* Developer Portal Router */}
          <button
            onClick={() => {
              setIsOpen(false);
              const engine = getAudioEngine();
              engine?.playPageRustle();
              router.push('/developers');
            }}
            className="w-full border border-primary-base py-1.5 text-[9px] font-bold uppercase tracking-widest hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer flex items-center justify-center gap-1"
          >
            <span>Open Developer Portal</span>
            <ArrowUpRight size={10} />
          </button>
        </div>
      )}

      {/* Telemetry Operations Manual Modal */}
      {isManualOpen && (() => {
        const activeData = segmentData[activeSegment as keyof typeof segmentData];
        const ActiveIcon = activeData.icon;
        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 md:p-8 animate-[fadeIn_0.25s_ease-out]">
            {/* Modal Card */}
            <div className="relative w-full max-w-5xl h-[85vh] md:h-[80vh] border-4 border-double border-primary-base bg-[var(--card-bg)] text-primary-base p-5 md:p-8 flex flex-col rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden font-serif animate-[scaleUp_0.3s_cubic-bezier(0.16,1,0.3,1)]">
              
              {/* Clockwork Ornaments (absolute corners) */}
              <div className="absolute top-2 left-2 text-[10px] opacity-20 font-mono">SYS.MAN.09</div>
              <div className="absolute top-2 right-12 text-[10px] opacity-20 font-mono">REV.1890</div>

              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-double border-primary-base pb-3">
                <div>
                  <h2 className="text-sm md:text-base font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="animate-[spin_15s_linear_infinite] inline-block">⚙</span>
                    THE CHRONOMETRIC TELEMETRY OPERATIONS MANUAL
                  </h2>
                  <p className="text-[9px] md:text-[10px] font-sans uppercase tracking-wider text-text-dim mt-0.5">
                    SYSTEM DIAGNOSTICS & ANALYTICAL INTERPRETATION OF ALTERNATE TIMELINES
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsManualOpen(false);
                    const engine = getAudioEngine();
                    engine?.playPageRustle();
                  }}
                  title="Close manual"
                  className="p-1.5 border border-primary-base hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer flex items-center justify-center rounded-none"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Double column layout */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden mt-4 gap-6">
                
                {/* Left Column (Index) */}
                <div className="w-full md:w-1/4 border-b md:border-b-0 md:border-r border-primary-base/20 pb-4 md:pb-0 md:pr-4 flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible md:overflow-y-auto scrollbar-thin">
                  {Object.entries(segmentData).map(([key, value]) => {
                    const Icon = value.icon;
                    const isActive = activeSegment === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setActiveSegment(key);
                          const engine = getAudioEngine();
                          engine?.playClick();
                        }}
                        className={`flex items-center gap-2 px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider rounded-none cursor-pointer transition-all duration-200 shrink-0 md:shrink-1 ${
                          isActive
                            ? 'bg-primary-base text-[var(--bg-color)] border border-primary-base shadow-[0_0_8px_rgba(var(--glow-color),0.2)]'
                            : 'border border-primary-base/20 hover:border-primary-base/60 bg-black/5 hover:bg-black/10'
                        }`}
                      >
                        <Icon size={12} className={isActive ? 'animate-pulse' : ''} />
                        <span className="truncate">{value.title}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Right Column (Content Viewport) */}
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin flex flex-col gap-5">
                  {/* Active Segment Title */}
                  <div>
                    <h3 className="text-base font-bold uppercase tracking-widest flex items-center gap-2">
                      <ActiveIcon size={18} className="text-primary-base animate-pulse" />
                      {activeData.title}
                    </h3>
                    <p className="text-[10px] italic font-sans tracking-wide text-text-dim">
                      {activeData.subtitle}
                    </p>
                  </div>

                  {/* Ornate separator */}
                  <div className="flex items-center gap-3">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary-base/40 to-transparent" />
                    <span className="text-xs opacity-50 animate-[spin_16s_linear_infinite] inline-block">⚙</span>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-primary-base/40 to-transparent" />
                  </div>

                  {/* Description Callout */}
                  <div className="border-l-4 border-primary-base bg-black/10 p-3 text-[11px] leading-relaxed italic text-primary-base/90 rounded-none">
                    {activeData.desc}
                  </div>

                  {/* Matrix layout of the 4 key questions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    
                    {/* What it tells */}
                    <div className="border border-primary-base/15 p-3.5 bg-black/5 hover:bg-black/10 hover:border-primary-base/30 transition-all duration-300 flex flex-col gap-1.5">
                      <h4 className="text-[10px] uppercase font-bold tracking-wider text-primary-base flex items-center gap-1.5 border-b border-primary-base/15 pb-1">
                        <span className="text-[8.5px] opacity-70">Ⅰ.</span> What It Tells
                      </h4>
                      <p className="text-[11px] leading-relaxed text-primary-base/85 font-sans">{activeData.tells}</p>
                    </div>

                    {/* What it means */}
                    <div className="border border-primary-base/15 p-3.5 bg-black/5 hover:bg-black/10 hover:border-primary-base/30 transition-all duration-300 flex flex-col gap-1.5">
                      <h4 className="text-[10px] uppercase font-bold tracking-wider text-primary-base flex items-center gap-1.5 border-b border-primary-base/15 pb-1">
                        <span className="text-[8.5px] opacity-70">Ⅱ.</span> What It Means
                      </h4>
                      <p className="text-[11px] leading-relaxed text-primary-base/85 font-sans">{activeData.means}</p>
                    </div>

                    {/* How it is important */}
                    <div className="border border-primary-base/15 p-3.5 bg-black/5 hover:bg-black/10 hover:border-primary-base/30 transition-all duration-300 flex flex-col gap-1.5">
                      <h4 className="text-[10px] uppercase font-bold tracking-wider text-primary-base flex items-center gap-1.5 border-b border-primary-base/15 pb-1">
                        <span className="text-[8.5px] opacity-70">Ⅲ.</span> How It Is Important
                      </h4>
                      <p className="text-[11px] leading-relaxed text-primary-base/85 font-sans">{activeData.importance}</p>
                    </div>

                    {/* Why it is needed */}
                    <div className="border border-primary-base/15 p-3.5 bg-black/5 hover:bg-black/10 hover:border-primary-base/30 transition-all duration-300 flex flex-col gap-1.5">
                      <h4 className="text-[10px] uppercase font-bold tracking-wider text-primary-base flex items-center gap-1.5 border-b border-primary-base/15 pb-1">
                        <span className="text-[8.5px] opacity-70">Ⅳ.</span> Why It Is Needed
                      </h4>
                      <p className="text-[11px] leading-relaxed text-primary-base/85 font-sans">{activeData.needed}</p>
                    </div>

                  </div>

                  {/* Footer notes */}
                  <div className="mt-4 pt-3 border-t border-primary-base/10 text-[8.5px] text-text-dim leading-normal flex items-center justify-between font-mono">
                    <span>TELEMETRY SUBSYSTEM: {activeSegment.toUpperCase()}</span>
                    <span>CHRONOS ENGINE CORE V2.0</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        );
      })()}
    </div>
  );
}
