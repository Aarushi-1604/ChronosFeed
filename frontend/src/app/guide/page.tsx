'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  BookOpen, 
  Anchor, 
  Zap, 
  HelpCircle,
  Compass,
  FileText,
  Sliders,
  Send,
  GitBranch,
  Shield
} from 'lucide-react';
import { useTheme } from '../../context/theme-context';
import CanvasGrid from '../../components/ui/canvas-grid';
import ChronosLogo from '../../components/branding/chronos-logo';

export default function GuidePage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isNewspaper = theme.startsWith('newspaper');

  const steps = [
    {
      icon: <FileText size={18} className="text-primary-base" />,
      title: "Step 1: Enter a Divergence Prompt",
      desc: "Propose an alternate history scenario or 'What If?' question in the compositor box. E.g., 'What if the Library of Alexandria was never burned?' or 'What if Tesla won the War of Currents?'"
    },
    {
      icon: <Sliders size={18} className="text-primary-base" />,
      title: "Step 2: Select a Reality Simulation Mode",
      desc: "Choose between three modes (Reality Anchored, Ripple, or Chaos) to dictate how far the butterfly effects of your divergence propagate through historical institutions, figures, and timelines."
    },
    {
      icon: <Send size={18} className="text-primary-base" />,
      title: "Step 3: Compile the Alternate History",
      desc: "Click 'Compile Reality'. The Babbage simulation engine initializes, invoking AI models sequentially to craft timeline events, figure personas, posts, news bulletins, and commercials."
    },
    {
      icon: <Compass size={18} className="text-primary-base" />,
      title: "Step 4: Navigate the Chronos Feed",
      desc: "Explore the compiled world. Read the chronological timeline events on the left, scan the social feed & media in the center, and inspect world telemetry stats on the right."
    },
    {
      icon: <GitBranch size={18} className="text-primary-base" />,
      title: "Step 5: Interact with Persona Dossiers",
      desc: "Click on any simulated figure's avatar or username to inspect their specialized role, bio, and alignment. Toggle the comments section on posts to see live debates between different figures."
    }
  ];

  const modes = [
    {
      icon: <Anchor size={20} className="text-amber-500" />,
      name: "⚓ Reality Anchored Mode (Strict Containment)",
      desc: "The timeline alters only the exact elements stated in your prompt. All other real-world leaders, media outlets, and global institutions remain completely identical to reality. E.g., if Modi becomes President of China, the Indian Parliament and global CNN reports still function normally."
    },
    {
      icon: <Zap size={20} className="text-cyan-500" />,
      name: "🌊 Ripple Mode (Logical Cascade)",
      desc: "The divergence creates a logical chain reaction. Alliances shift, stock markets adapt, and regional policies morph based on the departure point, but unrelated parts of the globe are left undisturbed."
    },
    {
      icon: <Zap size={20} className="text-rose-500 animate-pulse" />,
      name: "⚡ Chaos Mode (Maximum Divergence)",
      desc: "Triggers absolute butterfly effects. The timeline departs dramatically from reality, causing unpredictable, far-reaching power shifts and structural re-alignments across all simulated regions."
    }
  ];

  return (
    <div className={`md:h-screen min-h-screen md:overflow-y-auto overflow-x-hidden relative flex flex-col p-4 md:p-8 select-none pb-16 ${
      isNewspaper ? 'border-8 border-double border-primary-base bg-background text-primary-base font-serif' : ''
    }`}>
      {/* Dynamic Background Particles */}
      {!isNewspaper && <CanvasGrid />}

      {/* Header */}
      <header className={`relative w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between pb-4 mb-8 z-10 gap-3 md:gap-0 ${
        isNewspaper ? 'border-b-4 border-double border-primary-base text-primary-base' : 'border-b border-white/5'
      }`}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.push('/')}
            className={`flex items-center gap-1.5 px-3 py-1 font-serif text-[10px] tracking-wider uppercase border border-primary-base hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer ${
              isNewspaper ? 'text-primary-base border-primary-base' : 'text-white border-white/20'
            }`}
          >
            <ArrowLeft size={12} />
            Return to Console
          </button>
        </div>
        
        <h2 className="hidden md:flex md:absolute md:left-1/2 md:-translate-x-1/2 items-center gap-2 font-serif text-[11px] uppercase tracking-[0.25em] font-bold text-text-dim">
          <BookOpen size={14} className="text-primary-base" />
          Simulation Operator Manual
        </h2>

        <div className="flex items-center text-[10px] font-serif uppercase tracking-widest text-text-dim font-bold">
          VOLUME CCLXVIII // NO. 45092
        </div>
      </header>

      {/* Content */}
      <main className="w-full max-w-4xl mx-auto z-10 flex flex-col gap-10">
        
        {/* Title Block */}
        <div className="text-center flex flex-col items-center gap-2">
          <ChronosLogo size={48} className="text-primary-base" />
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-serif mt-2">
            HOW TO OPERATE CHRONOSFEED
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-text-dim max-w-md mx-auto italic">
            "A comprehensive guide to generating, parsing, and exploring divergent historical timelines."
          </p>
          <div className="w-24 h-[2px] bg-primary-base/20 mt-4" />
        </div>

        {/* Step-by-Step Instructions */}
        <section className={`p-6 ${
          isNewspaper ? 'border border-primary-base/20 bg-black/[0.005]' : 'bg-white/[0.01] border border-white/5 rounded-xl'
        }`}>
          <h3 className="font-serif text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-dashed border-primary-base/20 flex items-center gap-2">
            <HelpCircle size={14} className="text-primary-base" />
            Simulation Steps
          </h3>

          <div className="flex flex-col gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className={`p-2 border ${
                  isNewspaper ? 'border-primary-base/20' : 'border-white/10 rounded-lg bg-white/[0.02]'
                }`}>
                  {step.icon}
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-sm font-bold text-text-main">{step.title}</h4>
                  <p className="font-sans text-xs text-text-dim leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Simulation Modes Breakdown */}
        <section className={`p-6 ${
          isNewspaper ? 'border border-primary-base/20 bg-black/[0.005]' : 'bg-white/[0.01] border border-white/5 rounded-xl'
        }`}>
          <h3 className="font-serif text-xs font-bold uppercase tracking-widest mb-6 pb-2 border-b border-dashed border-primary-base/20 flex items-center gap-2">
            <Sliders size={14} className="text-primary-base" />
            Understanding Simulation Modes
          </h3>

          <div className="grid grid-cols-1 gap-6">
            {modes.map((mode, idx) => (
              <div key={idx} className={`p-4 border flex flex-col gap-2 ${
                isNewspaper ? 'border-primary-base/15 bg-black/[0.003]' : 'border-white/5 bg-white/[0.01] rounded-lg'
              }`}>
                <h4 className="font-serif text-sm font-bold text-text-main flex items-center gap-2">
                  {mode.icon}
                  {mode.name}
                </h4>
                <p className="font-sans text-xs text-text-dim leading-relaxed">{mode.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* System Safeguards Note */}
        <section className={`p-5 flex gap-4 items-start ${
          isNewspaper ? 'border border-dashed border-primary-base/30' : 'border border-dashed border-amber-500/20 bg-amber-500/[0.01] rounded-xl'
        }`}>
          <Shield size={22} className="text-primary-base flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-text-main">
              Note on API Quotas & Sandbox Mode
            </h4>
            <p className="font-sans text-[11px] text-text-dim leading-relaxed">
              ChronosFeed operates on Gemini API free tiers (10 Requests Per Minute). To ensure stability, the system spaces out calls gracefully. If you experience an engine fault banner, it indicates the API key is rate-limited or disabled. The console will automatically failover to a cached **Victorian Sandbox Mode** to let you explore pre-simulated timelines seamlessly.
            </p>
          </div>
        </section>

      </main>

      {/* Newspaper Footer */}
      <footer className="w-full max-w-4xl mx-auto border-t-2 border-double border-primary-base/20 mt-8 pt-3.5 pb-1 text-center text-[9px] tracking-[0.22em] font-serif text-text-dim uppercase font-bold z-10">
        AI CLUB | SIT PUNE | AARUSHI | ADITYA | YESHWANT | v1.2.0 | 2026
      </footer>
    </div>
  );
}
