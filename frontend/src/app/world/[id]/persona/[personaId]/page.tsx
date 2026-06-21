'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Award, Shield, User, Heart, RotateCw, Skull, Handshake, Network } from 'lucide-react';
import CanvasGrid from '../../../../../components/ui/canvas-grid';
import { Persona } from '../../../../../types';
import { api } from '../../../../../lib/api';
import ChronosLogo from '../../../../../components/branding/chronos-logo';
import { useTheme } from '../../../../../context/theme-context';
import { getAudioEngine } from '../../../../../lib/audio-engine';

interface PageProps {
  params: Promise<{ id: string; personaId: string }>;
}

function InkSplatter({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 30c-5-15-20-10-25 5s10 25 25 20c15 5 30-10 25-25s-20-15-25 0z M20 20c-2-5-8-2-8 3s5 8 8 5 M80 25c2 4 8 1 7-4s-7-5-7 4 M30 70c-3 2-6-5-4-8s6 2 4 6 M75 75c5-1 3-8-2-7s-5 6 2 7" />
    </svg>
  );
}

function PersonaLogo({ name, role }: { name: string; role: string }) {
  const nameLower = name.toLowerCase();

  // 1. Apple / Apple Inc
  if (nameLower.includes('apple')) {
    return (
      <svg className="w-14 h-14 text-primary-base" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.52-.64.74-1.2 1.88-1.05 2.99 1.12.09 2.27-.57 3-1.45z" />
      </svg>
    );
  }

  // 2. NASA
  if (nameLower.includes('nasa')) {
    return (
      <svg className="w-14 h-14 text-primary-base" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
        <path d="M16 8l-8 8" />
        <path d="M8 8l8 8" />
      </svg>
    );
  }

  // 3. Rome / Caesar / Roman / SPQR
  if (nameLower.includes('caesar') || nameLower.includes('rome') || nameLower.includes('roman') || nameLower.includes('spqr')) {
    return (
      <svg className="w-14 h-14 text-primary-base" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 18c-2-3-2-8 2-11M18 18c2-3 2-8-2-11" strokeLinecap="round" />
        <path d="M12 5l2 3h-4l2-3z M8 10h8l1 4h-10l1-4z M10 14v4h4v-4h-4z" fill="currentColor" />
        <path d="M7 11l-3 4M17 11l3 4" strokeLinecap="round" />
      </svg>
    );
  }

  // 4. East India Company / British / Royal / Crown / Elizabeth
  if (nameLower.includes('east india') || nameLower.includes('british') || nameLower.includes('crown') || nameLower.includes('royal') || nameLower.includes('elizabeth') || nameLower.includes('king') || nameLower.includes('queen')) {
    return (
      <svg className="w-14 h-14 text-primary-base" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-5 4-5-6-5 6-5-4z" fill="currentColor" fillOpacity="0.1" />
        <path d="M3 20h18" strokeWidth="2" />
        <circle cx="12" cy="4" r="1" fill="currentColor" />
        <circle cx="2" cy="4" r="1" fill="currentColor" />
        <circle cx="22" cy="4" r="1" fill="currentColor" />
      </svg>
    );
  }

  // 5. Soviet / USSR / Stalin / Lenin
  if (nameLower.includes('soviet') || nameLower.includes('ussr') || nameLower.includes('stalin') || nameLower.includes('lenin')) {
    return (
      <svg className="w-14 h-14 text-primary-base" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2l2.5 6 6.5.5-5 4.5 1.5 6.5-5.5-3.5-5.5 3.5 1.5-6.5-5-4.5 6.5-.5z" fill="currentColor" fillOpacity="0.1" />
        <path d="M11 11c1.5-2.5 4-3.5 6-2.5s2.5 4 .5 6c-1.5 1.5-3.5 2-5.5 1.5" strokeLinecap="round" />
        <path d="M10 17l4-4M9 18l1.5-1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 6. United Nations / UN
  if (nameLower.includes('united nations') || nameLower.includes(' u.n.') || nameLower.includes('world council')) {
    return (
      <svg className="w-14 h-14 text-primary-base" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="8" strokeDasharray="3 3" />
        <circle cx="12" cy="12" r="5" />
        <path d="M12 3v18M3 12h18" strokeWidth="0.75" />
        <path d="M6 15c-1-1.5-1-4.5 1-6M18 15c1-1.5 1-4.5-1-6" strokeLinecap="round" />
      </svg>
    );
  }

  // 7. Google
  if (nameLower.includes('google')) {
    return (
      <svg className="w-14 h-14 text-primary-base" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.743-.079-1.306-.179-1.859l-10.614-.351z" />
      </svg>
    );
  }

  // 8. Microsoft
  if (nameLower.includes('microsoft')) {
    return (
      <svg className="w-13 h-13 text-primary-base" viewBox="0 0 23 23" fill="currentColor">
        <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
      </svg>
    );
  }

  // 9. Tesla
  if (nameLower.includes('tesla') || nameLower.includes('musk')) {
    return (
      <svg className="w-14 h-14 text-primary-base" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-1.5h2v1.5zm1.5-6c-.5 1-1.5 1.5-2.5 1.5h-1v-1.5h1c.5 0 1-.25 1.25-.75s.25-1-.25-1.25S10 8.5 9.5 9H8v-1.5h1.5c1.25 0 2.25.5 2.75 1.5s.25 2-.75 2.5z" />
      </svg>
    );
  }

  // 10. Meta
  if (nameLower.includes('meta') || nameLower.includes('facebook') || nameLower.includes('zuckerberg')) {
    return (
      <svg className="w-14 h-14 text-primary-base" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 12c-2-3-4-3-6 0s-2 6 0 6 4-3 6 0 4 3 6 0 2-6 0-6-4 3-6 0z" />
      </svg>
    );
  }

  // Fallbacks: Role-based crests
  if (role === 'SCIENTIST') {
    return (
      <svg className="w-14 h-14 text-primary-base" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx="12" cy="12" r="5" />
        <ellipse cx="12" cy="12" rx="9" ry="2.5" transform="rotate(30 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="2.5" transform="rotate(-30 12 12)" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (role === 'POLITICIAN') {
    return (
      <svg className="w-14 h-14 text-primary-base" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 2L4 5v6c0 5.5 3.5 10 8 11 4.5-1 8-5.5 8-11V5l-8-3z" fill="currentColor" fillOpacity="0.05" />
        <path d="M9 7h6v1H9z M10 8h4v9h-4z M9 17h6v1H9z" fill="currentColor" />
      </svg>
    );
  }

  if (role === 'BRAND') {
    return (
      <svg className="w-14 h-14 text-primary-base" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 5v14M7 9h10" />
        <path d="M7 9l-2 5h4l-2-5z M17 9l-2 5h4l-2-5z" fill="currentColor" fillOpacity="0.1" />
        <path d="M10 19h4" />
      </svg>
    );
  }

  return (
    <svg className="w-14 h-14 text-primary-base" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
      <path d="M20 20l-4-4" />
    </svg>
  );
}

const getRelationship = (roleA: string, roleB: string) => {
  if (roleA === roleB) {
    if (roleA === 'BRAND') return { type: 'enemy', label: 'Commercial Rivalry' };
    return { type: 'alliance', label: 'Faction Coalition' };
  }
  if ((roleA === 'POLITICIAN' && roleB === 'INFLUENCER') || (roleA === 'INFLUENCER' && roleB === 'POLITICIAN')) {
    return { type: 'enemy', label: 'Censorship & Dissident Tensions' };
  }
  if ((roleA === 'POLITICIAN' && roleB === 'SCIENTIST') || (roleA === 'SCIENTIST' && roleB === 'POLITICIAN')) {
    return { type: 'neutral', label: 'State Funding Oversight' };
  }
  if ((roleA === 'POLITICIAN' && roleB === 'BRAND') || (roleA === 'BRAND' && roleB === 'POLITICIAN')) {
    return { type: 'alliance', label: 'Industrial Subsidies & Lobbying' };
  }
  if ((roleA === 'SCIENTIST' && roleB === 'BRAND') || (roleA === 'BRAND' && roleB === 'SCIENTIST')) {
    return { type: 'alliance', label: 'Patent Licensing' };
  }
  if ((roleA === 'SCIENTIST' && roleB === 'INFLUENCER') || (roleA === 'INFLUENCER' && roleB === 'SCIENTIST')) {
    return { type: 'neutral', label: 'Technological Skepticism' };
  }
  if ((roleA === 'BRAND' && roleB === 'INFLUENCER') || (roleA === 'INFLUENCER' && roleB === 'BRAND')) {
    return { type: 'enemy', label: 'Consumer Boycott & Advocacy' };
  }
  return { type: 'neutral', label: 'Diplomatic Liaison' };
};

export default function PersonaPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const worldId = resolvedParams.id;
  const personaId = resolvedParams.personaId;

  const { theme, toggleTheme } = useTheme();

  const [persona, setPersona] = useState<(Persona & { posts?: any[] }) | null>(null);
  const [world, setWorld] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Premium Interactive States
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [revealedSecrets, setRevealedSecrets] = useState<{ [key: string]: boolean }>({});
  const [allPersonas, setAllPersonas] = useState<Persona[]>([]);
  const [hoveredNode, setHoveredNode] = useState<Persona | null>(null);
  const audioEngine = getAudioEngine();

  // Load all personas for relational net graph
  useEffect(() => {
    async function loadAllPersonas() {
      try {
        const data = await api.getWorldPersonas(worldId);
        setAllPersonas(data);
      } catch (err) {
        console.warn('Failed to load all personas for relational net:', err);
      }
    }
    loadAllPersonas();
  }, [worldId]);

  // Load World details for context-aware placeholders
  useEffect(() => {
    async function loadWorldDetails() {
      try {
        const data = await api.getWorld(worldId);
        setWorld(data);
      } catch (err) {
        console.warn('Failed to load world details on persona page:', err);
      }
    }
    loadWorldDetails();
  }, [worldId]);

  useEffect(() => {
    async function loadPersonaDetails() {
      if (personaId === 'local-persona-id') {
        // Return a mock observer persona matching the layout
        setPersona({
          id: 'local-persona-id',
          world_id: worldId,
          name: 'Temporal Observer',
          handle: 'temp_anchor_01',
          avatar: '',
          role: 'INFLUENCER',
          influence_score: 99,
          followers_count: 15420,
          following_count: 120,
          interests: ['temporal-mechanics', 'alternate-history', 'multiverse-surveillance'],
          bio: 'Assigned by the Chronology Preservation Council to observe, record, and verify alternative timelines without direct historical contamination.',
          personality: 'Maintain complete neutrality. Every divergence holds valuable data. Ensure all cogwheels keep turning.',
          posts: [
            {
              id: 'local-post-1',
              world_id: worldId,
              persona_id: 'local-persona-id',
              content: 'Chronology stabilization sequence initialized. Establishing secure lead-type anchors in this divergence reality.',
              media_url: null,
              media_type: 'TEXT',
              likes_count: 320,
              reposts_count: 55,
              created_at: new Date().toISOString(),
            },
            {
              id: 'local-post-2',
              world_id: worldId,
              persona_id: 'local-persona-id',
              content: 'Calibration complete. Ink density levels at 0.77. Factions are active. Reporting all observations to the console.',
              media_url: null,
              media_type: 'TEXT',
              likes_count: 145,
              reposts_count: 24,
              created_at: new Date(Date.now() - 3600000).toISOString(),
            }
          ]
        });
        setLoading(false);
        return;
      }

      try {
        const data = await api.getPersona(personaId);
        if (data) {
          setPersona(data);
        } else {
          setError('Persona dossier not found.');
        }
      } catch (err) {
        console.error('Failed to load persona dossier:', err);
        setError('Failed to retrieve persona dossier from the timeline database.');
      } finally {
        setLoading(false);
      }
    }
    loadPersonaDetails();
  }, [personaId]);

  const getAlliancesAndEnemies = (role: string) => {
    switch (role) {
      case 'SCIENTIST':
        return {
          alliances: 'Tech Guild & Academy Matrix',
          enemies: 'Traditionalist Coalition',
        };
      case 'POLITICIAN':
        return {
          alliances: 'Senate Majority Faction',
          enemies: 'Opposition Assembly',
        };
      case 'BRAND':
        return {
          alliances: 'Merchant Trade Guild',
          enemies: 'Antitrust Cartels',
        };
      case 'INFLUENCER':
      default:
        return {
          alliances: 'Free Writers Syndicate',
          enemies: 'State Censorship Council',
        };
    }
  };

  const roleLabel = (role: string) => {
    switch (role) {
      case 'SCIENTIST': return 'Imperial Engineer / Scientist';
      case 'POLITICIAN': return 'State Chancellor / Senator';
      case 'BRAND': return 'Industrial Syndicate / Brand';
      default: return 'Public Influencer / Citizen';
    }
  };

  const getHistoricalRole = () => {
    if (!persona) return '';
    const name = persona.name;
    const role = roleLabel(persona.role);
    const bioText = persona.bio;
    const cleanBio = bioText.endsWith('.') ? bioText.slice(0, -1) : bioText;
    return `As a prominent ${role.toLowerCase()}, ${name} has significantly influenced the alternate timeline. They are recognized for their dossier record: "${cleanBio}."`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-serif text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-none border border-primary-base border-t-transparent animate-spin" />
          <span className="text-text-dim animate-pulse">Retrieving Dossier Dossier...</span>
        </div>
      </div>
    );
  }

  if (error || !persona) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-serif text-sm p-4 text-center">
        <div className="flex flex-col items-center gap-4 max-w-md border-4 border-double border-primary-base p-8 bg-[var(--card-bg)]">
          <Shield className="text-primary-base" size={36} />
          <h2 className="text-lg font-bold text-text-main uppercase">Dossier Corruption</h2>
          <span className="text-text-dim text-xs leading-relaxed">{error || 'Unable to retrieve dossier records for this persona.'}</span>
          <button
            onClick={() => router.push(`/world/${worldId}`)}
            className="border-2 border-primary-base px-6 py-2.5 font-serif font-bold uppercase tracking-wider cursor-pointer mt-2 hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300"
          >
            Return to Timeline Console
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="md:h-screen min-h-screen md:overflow-y-auto overflow-x-hidden relative flex flex-col p-4 md:p-6 select-none bg-background text-primary-base border-8 border-double border-primary-base font-serif">
      {/* Local styles for animations */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 8px; opacity: 0.3; }
          50% { top: 96px; opacity: 0.95; }
        }
        @keyframes wave-flow {
          from { transform: translateX(0); }
          to { transform: translateX(-50px); }
        }
        @keyframes needle-quake {
          0%, 100% { margin-left: 0px; margin-top: 0px; }
          25% { margin-left: 0.6px; margin-top: -0.6px; }
          75% { margin-left: -0.6px; margin-top: 0.6px; }
        }
        @keyframes stamp-slam {
          0% { transform: scale(3) rotate(-25deg); opacity: 0; }
          100% { transform: scale(1) rotate(-10deg); opacity: 0.18; }
        }
      `}</style>

      {/* Background canvas */}
      <CanvasGrid />

      {/* Page Header */}
      <header className="w-full max-w-none mx-auto flex flex-col items-center border-b-4 border-double border-primary-base pb-3.5 mb-6 z-10 text-primary-base font-serif">
        <div className="flex justify-between w-full text-[10px] uppercase tracking-widest border-b border-primary-base/20 pb-2 mb-3 items-center font-bold">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/world/${worldId}`)}
              className="border border-primary-base px-3 py-1 font-serif text-[10px] tracking-wider font-bold uppercase hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft size={10} />
              <span>Return to Dispatch</span>
            </button>
          </div>
          <span>DOSSIER TELEMETRY // SECURE INDEX</span>
        </div>
        
        <div className="flex items-center justify-between w-full py-2.5">
          <div className="hidden md:block w-24 h-[1px] bg-primary-base/30" />
          <div className="flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-serif text-center leading-none text-text-main flex items-center justify-center gap-3.5">
              <ChronosLogo size={60} className="text-primary-base shrink-0" />
              <span>TEMPORAL DOSSIER FILE</span>
            </h1>
            <p className="text-[10px] tracking-[0.2em] uppercase mt-3 text-center text-text-dim font-bold italic">
              Historical record and behavioral intelligence of alternate timelines
            </p>
          </div>
          <div className="hidden md:block w-24 h-[1px] bg-primary-base/30" />
        </div>
      </header>

      {/* Main content grid */}
      <div className="flex-1 w-full max-w-none mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 z-10 relative">
        
        {/* Profile Card & Bio Details (5 Cols) */}
        <aside className="col-span-1 md:col-span-5 flex flex-col gap-6">
          {/* Main Dossier Card */}
          <div className="border border-primary-base/20 p-6 rounded-none bg-[var(--card-bg)] flex flex-col items-center text-center gap-4 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 border-b border-l border-primary-base/20 rounded-none bg-black/[0.01] flex items-center justify-center text-primary-base font-serif text-[9px] font-bold">
              ID #{personaId.slice(0, 4)}
            </div>

            {/* Steampunk Biometric Scanner Avatar */}
            <div 
              onClick={() => {
                if (scanning || scanDone) return;
                setScanning(true);
                audioEngine?.playClick();
                let beepInterval = setInterval(() => {
                  audioEngine?.playClick();
                }, 180);
                setTimeout(() => {
                  clearInterval(beepInterval);
                  setScanning(false);
                  setScanDone(true);
                  audioEngine?.playPageRustle();
                }, 1600);
              }}
              className={`w-28 h-28 my-3 border-2 border-primary-base relative flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${
                scanDone ? 'bg-primary-base/5 shadow-[0_0_12px_rgba(var(--glow-color),0.1)]' : 'bg-black/[0.02]'
              } hover:border-primary-base group`}
            >
              {/* Corner brackets */}
              <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-primary-base/40 group-hover:border-primary-base" />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-primary-base/40 group-hover:border-primary-base" />
              <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-primary-base/40 group-hover:border-primary-base" />
              <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-primary-base/40 group-hover:border-primary-base" />

              {scanning ? (
                <>
                  {/* Glowing vertical scan line */}
                  <div className="absolute left-0 right-0 h-[2.5px] bg-primary-base shadow-[0_0_8px_rgba(var(--glow-color),0.8)] animate-[scan_1.5s_ease-in-out_infinite]" />
                  {/* Fingerprint SVG */}
                  <svg className="w-14 h-14 text-primary-base animate-pulse opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2h2v1.93zm4.9-3.24c-.16-.36-.45-.63-.82-.77L15 14v-3c0-.55-.45-1-1-1h-3V8h2c1.1 0 2-.9 2-2V4.07c3.27.75 5.75 3.51 5.97 6.93h-1.97c-.03-.43-.13-.84-.28-1.22l-1.39.83c.12.33.21.68.25 1.05h1.99c-.19.98-.62 1.87-1.22 2.62l-1.45-1.45z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[7px] font-mono tracking-widest text-primary-base mt-1.5 animate-pulse uppercase">SCANNING...</span>
                </>
              ) : scanDone ? (
                <>
                  <PersonaLogo name={persona?.name || ''} role={persona?.role || ''} />
                  <div className="absolute bottom-1.5 text-[6.5px] font-serif uppercase tracking-widest text-primary-base font-bold bg-primary-base/10 px-1 border border-primary-base/20">
                    DECRYPTED
                  </div>
                </>
              ) : (
                <>
                  <svg className="w-14 h-14 text-primary-base/40 group-hover:text-primary-base/80 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2h2v1.93zm4.9-3.24c-.16-.36-.45-.63-.82-.77L15 14v-3c0-.55-.45-1-1-1h-3V8h2c1.1 0 2-.9 2-2V4.07c3.27.75 5.75 3.51 5.97 6.93h-1.97c-.03-.43-.13-.84-.28-1.22l-1.39.83c.12.33.21.68.25 1.05h1.99c-.19.98-.62 1.87-1.22 2.62l-1.45-1.45z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[7px] font-mono tracking-widest text-text-dim mt-1.5 group-hover:text-primary-base uppercase transition-colors duration-300">CLICK TO DECRYPT</span>
                </>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold font-serif text-primary-base">{persona?.name}</h2>
              <span className="text-xs text-text-dim font-serif">@{persona?.handle}</span>
            </div>

            <span className="px-3.5 py-1 border border-primary-base/20 bg-black/[0.01] text-text-dim font-serif text-[10px] rounded-none uppercase tracking-wider font-bold">
              {roleLabel(persona?.role || '')}
            </span>

            {/* Steampunk Dial Gauges */}
            <div className="grid grid-cols-3 w-full gap-2 border-t border-b border-primary-base/20 py-4 font-serif mt-2">
              {/* Gauge 1: Followers */}
              {(() => {
                const followersCount = persona?.followers_count ?? 0;
                const followersPercent = Math.min((followersCount / 50000) * 100, 100);
                const followersRotation = (followersPercent / 100) * 240 - 120;
                return (
                  <div className="flex flex-col items-center gap-1.5 group/g1">
                    <span className="text-[8px] text-text-dim font-bold uppercase tracking-wider">Followers</span>
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 36 36" style={{ transform: 'rotate(-120deg)' }}>
                        <path className="text-primary-base/10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="66.7 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-primary-base transition-all duration-1000 ease-out" strokeDasharray={`${((followersPercent / 100) * 66.7).toFixed(3)} 100`} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 group-hover/g1:animate-[needle-quake_0.15s_infinite]" style={{ transform: `rotate(${followersRotation.toFixed(1)}deg)` }}>
                        <div className="w-[1.5px] h-6 bg-primary-base -translate-y-2.5 rounded-full animate-pulse" />
                        <div className="absolute w-2 h-2 rounded-full bg-primary-base border border-[var(--bg-color)]" />
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-primary-base mt-0.5">
                      {((persona?.followers_count ?? 0) / 1000).toFixed(1)}k
                    </div>
                  </div>
                );
              })()}

              {/* Gauge 2: Influence */}
              {(() => {
                const influenceScore = persona?.influence_score ?? 50;
                const influenceRotation = (influenceScore / 100) * 240 - 120;
                return (
                  <div className="flex flex-col items-center gap-1.5 group/g2">
                    <span className="text-[8px] text-text-dim font-bold uppercase tracking-wider">Influence</span>
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 36 36" style={{ transform: 'rotate(-120deg)' }}>
                        <path className="text-primary-base/10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="66.7 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-primary-base transition-all duration-1000 ease-out" strokeDasharray={`${((influenceScore / 100) * 66.7).toFixed(3)} 100`} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 group-hover/g2:animate-[needle-quake_0.15s_infinite]" style={{ transform: `rotate(${influenceRotation.toFixed(1)}deg)` }}>
                        <div className="w-[1.5px] h-6 bg-primary-base -translate-y-2.5 rounded-full" />
                        <div className="absolute w-2 h-2 rounded-full bg-primary-base border border-[var(--bg-color)]" />
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-primary-base mt-0.5">{influenceScore}%</div>
                  </div>
                );
              })()}

              {/* Gauge 3: Approval */}
              {(() => {
                const followersCount = persona?.followers_count ?? 0;
                const approvalScore = 40 + (followersCount % 55);
                const approvalRotation = (approvalScore / 100) * 240 - 120;
                return (
                  <div className="flex flex-col items-center gap-1.5 group/g3">
                    <span className="text-[8px] text-text-dim font-bold uppercase tracking-wider">Approval</span>
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-full h-full" viewBox="0 0 36 36" style={{ transform: 'rotate(-120deg)' }}>
                        <path className="text-primary-base/10" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="66.7 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-primary-base transition-all duration-1000 ease-out" strokeDasharray={`${((approvalScore / 100) * 66.7).toFixed(3)} 100`} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 group-hover/g3:animate-[needle-quake_0.15s_infinite]" style={{ transform: `rotate(${approvalRotation.toFixed(1)}deg)` }}>
                        <div className="w-[1.5px] h-6 bg-primary-base -translate-y-2.5 rounded-full" />
                        <div className="absolute w-2 h-2 rounded-full bg-primary-base border border-[var(--bg-color)]" />
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-primary-base mt-0.5">{approvalScore}%</div>
                  </div>
                );
              })()}
            </div>

            {/* Interests tags */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
              {(persona?.interests ?? []).map((int) => (
                <span key={int} className="px-2 py-0.5 border border-primary-base/20 bg-black/[0.02] rounded-none text-[9px] font-serif text-text-dim">
                  #{int}
                </span>
              ))}
            </div>
          </div>

          {/* Dossier Intel (Beliefs, Alliances, Enemies) */}
          <div className="border border-primary-base/20 p-5 rounded-none bg-[var(--card-bg)] flex flex-col gap-4 shadow-sm">
            <h3 className="font-serif text-xs uppercase tracking-wider text-primary-base font-bold border-b border-primary-base/20 pb-2">
              Dossier Intel
            </h3>

            {/* Biography with Redacted details */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-serif text-text-dim font-bold uppercase flex items-center gap-1">
                <User size={10} className="text-primary-base" />
                History Record
              </span>
              <p className="text-xs text-primary-base/90 leading-relaxed font-serif relative">
                {persona?.bio}{' '}
                <span 
                  onClick={() => {
                    const key = 'bio-secret';
                    setRevealedSecrets(prev => ({ ...prev, [key]: !prev[key] }));
                    audioEngine?.playClick();
                  }}
                  className={`cursor-help transition-all duration-300 relative inline-block text-[10px] px-1 font-serif uppercase tracking-wider ${
                    revealedSecrets['bio-secret']
                      ? 'bg-primary-base/10 text-primary-base font-bold border border-primary-base/25'
                      : 'bg-primary-base text-transparent select-none'
                  }`}
                  title="Click to decrypt secret dossier file"
                >
                  {revealedSecrets['bio-secret']
                    ? `[WARNING: Subject has initiated contact with divergent observers in ${world?.era || 'the timeline'}]`
                    : 'REDACTED TELEMETRY CLASSIFIED'}
                </span>
              </p>
            </div>

            {/* Core Beliefs with Redacted details */}
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-[9px] font-serif text-text-dim font-bold uppercase flex items-center gap-1">
                <Shield size={10} className="text-primary-base" />
                Philosophical Alignment
              </span>
              <p className="text-xs text-text-dim leading-relaxed font-serif italic">
                "{persona?.personality || 'The mechanical calculation yields truth. Let no cogwheel fail.'}"{' '}
                <span 
                  onClick={() => {
                    const key = 'alignment-secret';
                    setRevealedSecrets(prev => ({ ...prev, [key]: !prev[key] }));
                    audioEngine?.playClick();
                  }}
                  className={`cursor-help transition-all duration-300 relative inline-block text-[10px] px-1 font-serif uppercase tracking-wider not-italic ${
                    revealedSecrets['alignment-secret']
                      ? 'bg-primary-base/10 text-primary-base font-bold border border-primary-base/25'
                      : 'bg-primary-base text-transparent select-none'
                  }`}
                  title="Click to decrypt secret alignment log"
                >
                  {revealedSecrets['alignment-secret']
                    ? `[LOG: Core allegiance shifts towards the ${getAlliancesAndEnemies(persona?.role || '').enemies.split(' ')[0] || 'State'} faction]`
                    : 'CLASSIFIED ALIGNMENT FILE'}
                </span>
              </p>
            </div>

            {/* Oscilloscope Stream */}
            <div className="flex flex-col gap-1 border-t border-primary-base/20 pt-3 mt-1">
              <span className="text-[9px] font-serif text-text-dim font-bold uppercase flex items-center justify-between">
                <span>Dossier Telemetry Link</span>
                <span className="text-[8px] font-mono text-primary-base animate-pulse">98.4% SYNC</span>
              </span>
              <div className="relative h-10 w-full bg-black/10 border border-primary-base/10 rounded-none overflow-hidden flex items-center justify-center">
                <svg className="w-full h-full text-primary-base/50" viewBox="0 0 200 40" preserveAspectRatio="none">
                  <line x1="0" y1="20" x2="200" y2="20" stroke="currentColor" strokeWidth="0.5" className="opacity-20" />
                  <path
                    d="M -50,20 Q -25,5 0,20 T 50,20 T 100,20 T 150,20 T 200,20 T 250,20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    className="animate-[wave-flow_3s_linear_infinite]"
                  />
                </svg>
              </div>
            </div>

            {/* Alliances & Enemies */}
            <div className="grid grid-cols-2 gap-3 mt-1.5 border-t border-primary-base/20 pt-3">
              <div className="flex flex-col gap-1 font-serif text-[10px]">
                <span className="text-text-dim font-bold flex items-center gap-1 uppercase">
                  <Handshake size={10} />
                  ALLIANCES
                </span>
                <span className="text-primary-base font-bold">{getAlliancesAndEnemies(persona?.role || '').alliances}</span>
              </div>
              <div className="flex flex-col gap-1 font-serif text-[10px]">
                <span className="text-text-dim font-bold flex items-center gap-1 uppercase">
                  <Skull size={10} />
                  ENEMIES
                </span>
                <span className="text-primary-base font-bold">{getAlliancesAndEnemies(persona?.role || '').enemies}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Role in World History & Recent Feed Posts (7 Cols) */}
        <main className="col-span-1 md:col-span-7 flex flex-col gap-6 relative">
          {/* Ink splatters decoration */}
          <InkSplatter className="absolute -bottom-8 -right-8 w-44 h-44 text-primary-base/[0.03] pointer-events-none select-none z-0" />
          <InkSplatter className="absolute -top-12 -left-12 w-36 h-36 text-primary-base/[0.02] pointer-events-none select-none z-0" />

          {/* Classified document stamp in background */}
          <div 
            className="absolute top-2 right-4 border-4 border-double border-red-700/20 text-red-700/20 px-4 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.2em] rounded-md z-0 pointer-events-none select-none"
            style={{ animation: 'stamp-slam 0.6s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards' }}
          >
            CONFIDENTIAL
          </div>

          {/* Core Feature: Role in World History */}
          <div className="border-2 border-primary-base p-6 rounded-none bg-[var(--card-bg)] flex flex-col gap-3 relative overflow-hidden shadow-sm z-10">
            <div className="flex items-center gap-2 border-b border-primary-base/20 pb-2.5">
              <Award size={16} className="text-primary-base" />
              <h3 className="font-serif text-xs uppercase tracking-wider text-primary-base font-bold">
                Role in World History
              </h3>
            </div>
            
            <p className="text-sm font-serif text-primary-base leading-relaxed italic first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none">
              {getHistoricalRole()}
            </p>
            
            <div className="flex items-center justify-between font-serif text-[9px] text-text-dim font-bold pt-2.5 border-t border-primary-base/10">
              <span>TEMPORAL INFLUENCE CATEGORY: CIVILIZATION ANCHOR</span>
              <span className="text-primary-base">HISTORICAL SIGNIFICANCE: HIGH</span>
            </div>
          </div>

          {/* Interactive Relational Net (Faction Map) */}
          {(() => {
            const currentPersonaId = persona?.id || 'local-persona-id';
            const personasList = (allPersonas.length > 0 ? allPersonas : [
              { id: 'local-persona-id', name: 'Temporal Observer', role: 'INFLUENCER', handle: 'temp_anchor_01', world_id: '', avatar: '', bio: '', followers_count: 0, following_count: 0, influence_score: 0, interests: [], personality: '' },
              { id: 'mock-1', name: 'Archivist Vance', role: 'SCIENTIST', handle: 'vance_tech', world_id: '', avatar: '', bio: '', followers_count: 0, following_count: 0, influence_score: 0, interests: [], personality: '' },
              { id: 'mock-2', name: 'Chancellor Tiberius', role: 'POLITICIAN', handle: 'tiberius_state', world_id: '', avatar: '', bio: '', followers_count: 0, following_count: 0, influence_score: 0, interests: [], personality: '' },
              { id: 'mock-3', name: 'Syndicate Director', role: 'BRAND', handle: 'chrono_syndicate', world_id: '', avatar: '', bio: '', followers_count: 0, following_count: 0, influence_score: 0, interests: [], personality: '' },
              { id: 'mock-4', name: 'Broadcaster Echo', role: 'INFLUENCER', handle: 'echo_dispatch', world_id: '', avatar: '', bio: '', followers_count: 0, following_count: 0, influence_score: 0, interests: [], personality: '' }
            ]) as Persona[];
            
            const otherNodes = personasList.filter(p => p.id !== currentPersonaId).slice(0, 5);
            const centerX = 200;
            const centerY = 110;
            const radius = 75;

            return (
              <div className="border border-primary-base/20 p-5 rounded-none bg-[var(--card-bg)] flex flex-col gap-3.5 shadow-sm z-10">
                <div className="flex items-center justify-between border-b border-primary-base/20 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Network size={14} className="text-primary-base" />
                    <h3 className="font-serif text-xs uppercase tracking-wider text-primary-base font-bold">
                      Temporal Relational Net (Faction Map)
                    </h3>
                  </div>
                  <span className="text-[8px] font-mono text-primary-base/60 uppercase">System: Graph Active</span>
                </div>

                <div className="relative w-full h-[220px] bg-black/[0.02] border border-primary-base/10 flex items-center justify-center overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 400 220">
                    {/* Concentric grid lines */}
                    <circle cx={centerX} cy={centerY} r={radius} className="fill-none stroke-primary-base/5 stroke-[0.75] stroke-dashed" />
                    <circle cx={centerX} cy={centerY} r={radius - 30} className="fill-none stroke-primary-base/5 stroke-[0.5] stroke-dashed" />
                    
                    {/* Relationship connection lines */}
                    {otherNodes.map((otherNode, idx) => {
                      const angle = (idx * 2 * Math.PI) / Math.max(otherNodes.length, 1) - Math.PI / 2;
                      const x = centerX + radius * Math.cos(angle);
                      const y = centerY + radius * Math.sin(angle);
                      const rel = getRelationship(persona?.role || 'INFLUENCER', otherNode.role);
                      
                      return (
                        <g key={otherNode.id}>
                          <line
                            x1={centerX}
                            y1={centerY}
                            x2={x}
                            y2={y}
                            className={rel.type === 'enemy' ? 'stroke-red-600/30 dark:stroke-red-500/30' : rel.type === 'neutral' ? 'stroke-yellow-600/30' : 'stroke-primary-base/30'}
                            strokeWidth={1.5}
                            strokeDasharray={rel.type === 'enemy' ? "4 4" : rel.type === 'neutral' ? "1 5" : "6 3"}
                          >
                            <animate
                              attributeName="stroke-dashoffset"
                              values="100;0"
                              dur={rel.type === 'enemy' ? "2.5s" : rel.type === 'neutral' ? "8s" : "4s"}
                              repeatCount="indefinite"
                            />
                          </line>
                        </g>
                      );
                    })}

                    {/* Center Node (Current Persona) */}
                    <g transform={`translate(${centerX}, ${centerY})`}>
                      <circle cx={0} cy={0} r={26} className="fill-none stroke-primary-base/20 animate-pulse stroke-[1.5]" />
                      <circle cx={0} cy={0} r={18} className="fill-[var(--card-bg)] stroke-primary-base stroke-2" />
                      <text textAnchor="middle" dy=".3em" className="fill-primary-base text-[10px] font-bold font-serif select-none">
                        {(persona?.name || 'Observer').split(' ').map(n => n[0]).join('')}
                      </text>
                    </g>

                    {/* Outer Nodes */}
                    {otherNodes.map((otherNode, idx) => {
                      const angle = (idx * 2 * Math.PI) / Math.max(otherNodes.length, 1) - Math.PI / 2;
                      const x = centerX + radius * Math.cos(angle);
                      const y = centerY + radius * Math.sin(angle);
                      const isHovered = hoveredNode?.id === otherNode.id;

                      return (
                        <g key={otherNode.id}>
                          <circle
                            cx={x}
                            cy={y}
                            r={isHovered ? 17 : 14}
                            className={`fill-[var(--card-bg)] stroke-primary-base transition-all duration-300 cursor-pointer ${
                              isHovered ? 'stroke-[2px] shadow-md fill-primary-base/5' : 'stroke-[1.2px]'
                            }`}
                            onMouseEnter={() => {
                              setHoveredNode(otherNode);
                              audioEngine?.playClick();
                            }}
                            onMouseLeave={() => setHoveredNode(null)}
                            onClick={() => {
                              audioEngine?.playPageRustle();
                              router.push(`/world/${worldId}/persona/${otherNode.id}`);
                            }}
                          />
                          <text
                            x={x}
                            y={y}
                            textAnchor="middle"
                            dy=".3em"
                            className="fill-primary-base text-[8px] font-bold font-serif pointer-events-none select-none"
                          >
                            {otherNode.name.split(' ').map(n => n[0]).join('')}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {hoveredNode ? (
                  <div className="p-3 bg-primary-base/5 border border-primary-base/20 font-serif text-[11px] rounded-none animate-fadeIn">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-primary-base uppercase">Link: {getRelationship(persona?.role || 'INFLUENCER', hoveredNode.role).label}</span>
                      <span className={`text-[8px] px-1 border uppercase font-bold ${
                        getRelationship(persona?.role || 'INFLUENCER', hoveredNode.role).type === 'enemy'
                          ? 'border-red-600/30 text-red-600 bg-red-600/5'
                          : getRelationship(persona?.role || 'INFLUENCER', hoveredNode.role).type === 'neutral'
                          ? 'border-yellow-600/30 text-yellow-600 bg-yellow-600/5'
                          : 'border-primary-base/30 text-primary-base bg-primary-base/5'
                      }`}>
                        {getRelationship(persona?.role || 'INFLUENCER', hoveredNode.role).type}
                      </span>
                    </div>
                    <p className="text-text-dim leading-relaxed">
                      Subject: <span className="font-bold text-primary-base">{hoveredNode.name}</span> (@{hoveredNode.handle}). Hovering establishes data stream telemetry. Click node to navigate directly to their temporal dossier records.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-black/[0.01] border border-primary-base/10 border-dashed font-serif text-[10px] text-text-dim italic text-center rounded-none tracking-wider uppercase font-bold py-4">
                    SELECT OR HOVER NODE TO ANALYZE TEMPORAL CORRELATION NET
                  </div>
                )}
              </div>
            );
          })()}

          {/* Persona's Feed Posts */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-xs uppercase tracking-wider text-primary-base font-bold border-b border-primary-base/20 pb-3">
              Recent Net Transmissions
            </h3>

            {persona?.posts && persona.posts.length > 0 ? (
              <div className="flex flex-col gap-4">
                {persona.posts.map((post) => (
                  <div key={post.id} className="border border-primary-base/20 p-5 rounded-none bg-[var(--card-bg)] flex flex-col gap-3 shadow-sm">
                    <p className="text-sm text-primary-base leading-relaxed font-serif first-letter:text-2xl first-letter:font-bold first-letter:float-left first-letter:mr-1.5 first-letter:leading-none">{post.content}</p>
                    <div className="flex items-center gap-6 font-serif text-xs text-text-dim pt-2 border-t border-primary-base/10 font-bold">
                      <div className="flex items-center gap-1.5">
                        <Heart size={12} className="text-primary-base" />
                        <span>{post.likes_count}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <RotateCw size={12} className="text-primary-base" />
                        <span>{post.reposts_count}</span>
                      </div>
                      <span className="text-[10px] text-text-dim ml-auto font-normal" suppressHydrationWarning>
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border border-primary-base/20 bg-[var(--card-bg)] text-center font-serif text-xs text-text-dim italic">
                No recent transmissions detected.
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Newspaper Footer */}
      <footer className="w-full max-w-none mx-auto border-t-2 border-double border-primary-base/20 mt-8 pt-3.5 pb-1 text-center text-[9px] tracking-[0.22em] font-serif text-text-dim uppercase font-bold z-10">
        AI CLUB | SIT PUNE | AARUSHI | ADITYA | YESHWANT | v1.2.0 | 2026
      </footer>
    </div>
  );
}
