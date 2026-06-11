'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, Info, ShieldAlert, Newspaper, Globe, Menu, X } from 'lucide-react';
import { useTheme } from '../../../context/theme-context';
import CanvasGrid from '../../../components/ui/canvas-grid';
import TimelineSidebar from '../../../components/dashboard/timeline-sidebar';
import FeedColumn from '../../../components/dashboard/feed-column';
import IntelligencePanel from '../../../components/dashboard/intelligence-panel';
import { FeedItem } from '../../../components/cards/feed-card';
import { World, Post, News, Ad } from '../../../types';
import { api } from '../../../lib/api';
import { interleaveContent } from '../../../lib/feed/interleaveContent';
import ChronosLogo from '../../../components/branding/chronos-logo';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function WorldPage({ params }: PageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isCompiled = true;
  const resolvedParams = use(params);
  const worldId = resolvedParams.id;

  const { theme, setTheme, toggleTheme } = useTheme();

  // World Data & State
  const [world, setWorld] = useState<World | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Feed Items & Pagination State
  const [posts, setPosts] = useState<Post[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [feedLoading, setFeedLoading] = useState(true);

  // Derive interleaved feed items dynamically
  const feedItems = React.useMemo(() => {
    return interleaveContent(posts, ads, news);
  }, [posts, ads, news]);

  // Mobile navigation panels toggles
  const [showMobileTimeline, setShowMobileTimeline] = useState(false);
  const [showMobileIntelligence, setShowMobileIntelligence] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  // Populate formatted date only on client to prevent SSR hydration mismatch
  useEffect(() => {
    setFormattedDate(new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  }, []);

  // 1. Fetch World & Theme initialization
  useEffect(() => {
    let active = true;

    async function fetchWorldDetails() {
      try {
        const data = await api.getWorld(worldId);
        if (!active) return;
        setWorld(data);
        setLoading(false);
      } catch (err) {
        if (!active) return;
        console.warn('World fetch failed, using Victorian stub fallback:', err);
        const fallback = getFallbackWorld();
        setWorld(fallback);
        setLoading(false);
      }
    }

    fetchWorldDetails();

    return () => {
      active = false;
    };
  }, [worldId]);

  // 2. Fetch polymorphic feed data (posts, news, ads)
  useEffect(() => {
    if (!world) return;

    async function loadInitialFeed() {
      setFeedLoading(true);
      try {
        const [feedRes, newsRes, adsRes] = await Promise.all([
          api.getWorldFeed(worldId, 10),
          api.getWorldNews(worldId),
          api.getWorldAds(worldId),
        ]);

        setPosts(feedRes.posts);
        const enrichedNews = newsRes.map((n: News) => ({
          ...n,
          image_url: n.image_url || getPollinationsNewsUrl(n.title, n.content) || getNewsImageUrl(n.title, n.content),
        }));
        setNews(enrichedNews);
        setAds(adsRes);
        setHasMore(feedRes.hasMore);
        setNextCursor(feedRes.nextCursor);
      } catch (err) {
        console.error('Error loading initial polymorphic feed, using local fallback:', err);
        const seeded = getSeededFeedItems();
        setPosts(seeded.filter((x) => x.type === 'post').map((x) => x.data as Post));
        const enrichedSeededNews = seeded.filter((x) => x.type === 'news').map((x) => {
          const n = x.data as News;
          return {
            ...n,
            image_url: n.image_url || getPollinationsNewsUrl(n.title, n.content) || getNewsImageUrl(n.title, n.content),
          };
        });
        setNews(enrichedSeededNews);
        setAds(seeded.filter((x) => x.type === 'ad').map((x) => x.data as Ad));
        setHasMore(false);
        setNextCursor(null);
      } finally {
        setFeedLoading(false);
      }
    }

    loadInitialFeed();
  }, [world]);

  // 3. Load More Paginated Posts
  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);

    try {
      const feedRes = await api.getWorldFeed(worldId, 8, nextCursor || undefined);

      setPosts((prev) => {
        const updated = [...prev, ...feedRes.posts];
        updated.sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        return updated;
      });

      setHasMore(feedRes.hasMore);
      setNextCursor(feedRes.nextCursor);
    } catch (err) {
      console.error('Failed loading page cursors:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 4. Inject Local proclamation (Transmissions)
  const handleAddLocalPost = (content: string, faction: string) => {
    const newPost: Post = {
      id: `local-${Date.now()}`,
      world_id: worldId,
      persona_id: 'local-user',
      content,
      media_url: null,
      media_type: 'TEXT',
      likes_count: 0,
      reposts_count: 0,
      created_at: new Date().toISOString(),
      persona: {
        id: 'local-persona-id',
        name: 'Temporal Observer',
        handle: 'temp_anchor_01',
        avatar: '',
        role: faction,
        influence_score: 99,
      },
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePersonaProfileRedirect = (personaId: string) => {
    router.push(`/world/${worldId}/persona/${personaId}`);
  };

  const getFallbackWorld = (): World => ({
    id: worldId,
    prompt: 'What if the internet was invented in 1890?',
    name: 'The Victorian Web',
    summary: 'Charles Babbage completes the Analytical Engine under Royal charter, launching steam computing 60 years ahead of schedule.',
    era: 'Victorian Cyberpunk',
    tech_level: 'Mechanical steam computation, punch-card routers',
    gov_type: 'Corporatist Monarchy',
    status: 'ready',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    events: [
      {
        id: 'stub-event-1',
        world_id: worldId,
        year: '1890',
        title: 'Analytical Engine Finalized',
        description: 'Babbage completes the prototype with funding from the British Crown.',
        impact: 'Socio-economic industrial scale computing goes online.',
      },
      {
        id: 'stub-event-2',
        world_id: worldId,
        year: '1895',
        title: 'Net Expansion Act',
        description: 'Parliament passes the Net Act, placing tubes and mechanical lines across the empire.',
        impact: 'Information corporations take structural control.',
      },
    ],
  });

  const getSeededFeedItems = (): FeedItem[] => [
    {
      type: 'news',
      data: {
        id: 'seed-news-1',
        world_id: worldId,
        title: 'Steam Parliament Passes Net Expansion Act',
        content: 'The Imperial Steam Parliament voted 312-88 to fund expansion of the Mechanical Net to all major colonies, sparking a surge in stock value for BabbageCo.',
        category: 'POLITICS',
        publisher: 'The Chronos Daily',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
    },
    {
      type: 'post',
      data: {
        id: 'seed-post-1',
        world_id: worldId,
        persona_id: 'seed-pers-1',
        content: 'Just upgraded the central steam-router. Speed is now up to 10 punch-cards per minute! Mechanical computation has never felt so fast. #SteamNet #Innovation',
        media_url: null,
        media_type: 'TEXT',
        likes_count: 420,
        reposts_count: 17,
        created_at: new Date(Date.now() - 7200000).toISOString(),
        persona: {
          id: 'stub-persona-id',
          name: 'Charles Babbage III',
          handle: 'steam_coder_99',
          avatar: '',
          role: 'SCIENTIST',
          influence_score: 87,
        },
      },
    },
    {
      type: 'ad',
      data: {
        id: 'seed-ad-1',
        world_id: worldId,
        company_name: 'BabbageCo Steam Solutions',
        tagline: 'Compute at the speed of steam.',
        description: 'Our Mark VII Analytical Coprocessor handles 500 mechanical calculations per hour. Command gears to solve your ledgers. Order today from BabbageCo.',
        image_url: null,
        price: '3 Sovereigns',
        created_at: new Date(Date.now() - 10800000).toISOString(),
      },
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center font-mono text-sm scanlines">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-primary-base border-t-transparent animate-spin" />
          <span className="text-text-dim text-glow animate-pulse">Syncing Portal Telemetry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`md:h-screen min-h-screen md:overflow-hidden overflow-y-auto relative flex flex-col p-4 md:p-6 select-none ${isCompiled ? 'border-8 border-double border-primary-base bg-background' : ''}`}>
      {/* Background Particles Grid */}
      <CanvasGrid />

      {/* World Page Header */}
      {isCompiled ? (
        <header className="w-full max-w-7xl mx-auto flex flex-col items-center border-b-4 border-double border-primary-base pb-3.5 mb-6 z-10 text-primary-base font-serif">
          {/* Top meta row */}
          <div className="flex justify-between w-full text-[10px] uppercase tracking-widest border-b border-primary-base/20 pb-2 mb-3 items-center font-bold">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/')}
                className="border border-primary-base px-3 py-1 font-serif text-[10px] tracking-wider font-bold uppercase hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft size={10} />
                <span>Return to Console</span>
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
            <span>VOLUME CCLXVIII // NO. 45091</span>
            <span>PRICE: 2 CENTS</span>
          </div>

          {/* Banner Masthead */}
          <div className="flex items-center justify-between w-full py-1">
            <div className="hidden md:block w-24 h-[1px] bg-primary-base/30" />
            <div className="flex flex-col items-center">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight font-serif text-center leading-none text-text-main flex items-center gap-3">
                <ChronosLogo size={52} className="text-primary-base" />
                THE DAILY CHRONICLE
              </h1>
              <p className="text-[10px] tracking-[0.22em] uppercase mt-2.5 text-center text-text-dim font-bold italic">
                Chronology branches compiled from the temporal divergence compositor
              </p>
            </div>
            <div className="hidden md:block w-24 h-[1px] bg-primary-base/30" />
          </div>

          {/* Bottom meta row */}
          <div className="flex justify-between w-full text-[10px] uppercase tracking-widest border-t border-primary-base/20 pt-2 mt-3 font-bold">
            <span>REALITY KEY: {worldId.slice(0, 8)}</span>
            <span className="font-bold italic normal-case text-text-dim max-w-xs truncate">&ldquo;{stripModePrefix(world?.prompt || '')}&rdquo;</span>
            <span suppressHydrationWarning>{formattedDate}</span>
          </div>
        </header>
      ) : (
        <header className="w-full max-w-7xl mx-auto flex items-center justify-between border-b border-white/5 pb-4 mb-6 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="w-9 h-9 rounded-full border border-white/10 hover:border-accent-base bg-white/5 flex items-center justify-center text-text-dim hover:text-text-main cursor-pointer hover:shadow-[0_0_8px_rgba(var(--glow-color),0.2)] transition-all"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-3">
              <ChronosLogo size={44} className="text-primary-base" />
              <div>
                <h1 className="text-xl font-bold font-serif text-text-main tracking-tight leading-none">
                  {world?.name}
                </h1>
                <span className="text-[10px] font-mono text-accent-base uppercase tracking-wider block mt-0.5">
                  {world?.era}
                </span>
              </div>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden gap-2">
            <button
              onClick={() => setShowMobileTimeline(true)}
              className="px-3 py-1.5 border border-white/10 rounded-lg text-[10px] font-mono flex items-center gap-1.5 text-text-dim bg-white/5"
            >
              <Clock size={12} />
              <span>Timeline</span>
            </button>
            <button
              onClick={() => setShowMobileIntelligence(true)}
              className="px-3 py-1.5 border border-white/10 rounded-lg text-[10px] font-mono flex items-center gap-1.5 text-text-dim bg-white/5"
            >
              <Info size={12} />
              <span>Intelligence</span>
            </button>
          </div>

          <div className="hidden md:flex gap-6 font-mono text-[10px] text-text-dim items-center">
            <button
              onClick={() => router.push('/developers')}
              className="glass-button px-5 py-2.5 rounded-lg text-xs font-mono uppercase tracking-wider font-bold cursor-pointer text-text-main hover:text-accent-base transition-all duration-300 border border-white/10 hover:border-accent-base/50"
            >
              DEVELOPER PORTAL
            </button>
            <div className="flex gap-4">
              <span>REALITY_KEY: {worldId.slice(0, 8)}</span>
              <span className="text-emerald-400">STABILIZED</span>
            </div>
          </div>
        </header>
      )}

      {/* Three Panel Layout Container */}
      <div className="flex-1 min-h-0 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 z-10 relative">
        
        {/* Left Panel: Cause-Effect Timeline (3 Cols on Desktop) */}
        <aside className={`hidden md:block md:col-span-3 h-full min-h-0 overflow-hidden ${isCompiled ? 'border-r border-primary-base/15 pl-4 pr-6' : ''}`}>
          <TimelineSidebar events={world?.events || []} />
        </aside>

        {/* Center Panel: Social Feed (6 Cols on Desktop) */}
        <main className="col-span-1 md:col-span-6 h-full min-h-0 overflow-hidden">
          <FeedColumn
            initialItems={feedItems}
            worldId={worldId}
            hasMore={hasMore}
            nextCursor={nextCursor}
            onLoadMore={handleLoadMore}
            onPersonaClick={handlePersonaProfileRedirect}
            onAddLocalPost={handleAddLocalPost}
            isLoadingMore={isLoadingMore}
            feedLoading={feedLoading}
          />
        </main>

        {/* Right Panel: World Intelligence Telemetry (3 Cols on Desktop) */}
        <aside className={`hidden md:block md:col-span-3 h-full min-h-0 overflow-hidden ${isCompiled ? 'border-l border-primary-base/15 pl-6 pr-4' : ''}`}>
          {world && <IntelligencePanel world={world} />}
        </aside>
      </div>

      {/* Newspaper Footer */}
      <footer className="w-full max-w-7xl mx-auto border-t-2 border-double border-primary-base/20 mt-4 pt-3.5 pb-1 text-center text-[9px] tracking-[0.22em] font-serif text-text-dim uppercase font-bold z-10">
        AI CLUB | SIT PUNE | AARUSHI | ADITYA | YESHWANT | 2026
      </footer>

      {/* -------------------------------------------------------------
          MOBILE MODALS / SLIDEOUTS (USING FRAMER MOTION)
          ------------------------------------------------------------- */}
      <AnimatePresence>
        {/* Mobile Left Panel (Timeline drawer from bottom) */}
        {showMobileTimeline && (
          <div className="fixed inset-0 z-50 bg-black/60 md:hidden flex items-end">
            {/* Backdrop click closer */}
            <div className="absolute inset-0" onClick={() => setShowMobileTimeline(false)} />
            
            <motion.div
              className="w-full bg-background border-t border-border-color rounded-t-2xl p-5 relative z-10 max-h-[80vh] overflow-hidden flex flex-col"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <span className="font-mono text-xs text-text-main font-bold">Chronology Branches</span>
                <button
                  onClick={() => setShowMobileTimeline(false)}
                  className="p-1 hover:text-accent-base text-text-dim"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-1">
                <TimelineSidebar events={world?.events || []} />
              </div>
            </motion.div>
          </div>
        )}

        {/* Mobile Right Panel (Intelligence slide-over from right) */}
        {showMobileIntelligence && (
          <div className="fixed inset-0 z-50 bg-black/60 md:hidden flex justify-end">
            <div className="absolute inset-0" onClick={() => setShowMobileIntelligence(false)} />

            <motion.div
              className="w-[85vw] bg-background border-l border-border-color p-5 relative z-10 h-full overflow-hidden flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            >
              <div className="flex justify-between items-center border-b border-white/5 pb-3 mb-4">
                <span className="font-mono text-xs text-text-main font-bold">World Intelligence</span>
                <button
                  onClick={() => setShowMobileIntelligence(false)}
                  className="p-1 hover:text-accent-base text-text-dim"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pr-1">
                {world && <IntelligencePanel world={world} />}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Strips the [Mode: anchored/ripple/chaos] prefix from prompts for display */
function stripModePrefix(prompt: string): string {
  return prompt.replace(/^\[Mode:\s*(anchored|ripple|chaos)\]\s*/i, '').trim();
}

/**
 * Generates a Pollinations.ai image URL from a news headline for photorealistic context-aware images.
 */
function getPollinationsNewsUrl(title: string, content: string): string | null {
  if (!title || title.length < 5) return null;
  const text = (title + ' ' + content).toLowerCase();
  
  // Build a rich image prompt from the title
  let style = 'Reuters editorial photograph, photojournalism style, dramatic lighting';
  let subject = title.slice(0, 100);
  
  if (text.includes('modi') || text.includes('india') || text.includes('delhi')) {
    style = 'Reuters photograph, official press conference, South Asian setting, dramatic lighting';
  } else if (text.includes('trump') || text.includes('america') || text.includes('washington') || text.includes('white house')) {
    style = 'AP News photograph, official press briefing, Washington DC, high contrast lighting';
  } else if (text.includes('china') || text.includes('beijing') || text.includes('ccp') || text.includes('communist')) {
    style = 'Reuters photograph, formal diplomatic setting, Beijing, Chinese architecture background';
  } else if (text.includes('space') || text.includes('mars') || text.includes('rocket') || text.includes('nasa')) {
    style = 'NASA press photograph, dramatic space imagery, cinematic composition';
  } else if (text.includes('war') || text.includes('battle') || text.includes('military') || text.includes('army')) {
    style = 'vintage war photograph, documentary style, high contrast black and white';
  } else if (text.includes('science') || text.includes('research') || text.includes('laboratory') || text.includes('discovery')) {
    style = 'scientific documentary photograph, laboratory setting, professional lighting';
  } else if (text.includes('economy') || text.includes('market') || text.includes('business') || text.includes('trade')) {
    style = 'Bloomberg press photograph, financial district, professional business setting';
  }
  
  const imagePrompt = `${subject}, ${style}`;
  const encoded = encodeURIComponent(imagePrompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=600&height=350&nologo=true&enhance=true`;
}

function getNewsImageUrl(title: string, content: string): string {
  const text = (title + ' ' + content).toLowerCase();
  
  let ids = [
    'photo-1447069387593-a5de0862481e',
    'photo-1457369804613-52c61a468e7d',
    'photo-1504711434969-e33886168f5c',
    'photo-1512820790803-83ca734da794',
  ];

  if (text.includes('modi') || text.includes('india') || text.includes('delhi') || text.includes('trump') || text.includes('china') || text.includes('president') || text.includes('beijing')) {
    ids = ['photo-1548013146-72479768bada', 'photo-1508009603885-50cf7c579365', 'photo-1529655683826-09574890a537'];
  } else if (text.includes('rome') || text.includes('caesar') || text.includes('empire')) {
    ids = ['photo-1552832230-c0197dd311b5', 'photo-1515003844-640a32066fa9'];
  } else if (text.includes('steam') || text.includes('babbage') || text.includes('engine') || text.includes('gear')) {
    ids = ['photo-1580137189272-c9379f8864fd', 'photo-1508962914676-134849a727f0'];
  } else if (text.includes('mars') || text.includes('space') || text.includes('rocket')) {
    ids = ['photo-1614728894747-a83421e2b9c9', 'photo-1451187580459-43490279c0fa'];
  } else if (text.includes('egypt') || text.includes('alexandria') || text.includes('greece') || text.includes('library')) {
    ids = ['photo-1507842217343-583bb7270b66', 'photo-1564507592333-c60657eea523'];
  } else if (text.includes('war') || text.includes('battle') || text.includes('napoleon') || text.includes('soldier')) {
    ids = ['photo-1508849789987-4e5333c12b78', 'photo-1473163928189-364b2c4e1135'];
  } else if (text.includes('science') || text.includes('physics') || text.includes('einstein') || text.includes('quantum')) {
    ids = ['photo-1507668077129-56e32842fceb'];
  } else if (text.includes('russia') || text.includes('soviet') || text.includes('cold war')) {
    ids = ['photo-1513542789411-b6a5d4f31634'];
  }

  const seed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomId = ids[seed % ids.length];
  return `https://images.unsplash.com/${randomId}?auto=format&fit=crop&w=600&q=80`;
}
