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
import { World, Post, News, Ad, NewsCategory, OperatorPersona } from '../../../types';
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
  const [operator, setOperator] = useState<OperatorPersona | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Feed Items State
  const [posts, setPosts] = useState<Post[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
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
        
        try {
          const op = await api.getOperatorPersona(worldId);
          if (active) setOperator(op);
        } catch (opErr) {
          console.warn('Failed to load operator persona on mount:', opErr);
        }
        
        setLoading(false);
      } catch (err) {
        if (!active) return;
        console.warn('World fetch failed, using Victorian stub fallback:', err);
        const fallback = getFallbackWorld();
        setWorld(fallback);
        
        try {
          const op = await api.getOperatorPersona(worldId);
          if (active) setOperator(op);
        } catch (opErr) {
          console.warn('Failed to load operator persona on fallback mount:', opErr);
        }
        
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

    // Helper to replace placeholders with world-specific metadata
    const fillPlaceholders = (text: string, currentWorld: World, persona?: any): string => {
      if (!text || !currentWorld) return text;
      return text
        .replace(/{{WORLD_NAME}}/g, currentWorld.name || 'the simulation')
        .replace(/{{ERA}}/g, currentWorld.era || 'steampunk era')
        .replace(/{{TECH_LEVEL}}/g, currentWorld.tech_level || 'steam computation')
        .replace(/{{GOV_TYPE}}/g, currentWorld.gov_type || 'council governance')
        .replace(/{{ROLE}}/g, persona?.role || 'OBSERVER')
        .replace(/{{PERSONA_NAME}}/g, persona?.name || 'Observer')
        .replace(/{{PERSONA_HANDLE}}/g, persona?.handle || 'observer_01');
    };

    // Expand posts by generating unique text from templates in the voice of world personas
    const expandPosts = (
      rawPosts: Post[],
      personas: any[],
      targetCount: number,
      timeOffsetHours = 3
    ): Post[] => {
      const result = [...rawPosts];
      if (result.length === 0) return [];
      
      const personasList = personas.length > 0 ? personas : [
        { id: 'p1', name: 'Charles Babbage III', handle: 'steam_coder_99', role: 'SCIENTIST', influence_score: 87 },
        { id: 'p2', name: 'Ada Lovelace Jr.', handle: 'analytical_genius', role: 'SCIENTIST', influence_score: 92 },
        { id: 'p3', name: 'Baroness Sterling', handle: 'brass_nobility', role: 'POLITICIAN', influence_score: 75 },
        { id: 'p4', name: 'Captain Copperfield', handle: 'aeronaut_pioneer', role: 'INFLUENCER', influence_score: 80 }
      ];

      const postTemplates = [
        "As a {{ROLE}}, I must say the shift towards {{TECH_LEVEL}} is changing everything in {{WORLD_NAME}}.",
        "Hearing reports that the {{GOV_TYPE}} is increasing monitoring on the steam-grid. Stay safe observers.",
        "Just finished a debate with other {{ROLE}}s about our current era, {{ERA}}. Thoughts?",
        "The steam pressure in the central grid is fluctuating again. Classic {{WORLD_NAME}} infrastructure.",
        "Can anyone confirm if the Babbage Analytical Engine is down? I cannot synchronize my punch-cards.",
        "We are witnessing the dawn of a new age. {{TECH_LEVEL}} is not just a tool, it's our future.",
        "Rumors say that the {{GOV_TYPE}} is planning to tax cogwheel repairs. Unbelievable!",
        "I've been analyzing the temporal telemetry. The timeline bifurcation of {{ERA}} is accelerating.",
        "A new shipment of brass valves just arrived. Time to upgrade the server core!",
        "The latest dispatch from the central archives is out. The impact of {{TECH_LEVEL}} is undeniable.",
        "Who else is attending the grand exhibition of mechanical automata tonight?",
        "The steam-grid is running at 94% capacity. We need more pressure regulators!",
        "A reminder to all observers: keep your cogs oiled and your pressure gauges calibrated.",
        "Fascinating data coming in from the outer rim. The expansion of {{WORLD_NAME}} is ahead of schedule.",
        "Is it true that the high council is banishing code-punchers? We must organize!",
        "No matter how advanced the {{TECH_LEVEL}} gets, we must never forget our roots in the early {{ERA}}.",
        "Spotted a magnificent steam-carriage passing by the laboratory today. Simple engineering, but elegant.",
        "The latest algorithms for the mechanical net are looking promising. Efficiency up by 15%!",
        "Just read the latest morning dispatches. The news from {{WORLD_NAME}} is concerning.",
        "Oiling the gear teeth is the best form of meditation. Let the mechanism find peace."
      ];

      let index = 0;
      const baseTime = rawPosts.length > 0 
        ? new Date(rawPosts[rawPosts.length - 1].created_at).getTime()
        : Date.now();

      while (result.length < targetCount) {
        const template = postTemplates[index % postTemplates.length];
        const persona = personasList[index % personasList.length];
        const content = fillPlaceholders(template, world!, persona);

        const newPost: Post = {
          id: `gen-post-${index}-${Date.now()}`,
          world_id: worldId,
          persona_id: persona.id,
          content,
          media_url: null,
          media_type: 'TEXT',
          likes_count: Math.floor(10 + Math.random() * 500),
          reposts_count: Math.floor(2 + Math.random() * 80),
          created_at: new Date(baseTime - (index + 1) * timeOffsetHours * 3600000).toISOString(),
          persona: persona
        };
        result.push(newPost);
        index++;
      }
      return result;
    };

    // Expand news items by generating unique articles from templates
    const expandNews = (
      rawNews: News[],
      targetCount: number,
      timeOffsetHours = 6
    ): News[] => {
      const result = [...rawNews];
      if (result.length === 0) return [];

      const newsTemplates = [
        {
          title: "High Council Announces Infrastructure Reform for {{TECH_LEVEL}}",
          content: "The High Council has unveiled a massive budget allocation to modernize {{WORLD_NAME}}'s central hubs, prioritizing the implementation of {{TECH_LEVEL}} networks.",
          category: "POLITICS"
        },
        {
          title: "Breakthrough in Mechanical Automation: New Steam-Driven Solvers Unveiled",
          content: "Engineers at the Royal Academy have patented a new class of brass solvers capable of executing complex calculations at three times the speed of existing units.",
          category: "SCIENCE"
        },
        {
          title: "Stock Market Fluctuations in {{WORLD_NAME}} as Steampunk Tech Surges",
          content: "The Exchange registered record trading volumes today as shares in steam-grid developers and copper extraction conglomerates rallied following positive forecasts.",
          category: "BUSINESS"
        },
        {
          title: "Citizens Assembly Protests {{GOV_TYPE}} Taxes on Coal and Copper",
          content: "Hundreds gathered outside the parliament gates to voice their opposition to the new tariff proposal, claiming it hurts independent mechanics.",
          category: "POLITICS"
        },
        {
          title: "The Grand Chronicle Report: How {{ERA}} Redefined Modern Society",
          content: "In this special retrospective, we examine how the shift in power during the {{ERA}} era paved the way for our current technological landscape.",
          category: "CULTURE"
        },
        {
          title: "Steampunk Net Reaches Record High of 10,000 Synchronized Cylinders",
          content: "System observers confirmed the network handled over ten thousand simultaneous punch-card connections today without a single pressure drop.",
          category: "TECHNOLOGY"
        },
        {
          title: "Scientific Expedition Discovers Ancient Relics in Northern Wastelands",
          content: "A team of researchers returned today with artifacts suggesting an advanced mechanical civilization occupied the waste sectors centuries ago.",
          category: "SCIENCE"
        },
        {
          title: "Tension Rises Between Guilds Over Control of the Central Steam-Grid",
          content: "Negotiations stalled between the Steamwrights and the Analytical Engineers, raising concerns of a potential grid shutdown next week.",
          category: "BUSINESS"
        },
        {
          title: "New Imperial Decree: All Analytical Engines Must Undergo Safety Inspections",
          content: "Under pressure from the safety committee, the crown has mandated strict quarterly testing for all mechanical computation systems exceeding 50 horsepower.",
          category: "POLITICS"
        },
        {
          title: "BabbageCo Launches Next-Generation Brass Router for Public Consumption",
          content: "The new consumer-grade router promises seamless connection to the imperial network at a fraction of the size of industrial models.",
          category: "TECHNOLOGY"
        }
      ];

      let index = 0;
      const baseTime = rawNews.length > 0
        ? new Date(rawNews[rawNews.length - 1].created_at).getTime()
        : Date.now();

      while (result.length < targetCount) {
        const template = newsTemplates[index % newsTemplates.length];
        const title = fillPlaceholders(template.title, world!);
        const content = fillPlaceholders(template.content, world!);

        const newNews: News = {
          id: `gen-news-${index}-${Date.now()}`,
          world_id: worldId,
          title,
          content,
          category: template.category as NewsCategory,
          publisher: index % 2 === 0 ? "The Chronos Daily" : "Imperial Dispatch",
          image_url: getPollinationsNewsUrl(title, content) || getNewsImageUrl(title, content),
          created_at: new Date(baseTime - (index + 1) * timeOffsetHours * 3600000).toISOString()
        };
        result.push(newNews);
        index++;
      }
      return result;
    };

    // Expand advertisements using alternate-history templates
    const expandAds = (
      rawAds: Ad[],
      targetCount: number,
      timeOffsetHours = 8
    ): Ad[] => {
      const result = [...rawAds];
      if (result.length === 0) return [];

      const adTemplates = [
        {
          company_name: "BabbageCo Steam Solutions",
          tagline: "Compute at the speed of steam.",
          description: "Our Mark VII Analytical Coprocessor handles 500 mechanical calculations per hour. Command gears to solve your ledgers. Order today from BabbageCo.",
          price: "3 Sovereigns"
        },
        {
          company_name: "Lubricants & Oils",
          tagline: "Keep your cogs spinning smoothly.",
          description: "Formulated specifically for high-pressure copper axles and delicate brass escapements. Tested and approved by the Royal Engineering Guild.",
          price: "5 Shillings"
        },
        {
          company_name: "Sterling Brass Enclosures",
          tagline: "Secure your transmission link.",
          description: "Heavy-duty brass shielding designed to protect your home router from coal ash, moisture, and high-frequency steam vibrations.",
          price: "1 Sovereign"
        },
        {
          company_name: "Reality Insurance Group",
          tagline: "Protect your assets against temporal anomalies.",
          description: "Ensure your estate and business remain intact across timeline bifurcations. Comprehensive coverage for divergence drifts up to 5%.",
          price: "12 Sovereigns/yr"
        },
        {
          company_name: "Royal Steam Academy",
          tagline: "Learn the art of Mechanical Net coding.",
          description: "Become a certified steam observer. Learn punch-card design, gear ratio optimization, and boiler pressure mathematics. Night classes available.",
          price: "4 Sovereigns"
        },
        {
          company_name: "The Steam Carriage Co.",
          tagline: "Fast, clean, and powered by pure coal.",
          description: "Introducing the Model IX Carriage. Boasting a dual-cylinder engine, leaf suspension, and brass accents. Stand out in the streets of London.",
          price: "85 Sovereigns"
        },
        {
          company_name: "Imperial Punch-Card Co.",
          tagline: "Order your custom copper cards.",
          description: "Pre-punched or blank sheets manufactured with durable reinforced copper alloy. Fits all standard Babbage-class processors.",
          price: "8 Shillings/pack"
        }
      ];

      let index = 0;
      const baseTime = rawAds.length > 0
        ? new Date(rawAds[rawAds.length - 1].created_at).getTime()
        : Date.now();

      while (result.length < targetCount) {
        const template = adTemplates[index % adTemplates.length];
        const companyName = fillPlaceholders(template.company_name, world!);
        const description = fillPlaceholders(template.description, world!);

        const newAd: Ad = {
          id: `gen-ad-${index}-${Date.now()}`,
          world_id: worldId,
          company_name: companyName,
          tagline: template.tagline,
          description,
          image_url: null,
          price: template.price,
          created_at: new Date(baseTime - (index + 1) * timeOffsetHours * 3600000).toISOString()
        };
        result.push(newAd);
        index++;
      }
      return result;
    };

    async function loadInitialFeed() {
      setFeedLoading(true);
      try {
        // Fetch up to 100 posts to load the entire timeline feed at once
        const [feedRes, newsRes, adsRes, personasRes] = await Promise.all([
          api.getWorldFeed(worldId, 100),
          api.getWorldNews(worldId),
          api.getWorldAds(worldId),
          api.getWorldPersonas(worldId).catch(() => []),
        ]);

        const rawPosts = feedRes.posts;
        const enrichedNews = newsRes.map((n: News) => ({
          ...n,
          image_url: n.image_url || getPollinationsNewsUrl(n.title, n.content) || getNewsImageUrl(n.title, n.content),
        }));

        // Expand items to ensure at least 65 total items (55 posts, 25 news, 20 ads)
        const expandedPosts = expandPosts(rawPosts, personasRes, 55, 3);
        const expandedNews = expandNews(enrichedNews, 25, 6);
        const expandedAds = expandAds(adsRes, 20, 8);

        // Load local user posts
        const savedPostsRaw = typeof window !== 'undefined' ? localStorage.getItem(`chronos-user-posts-${worldId}`) : null;
        const userPosts: Post[] = savedPostsRaw ? JSON.parse(savedPostsRaw) : [];

        setPosts([...userPosts, ...expandedPosts]);
        setNews(expandedNews);
        setAds(expandedAds);
      } catch (err) {
        console.error('Error loading initial polymorphic feed, using local fallback:', err);
        const seeded = getSeededFeedItems();
        const rawPosts = seeded.filter((x) => x.type === 'post').map((x) => x.data as Post);
        const personasRes = rawPosts.map((p) => p.persona).filter(Boolean);
        const enrichedSeededNews = seeded.filter((x) => x.type === 'news').map((x) => {
          const n = x.data as News;
          return {
            ...n,
            image_url: n.image_url || getPollinationsNewsUrl(n.title, n.content) || getNewsImageUrl(n.title, n.content),
          };
        });
        const rawAds = seeded.filter((x) => x.type === 'ad').map((x) => x.data as Ad);

        // Expand items to ensure at least 65 total items
        const expandedPosts = expandPosts(rawPosts, personasRes, 55, 3);
        const expandedNews = expandNews(enrichedSeededNews, 25, 6);
        const expandedAds = expandAds(rawAds, 20, 8);

        // Load local user posts
        const savedPostsRaw = typeof window !== 'undefined' ? localStorage.getItem(`chronos-user-posts-${worldId}`) : null;
        const userPosts: Post[] = savedPostsRaw ? JSON.parse(savedPostsRaw) : [];

        setPosts([...userPosts, ...expandedPosts]);
        setNews(expandedNews);
        setAds(expandedAds);
      } finally {
        setFeedLoading(false);
      }
    }

    loadInitialFeed();
  }, [world]);

  // 4. Inject Local proclamation (Transmissions)
  const handleAddLocalPost = async (content: string, faction: string) => {
    let activeOperator = operator;
    if (!activeOperator) {
      try {
        activeOperator = await api.instantiateOperatorPersona(worldId, faction);
        setOperator(activeOperator);
      } catch (err) {
        console.error('Failed to instantiate operator persona:', err);
      }
    }

    const newPost: Post = {
      id: `local-${Date.now()}`,
      world_id: worldId,
      persona_id: activeOperator ? activeOperator.id : 'local-user',
      content,
      media_url: null,
      media_type: 'TEXT',
      likes_count: 0,
      reposts_count: 0,
      created_at: new Date().toISOString(),
      persona: {
        id: activeOperator ? activeOperator.id : 'local-persona-id',
        name: activeOperator ? activeOperator.name : 'Temporal Observer',
        handle: activeOperator ? activeOperator.handle : 'temp_anchor_01',
        avatar: '',
        role: activeOperator ? activeOperator.role : faction,
        influence_score: activeOperator ? activeOperator.influence_score : 99,
      },
    };

    // Save user post locally to persist across page reloads
    if (typeof window !== 'undefined') {
      const savedPostsRaw = localStorage.getItem(`chronos-user-posts-${worldId}`);
      const userPosts: Post[] = savedPostsRaw ? JSON.parse(savedPostsRaw) : [];
      localStorage.setItem(`chronos-user-posts-${worldId}`, JSON.stringify([newPost, ...userPosts]));
    }

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
        <header className="w-full max-w-none mx-auto flex flex-col items-center border-b-4 border-double border-primary-base pb-3.5 mb-6 z-10 text-primary-base font-serif">
          {/* Top meta row */}
          <div className="relative flex flex-col md:flex-row justify-between w-full text-[10px] uppercase tracking-widest border-b border-primary-base/20 pb-2 mb-3 items-center font-bold gap-3 md:gap-0">
            <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
              <button
                onClick={() => router.push('/')}
                className="border border-primary-base px-3 py-1 font-serif text-[10px] tracking-wider font-bold uppercase hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer flex items-center gap-1"
              >
                <ArrowLeft size={10} />
                <span>Return to Console</span>
              </button>
              <button
                onClick={() => router.push('/guide')}
                className="border border-primary-base px-3 py-1 font-serif text-[10px] tracking-wider font-bold uppercase hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer"
              >
                How to Use
              </button>
              <button
                onClick={() => router.push(`/world/${worldId}/persona/operator`)}
                className="border border-primary-base px-3 py-1 font-serif text-[10px] tracking-wider font-bold uppercase hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer text-accent-base border-accent-base/50"
              >
                Operator Dossier
              </button>
            </div>
            <span className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 text-center">VOLUME CCLXVIII // NO. 45091</span>
            <span className="text-center">PRICE: 2 CENTS</span>
          </div>

          {/* Banner Masthead */}
          <div className="flex items-center justify-between w-full py-2.5">
            <div className="hidden md:block w-24 h-[1px] bg-primary-base/30" />
            <div className="flex flex-col items-center">
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight font-serif text-center leading-none text-primary-base flex items-center justify-center gap-4">
                <ChronosLogo size={68} className="text-primary-base shrink-0" />
                <span>THE DAILY CHRONICLE</span>
              </h1>
              <p className="text-[10px] tracking-[0.22em] uppercase mt-3 text-center text-text-dim font-bold italic">
                Chronology branches compiled from the temporal divergence compositor
              </p>
            </div>
            <div className="hidden md:block w-24 h-[1px] bg-primary-base/30" />
          </div>

          {/* Bottom meta row */}
          <div className="relative flex flex-col md:flex-row justify-between w-full text-[10px] uppercase tracking-widest border-t border-primary-base/20 pt-2 mt-3 font-bold gap-2 md:gap-0 items-center">
            <span className="text-center">REALITY KEY: {worldId.slice(0, 8)}</span>
            <span className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2 text-center font-bold italic normal-case text-text-dim max-w-md truncate px-4">
              &ldquo;{stripModePrefix(world?.prompt || '')}&rdquo;
            </span>
            <span className="text-center" suppressHydrationWarning>{formattedDate}</span>
          </div>
        </header>
      ) : (
        <header className="w-full max-w-none mx-auto flex items-center justify-between border-b border-white/5 pb-4 mb-6 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="w-9 h-9 rounded-full border border-white/10 hover:border-accent-base bg-white/5 flex items-center justify-center text-text-dim hover:text-text-main cursor-pointer hover:shadow-[0_0_8px_rgba(var(--glow-color),0.2)] transition-all"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex items-center gap-3">
              <ChronosLogo size={46} className="text-primary-base" />
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
            <div className="flex gap-4">
              <span>REALITY_KEY: {worldId.slice(0, 8)}</span>
              <span className="text-emerald-400">STABILIZED</span>
            </div>
          </div>
        </header>
      )}

      {/* Three Panel Layout Container */}
      <div className="flex-1 min-h-0 w-full max-w-none mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 z-10 relative">
        
        {/* Left Panel: Cause-Effect Timeline (3 Cols on Desktop) */}
        <aside className={`hidden md:block md:col-span-3 h-full min-h-0 overflow-hidden ${isCompiled ? 'border-r border-primary-base/15 pl-4 pr-6' : ''}`}>
          <TimelineSidebar events={world?.events || []} />
        </aside>

        {/* Center Panel: Social Feed (6 Cols on Desktop) */}
        <main className="col-span-1 md:col-span-6 h-full min-h-0 overflow-hidden">
          <FeedColumn
            initialItems={feedItems}
            worldId={worldId}
            onPersonaClick={handlePersonaProfileRedirect}
            onAddLocalPost={handleAddLocalPost}
            feedLoading={feedLoading}
          />
        </main>

        {/* Right Panel: World Intelligence Telemetry (3 Cols on Desktop) */}
        <aside className={`hidden md:block md:col-span-3 h-full min-h-0 overflow-hidden ${isCompiled ? 'border-l border-primary-base/15 pl-6 pr-4' : ''}`}>
          {world && <IntelligencePanel world={world} />}
        </aside>
      </div>

      {/* Newspaper Footer */}
      <footer className="w-full max-w-none mx-auto border-t-2 border-double border-primary-base/20 mt-4 pt-3.5 pb-1 text-center text-[9px] tracking-[0.22em] font-serif text-text-dim uppercase font-bold z-10">
        AI CLUB | SIT PUNE | AARUSHI | ADITYA | YESHWANT | v1.2.0 | 2026
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
