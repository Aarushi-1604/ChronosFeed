'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Award, Shield, User, Heart, RotateCw, Skull, Handshake } from 'lucide-react';
import CanvasGrid from '../../../../../components/ui/canvas-grid';
import { Persona } from '../../../../../types';
import { api } from '../../../../../lib/api';
import ChronosLogo from '../../../../../components/branding/chronos-logo';
import { useTheme } from '../../../../../context/theme-context';

interface PageProps {
  params: Promise<{ id: string; personaId: string }>;
}

export default function PersonaPage({ params }: PageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const worldId = resolvedParams.id;
  const personaId = resolvedParams.personaId;

  const { theme, toggleTheme } = useTheme();

  const [persona, setPersona] = useState<(Persona & { posts?: any[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      {/* Background canvas */}
      <CanvasGrid />

      {/* Page Header */}
      <header className="w-full max-w-5xl mx-auto flex flex-col items-center border-b-4 border-double border-primary-base pb-3.5 mb-6 z-10 text-primary-base font-serif">
        <div className="flex justify-between w-full text-[10px] uppercase tracking-widest border-b border-primary-base/20 pb-2 mb-3 items-center font-bold">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push(`/world/${worldId}`)}
              className="border border-primary-base px-3 py-1 font-serif text-[10px] tracking-wider font-bold uppercase hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer flex items-center gap-1"
            >
              <ArrowLeft size={10} />
              <span>Return to Dispatch</span>
            </button>
            <button
              onClick={() => router.push('/developers')}
              className="border border-primary-base px-3 py-1 font-serif text-[10px] tracking-wider font-bold uppercase hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer"
            >
              Developer Portal
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="border border-primary-base px-3 py-1 font-serif text-[10px] tracking-wider font-bold uppercase hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer flex items-center gap-1"
            >
              {theme === 'newspaper' ? '☾ Dark Press' : '☼ Light Press'}
            </button>
          </div>
          <span>DOSSIER TELEMETRY // SECURE INDEX</span>
        </div>
        
        <div className="flex items-center justify-between w-full py-1">
          <div className="hidden md:block w-24 h-[1px] bg-primary-base/30" />
          <div className="flex flex-col items-center">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight font-serif text-center leading-none text-text-main flex items-center gap-3">
              <ChronosLogo size={40} className="text-primary-base" />
              TEMPORAL DOSSIER FILE
            </h1>
            <p className="text-[10px] tracking-[0.2em] uppercase mt-2.5 text-center text-text-dim font-bold italic">
              Historical record and behavioral intelligence of alternate timelines
            </p>
          </div>
          <div className="hidden md:block w-24 h-[1px] bg-primary-base/30" />
        </div>
      </header>

      {/* Main content grid */}
      <div className="flex-1 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 z-10 relative">
        
        {/* Profile Card & Bio Details (5 Cols) */}
        <aside className="col-span-1 md:col-span-5 flex flex-col gap-6">
          {/* Main Dossier Card */}
          <div className="border border-primary-base/20 p-6 rounded-none bg-[var(--card-bg)] flex flex-col items-center text-center gap-4 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-24 h-24 border-b border-l border-primary-base/20 rounded-none bg-black/[0.01] flex items-center justify-center text-primary-base font-serif text-xs font-bold">
              ID #{personaId.slice(0, 4)}
            </div>

            {/* Large Avatar */}
            <div className="w-24 h-24 rounded-none border-2 border-primary-base bg-[var(--bg-color)] flex items-center justify-center font-serif text-3xl font-extrabold text-primary-base my-3">
              {persona?.name.charAt(0)}
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="text-2xl font-bold font-serif text-primary-base">{persona?.name}</h2>
              <span className="text-xs text-text-dim font-serif">@{persona?.handle}</span>
            </div>

            <span className="px-3.5 py-1 border border-primary-base/20 bg-black/[0.01] text-text-dim font-serif text-[10px] rounded-none uppercase tracking-wider font-bold">
              {roleLabel(persona?.role || '')}
            </span>

            {/* Profile Statistics */}
            <div className="grid grid-cols-3 w-full gap-4 border-t border-b border-primary-base/20 py-4 font-serif mt-2">
              <div>
                <div className="text-[9px] text-text-dim font-bold uppercase">Followers</div>
                <div className="text-sm font-bold text-primary-base">{(persona?.followers_count ?? 0).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-[9px] text-text-dim font-bold uppercase">Influence</div>
                <div className="text-sm font-bold text-primary-base">{persona?.influence_score}%</div>
              </div>
              <div>
                <div className="text-[9px] text-text-dim font-bold uppercase">Approval</div>
                <div className="text-sm font-bold text-primary-base">74%</div>
              </div>
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

            {/* Biography */}
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-serif text-text-dim font-bold uppercase flex items-center gap-1">
                <User size={10} className="text-primary-base" />
                History Record
              </span>
              <p className="text-xs text-primary-base/90 leading-relaxed font-serif">{persona?.bio}</p>
            </div>

            {/* Core Beliefs */}
            <div className="flex flex-col gap-1 mt-1">
              <span className="text-[9px] font-serif text-text-dim font-bold uppercase flex items-center gap-1">
                <Shield size={10} className="text-primary-base" />
                Philosophical Alignment
              </span>
              <p className="text-xs text-text-dim leading-relaxed font-serif italic">
                "{persona?.personality || 'The mechanical calculation yields truth. Let no cogwheel fail.'}"
              </p>
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
        <main className="col-span-1 md:col-span-7 flex flex-col gap-6">
          {/* Core Feature: Role in World History */}
          <div className="border-2 border-primary-base p-6 rounded-none bg-[var(--card-bg)] flex flex-col gap-3 relative overflow-hidden shadow-sm">
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
      <footer className="w-full max-w-5xl mx-auto border-t-2 border-double border-primary-base/20 mt-8 pt-3.5 pb-1 text-center text-[9px] tracking-[0.22em] font-serif text-text-dim uppercase font-bold z-10">
        AI CLUB | SIT PUNE | AARUSHI | ADITYA | YESHWANT | v1.2.0 | 2026
      </footer>
    </div>
  );
}
