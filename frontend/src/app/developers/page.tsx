'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Cpu, 
  Layers, 
  GitBranch, 
  Activity, 
  BookOpen, 
  Code, 
  Settings, 
  Database,
  Eye,
  Rocket,
  Award,
  Users
} from 'lucide-react';
import { useTheme } from '../../context/theme-context';
import CanvasGrid from '../../components/ui/canvas-grid';
import ChronosLogo from '../../components/branding/chronos-logo';

export default function DeveloperPortal() {
  const router = useRouter();
  const { theme } = useTheme();
  const isNewspaper = theme.startsWith('newspaper');

  const techStack = [
    { name: 'Next.js 15 (App Router)', role: 'Frontend Core & Core Page Routing', category: 'Frontend' },
    { name: 'React 19 & TypeScript', role: 'Stateful UI components & Strict system types', category: 'Frontend' },
    { name: 'Tailwind CSS v4', role: 'Harmonious color palettes & fluid layouts', category: 'Styling' },
    { name: 'Framer Motion', role: 'Fluid animations, smooth drawers, & loaders', category: 'Animations' },
    { name: 'Express & Node.js', role: 'API endpoints & generative pipeline controller', category: 'Backend' },
    { name: 'Supabase (PostgreSQL)', role: 'Timelines, figure dossiers, & comment threads storage', category: 'Database' },
    { name: 'Google Generative AI (Gemini)', role: 'Generative alternate reality simulation engine', category: 'AI Components' },
  ];

  const features = [
    { title: 'Reality Divergence Console', desc: 'Accepts historical prompts (e.g., "What if Rome never fell?") and boots a multi-stage generator.' },
    { title: 'Chronological Timeline Generator', desc: 'Simulates cause-effect chronological events establishing the path of timeline divergence.' },
    { title: 'Persona Dossier Compiler', desc: 'Simulates active historical figures with handles, roles, custom bios, and influence metrics.' },
    { title: 'Polysocial Live Feed Stream', desc: 'Renders interleaved post, news, and advertisement cards corresponding to the timeline era.' },
    { title: 'Comments Thread System', desc: 'Enables interactive comment feeds showing discussions among simulated figures.' },
    { title: 'Aged Newspaper Theme UI', desc: 'Triggers a full-page vintage newspaper aesthetic when alternate timelines are compiled.' },
    { title: 'Offline Sandbox Compatibility', desc: 'Automatic local mock fallbacks to prevent crashes when backend API keys are absent.' },
  ];

  const gitMilestones = [
    {
      version: 'v1.2.0',
      date: 'June 12, 2026',
      title: 'UI Polish, Manual Guide & Header Alignments',
      desc: 'Added step-by-step How to Use operator guide page. Implemented absolute desktop centering for issue volume indicators, prompt quote subtitles, and news feed headers. Refined newspaper card layouts with double-borders and high-contrast headlines.',
    },
    {
      version: 'v1.1.0',
      date: 'June 11, 2026',
      title: 'Retro Newspaper Theme & Dossier Polish',
      desc: 'Implemented the Daily Chronicle masthead layout, ink engraving stability gauges, flat vector mapping, drop-cap content paragraph rendering, and Developer portal button styling.',
    },
    {
      version: 'v1.0.0',
      date: 'June 11, 2026',
      title: 'Comments System & Interleaving Engine',
      desc: 'Added comments database tables, Express routing controllers, comments side-drawer UI with skeleton loaders, manual pagination, and randomized feed composition.',
    },
    {
      version: 'v0.8.0',
      date: 'June 10, 2026',
      title: 'Full Generation Pipeline Orchestration',
      desc: 'Completed backend prompt templates, JSON syntax cleaners, status tracking services, and POST world compilation polling loop.',
    },
    {
      version: 'v0.5.0',
      date: 'June 09, 2026',
      title: 'Generative AI Prompts Genesis',
      desc: 'Engineered multi-turn prompts for alternate history worlds, chronology branches, and persona networks. Tested Gemini SDK wrappers.',
    },
    {
      version: 'v0.1.0',
      date: 'June 08, 2026',
      title: 'Platform Initialization & UI Setup',
      desc: 'First Development Date. Configured Next.js client layout, Supabase relational schemas, Express base servers, and initial client interface themes (Steam, Roman, Mars).',
    },
  ];

  const reposStats = [
    { label: 'Language Core', value: 'TypeScript (100%)' },
    { label: 'Theme Support', value: 'Default, Steam, Roman, Mars, Newspaper' },
    { label: 'Offline Sandbox', value: 'Enabled (Automatic local mock)' },
    { label: 'UI Architecture', value: '3-Panel Responsive Layout Grid' },
    { label: 'First Commit Date', value: 'June 08, 2026' },
  ];

  return (
    <div className={`md:h-screen min-h-screen md:overflow-y-auto overflow-x-hidden relative flex flex-col p-4 md:p-8 select-none pb-16 ${
      isNewspaper ? 'border-8 border-double border-primary-base bg-background text-primary-base font-serif' : ''
    }`}>
      {/* Dynamic Background Particles (only for normal dark mode console) */}
      {!isNewspaper && <CanvasGrid />}

      {/* Header */}
      <header className={`w-full max-w-6xl mx-auto flex items-center justify-between pb-4 mb-8 z-10 ${
        isNewspaper ? 'border-b-4 border-double border-primary-base text-primary-base' : 'border-b border-white/5'
      }`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className={`w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all ${
              isNewspaper 
                ? 'border border-primary-base hover:bg-primary-base hover:text-[var(--bg-color)]' 
                : 'border border-white/10 hover:border-accent-base bg-white/5 text-text-dim hover:text-text-main hover:shadow-[0_0_8px_rgba(var(--glow-color),0.2)]'
            }`}
          >
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-3">
            <ChronosLogo size={40} className="text-primary-base" />
            <div>
              <h1 className={`text-xl font-bold tracking-tight leading-none ${isNewspaper ? 'text-primary-base' : 'text-text-main'}`}>
                DEVELOPER INFORMATION PAGE
              </h1>
              <span className={`text-[10px] tracking-wider block mt-1 ${isNewspaper ? 'text-text-dim' : 'font-mono text-accent-base uppercase'}`}>
                About / Developers — Project Overview & Telemetry Details
              </span>
            </div>
          </div>
        </div>
        <div className={`hidden md:flex gap-4 text-[10px] ${isNewspaper ? 'text-text-dim' : 'font-mono text-text-dim'}`}>
          <span>PORTAL: ONLINE</span>
          <span className={isNewspaper ? 'font-bold' : 'text-emerald-400 font-bold animate-pulse'}>SECURE ACCESS</span>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 z-10 relative">
        {/* Left column: Overview, Stack & Stats (7 Cols) */}
        <div className="md:col-span-7 flex flex-col gap-8">
          
          {/* Built For & Built By Metadata Section */}
          <section className={
            isNewspaper 
              ? 'border border-primary-base/40 p-6 rounded-none flex flex-col gap-5' 
              : 'glass-panel p-6 rounded-2xl border border-border-color flex flex-col gap-5'
          }>
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isNewspaper ? 'text-primary-base' : 'font-mono text-text-main'}`}>
              <Users size={16} className={isNewspaper ? 'text-primary-base' : 'text-accent-base'} />
              1. Project Core & Affiliation
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className={
                isNewspaper 
                  ? 'border border-primary-base/30 p-4 bg-black/[0.02]' 
                  : 'glass-panel p-4 rounded-xl bg-white/[0.02] border border-white/5'
              }>
                <span className={`font-bold block mb-1 ${isNewspaper ? 'text-primary-base' : 'text-accent-base'}`}>Built For</span>
                <p className={isNewspaper ? 'text-text-dim' : 'text-text-dim leading-relaxed'}>
                  <strong>AI Club</strong>
                  <br />
                  Symbiosis Institute of Technology, Pune
                </p>
              </div>
              <div className={
                isNewspaper 
                  ? 'border border-primary-base/30 p-4 bg-black/[0.02]' 
                  : 'glass-panel p-4 rounded-xl bg-white/[0.02] border border-white/5'
              }>
                <span className={`font-bold block mb-1 ${isNewspaper ? 'text-primary-base' : 'text-accent-base'}`}>Built By</span>
                <div className={isNewspaper ? 'text-text-dim space-y-0.5' : 'text-text-dim space-y-0.5'}>
                  <div>Aarushi S. — <em>Backend Engineer</em></div>
                  <div>Aditya Singh — <em>Frontend Engineer</em></div>
                  <div>Yeshwant — <em>AI Engineer</em></div>
                </div>
              </div>
            </div>
          </section>

          {/* Project Overview / Purpose / Tech Stack */}
          <section className={
            isNewspaper 
              ? 'border border-primary-base/40 p-6 rounded-none flex flex-col gap-4' 
              : 'glass-panel p-6 rounded-2xl border border-border-color flex flex-col gap-4'
          }>
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isNewspaper ? 'text-primary-base' : 'font-mono text-text-main'}`}>
              <Cpu size={16} className={isNewspaper ? 'text-primary-base' : 'text-accent-base'} />
              2. System Purpose & Core Concepts
            </h2>
            <div className={`text-xs leading-relaxed space-y-3 ${isNewspaper ? 'text-text-dim' : 'text-text-dim font-sans'}`}>
              <p>
                <strong>ChronosFeed</strong> is an alternate history simulation platform that bridges LLM-based narrative generation with an interactive, multi-era social network simulator. By specifying a pivotal "divergence prompt" (e.g. <em>what if the library of Alexandria survived?</em>), the system generates a causal chain of events and populates active simulated personas, news dispatches, advertisements, and feed posts.
              </p>
              <p>
                The primary purpose is to test the consistency and logical coherence of multi-turn prompting chains across structured JSON schemas. It maps alternate geography coordinates, simulates public opinion metrics, and calculates the divergence reality stability score.
              </p>
            </div>
          </section>

          {/* Tech Stack List */}
          <section className={
            isNewspaper 
              ? 'border border-primary-base/40 p-6 rounded-none flex flex-col gap-4' 
              : 'glass-panel p-6 rounded-2xl border border-border-color flex flex-col gap-4'
          }>
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isNewspaper ? 'text-primary-base' : 'font-mono text-text-main'}`}>
              <Layers size={16} className={isNewspaper ? 'text-primary-base' : 'text-accent-base'} />
              3. Technology Stack Breakdown
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {techStack.map((tech, i) => (
                <div key={i} className={`flex flex-col p-3 border transition-colors ${
                  isNewspaper 
                    ? 'border-primary-base/20 bg-black/[0.01] hover:bg-black/[0.03]' 
                    : 'border-white/5 rounded-xl bg-white/[0.01] hover:bg-white/[0.03]'
                }`}>
                  <span className={`text-[9px] uppercase tracking-wider ${isNewspaper ? 'text-primary-base' : 'font-mono text-accent-base'}`}>{tech.category}</span>
                  <span className={`font-bold text-xs mt-0.5 ${isNewspaper ? 'text-primary-base' : 'text-text-main'}`}>{tech.name}</span>
                  <span className={`text-[10px] mt-1 leading-normal ${isNewspaper ? 'text-text-dim' : 'text-text-dim font-sans'}`}>{tech.role}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Features List */}
          <section className={
            isNewspaper 
              ? 'border border-primary-base/40 p-6 rounded-none flex flex-col gap-4' 
              : 'glass-panel p-6 rounded-2xl border border-border-color flex flex-col gap-4'
          }>
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isNewspaper ? 'text-primary-base' : 'font-mono text-text-main'}`}>
              <BookOpen size={16} className={isNewspaper ? 'text-primary-base' : 'text-accent-base'} />
              4. Feature Architecture Overview
            </h2>
            <div className="space-y-3 text-xs">
              {features.map((feat, i) => (
                <div key={i} className={`p-3.5 border ${
                  isNewspaper 
                    ? 'border-primary-base/20 bg-black/[0.01]' 
                    : 'border-white/5 rounded-xl bg-white/[0.02]'
                }`}>
                  <span className={`font-bold block ${isNewspaper ? 'text-primary-base' : 'text-text-main'}`}>{feat.title}</span>
                  <p className="mt-1 leading-relaxed text-text-dim font-sans">{feat.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right column: Architecture, Git Milestones & Stats (5 Cols) */}
        <div className="md:col-span-5 flex flex-col gap-8">
          
          {/* System Architecture Detail */}
          <section className={
            isNewspaper 
              ? 'border border-primary-base/40 p-6 rounded-none flex flex-col gap-4' 
              : 'glass-panel p-6 rounded-2xl border border-border-color flex flex-col gap-4'
          }>
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isNewspaper ? 'text-primary-base' : 'font-mono text-text-main'}`}>
              <Activity size={16} className={isNewspaper ? 'text-primary-base' : 'text-accent-base'} />
              5. Pipeline Architecture
            </h2>
            <div className={`space-y-4 text-[10px] ${isNewspaper ? 'text-text-dim' : 'font-mono text-text-dim'}`}>
              <div className={`border p-3 ${isNewspaper ? 'border-primary-base/20 bg-black/[0.01]' : 'border-white/5 rounded-xl bg-white/[0.02]'}`}>
                <span className={`font-bold uppercase block mb-1 flex items-center gap-1 ${isNewspaper ? 'text-primary-base' : 'text-accent-base'}`}>
                  <Code size={12} />
                  Generation Logic
                </span>
                <p className={`leading-relaxed text-[11px] ${isNewspaper ? 'font-serif' : 'font-sans'}`}>
                  Anchor inputs trigger backend async queues. The Generative AI orchestrator loops multi-turn prompts using Gemini Flash, cleaning outputs via structured regex patterns, and populates PostgreSQL tables.
                </p>
              </div>

              <div className={`border p-3 ${isNewspaper ? 'border-primary-base/20 bg-black/[0.01]' : 'border-white/5 rounded-xl bg-white/[0.02]'}`}>
                <span className={`font-bold uppercase block mb-1 flex items-center gap-1 ${isNewspaper ? 'text-primary-base' : 'text-accent-base'}`}>
                  <Database size={12} />
                  Database Relational Schema
                </span>
                <p className={`leading-relaxed text-[11px] ${isNewspaper ? 'font-serif' : 'font-sans'}`}>
                  Includes primary tables: <code>worlds</code> (meta, era descriptors), <code>events</code> (historical nodes for timelines), <code>personas</code> (dossier data), <code>posts</code> (social feeds), <code>comments</code> (post threads), and <code>advertisements</code>/<code>news</code>.
                </p>
              </div>
            </div>
          </section>

          {/* Repository Statistics */}
          <section className={
            isNewspaper 
              ? 'border border-primary-base/40 p-6 rounded-none flex flex-col gap-4' 
              : 'glass-panel p-6 rounded-2xl border border-border-color flex flex-col gap-4'
          }>
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isNewspaper ? 'text-primary-base' : 'font-mono text-text-main'}`}>
              <Settings size={16} className={isNewspaper ? 'text-primary-base' : 'text-accent-base'} />
              6. Repository Statistics
            </h2>
            <div className={`flex flex-col gap-2 text-xs ${isNewspaper ? 'font-serif' : 'font-mono'}`}>
              {reposStats.map((stat, i) => (
                <div key={i} className={`flex justify-between items-center border-b pb-2 last:border-0 last:pb-0 ${isNewspaper ? 'border-primary-base/15' : 'border-white/5'}`}>
                  <span className={`uppercase text-[10px] ${isNewspaper ? 'text-text-dim' : 'text-text-dim'}`}>{stat.label}</span>
                  <span className={`font-bold ${isNewspaper ? 'text-primary-base' : 'text-text-main'}`}>{stat.value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Major Milestones Timeline */}
          <section className={
            isNewspaper 
              ? 'border border-primary-base/40 p-6 rounded-none flex flex-col gap-4' 
              : 'glass-panel p-6 rounded-2xl border border-border-color flex flex-col gap-4'
          }>
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isNewspaper ? 'text-primary-base' : 'font-mono text-text-main'}`}>
              <GitBranch size={16} className={isNewspaper ? 'text-primary-base' : 'text-accent-base'} />
              7. Version & Git Milestone History
            </h2>
            <div className={`relative ml-2.5 pl-4 space-y-5 border-l ${isNewspaper ? 'border-primary-base/30' : 'border-white/10'}`}>
              {gitMilestones.map((item, i) => (
                <div key={i} className="relative group">
                  {/* Point node */}
                  <div className={`absolute -left-[22px] top-1.5 w-3 h-3 transition-colors ${
                    isNewspaper 
                      ? 'border border-primary-base bg-background group-hover:bg-primary-base' 
                      : 'rounded-full border border-accent-base bg-background group-hover:bg-accent-base'
                  }`} />
                  
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-xs font-bold ${isNewspaper ? 'text-primary-base' : 'font-mono text-accent-base'}`}>{item.version}</span>
                      <span className={`text-[9px] ${isNewspaper ? 'text-text-dim' : 'font-mono text-text-dim'}`}>{item.date}</span>
                    </div>
                    <span className={`text-xs font-bold mt-0.5 ${isNewspaper ? 'text-primary-base font-serif' : 'text-text-main font-serif'}`}>{item.title}</span>
                    <p className={`text-[10px] leading-relaxed mt-1 ${isNewspaper ? 'text-text-dim font-sans' : 'text-text-dim font-sans'}`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Feature Roadmap */}
          <section className={
            isNewspaper 
              ? 'border border-primary-base/40 p-6 rounded-none flex flex-col gap-4' 
              : 'glass-panel p-6 rounded-2xl border border-border-color flex flex-col gap-4'
          }>
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isNewspaper ? 'text-primary-base' : 'font-mono text-text-main'}`}>
              <Rocket size={16} className={isNewspaper ? 'text-primary-base' : 'text-accent-base'} />
              8. Future Roadmap
            </h2>
            <div className={`space-y-2.5 text-xs ${isNewspaper ? 'text-text-dim' : 'text-text-dim'}`}>
              <div className="flex items-start gap-2">
                <span className={`w-1.5 h-1.5 mt-1.5 flex-shrink-0 ${isNewspaper ? 'bg-primary-base' : 'rounded-full bg-accent-base'}`} />
                <span className={isNewspaper ? 'font-serif' : 'font-sans'}>
                  <strong>Interactive Figure Chat (DMs):</strong> Allow users to exchange direct text messages in real-time with simulated historical personalities.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className={`w-1.5 h-1.5 mt-1.5 flex-shrink-0 ${isNewspaper ? 'bg-primary-base' : 'rounded-full bg-accent-base'}`} />
                <span className={isNewspaper ? 'font-serif' : 'font-sans'}>
                  <strong>Timeline Branching Injectors:</strong> Let users inject new events mid-timeline and watch the simulator compile secondary branches.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className={`w-1.5 h-1.5 mt-1.5 flex-shrink-0 ${isNewspaper ? 'bg-primary-base' : 'rounded-full bg-accent-base'}`} />
                <span className={isNewspaper ? 'font-serif' : 'font-sans'}>
                  <strong>Visual Dossier Generation:</strong> Auto-compile retro oil portraits and blueprints matching the era styles using media models.
                </span>
              </div>
            </div>
          </section>

          {/* Credits Section */}
          <section className={
            isNewspaper 
              ? 'border border-primary-base/40 p-6 rounded-none flex flex-col gap-4' 
              : 'glass-panel p-6 rounded-2xl border border-border-color flex flex-col gap-4'
          }>
            <h2 className={`text-sm font-bold uppercase tracking-wider flex items-center gap-2 ${isNewspaper ? 'text-primary-base' : 'font-mono text-text-main'}`}>
              <Award size={16} className={isNewspaper ? 'text-primary-base' : 'text-accent-base'} />
              9. System Credits
            </h2>
            <div className={`text-xs leading-relaxed space-y-2.5 ${isNewspaper ? 'text-text-dim' : 'text-text-dim font-sans'}`}>
              <p>
                We acknowledge the leverage of the following tools and framework systems that made this prototype possible:
              </p>
              <div className="list-disc pl-4 space-y-1">
                <div><strong>Next.js 15</strong> & <strong>Tailwind CSS v4</strong> for the responsive client application.</div>
                <div><strong>Supabase PostgreSQL</strong> for instantaneous timeline relational storage.</div>
                <div><strong>Google Gemini Flash</strong> for lightning-fast multi-stage prompt generation.</div>
                <div><strong>Antigravity AI Agent</strong> for pair-programming and design iterations.</div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Newspaper Footer */}
      <footer className="w-full max-w-6xl mx-auto border-t-2 border-double border-primary-base/20 mt-8 pt-3.5 pb-1 text-center text-[9px] tracking-[0.22em] font-serif text-text-dim uppercase font-bold z-10">
        AI CLUB | SIT PUNE | AARUSHI | ADITYA | YESHWANT | v1.2.0 | 2026
      </footer>
    </div>
  );
}
