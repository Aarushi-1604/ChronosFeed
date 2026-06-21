'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, RotateCw, Newspaper, Tag, Compass, Binary, AlertTriangle, MessageSquare } from 'lucide-react';
import { Post, News, Ad, Comment, Persona } from '../../types';
import { api } from '../../lib/api';
import { useTheme } from '../../context/theme-context';

function TelegraphPrintText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isPrinting, setIsPrinting] = useState(true);

  useEffect(() => {
    let index = 0;
    let timer: any = null;
    
    const step = () => {
      index += 4;
      if (index >= text.length) {
        setDisplayedText(text);
        setIsPrinting(false);
        clearInterval(timer);
      } else {
        setDisplayedText(text.slice(0, index));
      }
    };

    timer = setInterval(step, 12);
    return () => clearInterval(timer);
  }, [text]);

  return (
    <p className="text-xs leading-relaxed text-text-main/90 first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none">
      {displayedText}
      {isPrinting && <span className="animate-pulse font-sans font-bold text-primary-base ml-0.5">█</span>}
    </p>
  );
}

function getFallbackUnsplashUrl(content: string): string {
  const text = (content || '').toLowerCase();
  let photoId = 'photo-1457369804613-52c61a468e7d'; // Default vintage writing desk
  
  if (text.includes('rome') || text.includes('caesar') || text.includes('senat') || text.includes('empire') || text.includes('roman')) {
    photoId = 'photo-1552832230-c0197dd311b5'; // Rome Colosseum
  } else if (text.includes('modi') || text.includes('india') || text.includes('delhi') || text.includes('jaipur')) {
    photoId = 'photo-1524492412937-b28074a5d7da'; // Taj Mahal / India
  } else if (text.includes('trump') || text.includes('america') || text.includes('washington') || text.includes('president') || text.includes('white house')) {
    photoId = 'photo-1508009603885-50cf7c579365'; // Washington DC / Capitol
  } else if (text.includes('china') || text.includes('beijing') || text.includes('xi ') || text.includes('president of china')) {
    photoId = 'photo-1508009603885-50cf7c579365'; // Fallback
  } else if (text.includes('steam') || text.includes('babbage') || text.includes('engine') || text.includes('gear') || text.includes('tesla') || text.includes('edison')) {
    photoId = 'photo-1508962914676-134849a727f0'; // Old gears / Steampunk
  } else if (text.includes('mars') || text.includes('space') || text.includes('rocket') || text.includes('nasa') || text.includes('coloniz')) {
    photoId = 'photo-1614728894747-a83421e2b9c9'; // Mars
  } else if (text.includes('alexandria') || text.includes('library') || text.includes('book') || text.includes('read') || text.includes('burn')) {
    photoId = 'photo-1507842217343-583bb7270b66'; // Old library
  }
  
  return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=600&q=80`;
}

export type FeedItem =
  | { type: 'post'; data: Post }
  | { type: 'news'; data: News }
  | { type: 'ad'; data: Ad };

interface FeedCardProps {
  item: FeedItem;
  onPersonaClick?: (personaId: string) => void;
}

export default function FeedCard({ item, onPersonaClick }: FeedCardProps) {
  const { theme } = useTheme();
  const isNewspaper = theme.startsWith('newspaper');

  const [liked, setLiked] = useState(false);
  const [reposted, setReposted] = useState(false);
  const [likesCount, setLikesCount] = useState(
    item.type === 'post' ? item.data.likes_count : 0
  );
  const [repostsCount, setRepostsCount] = useState(
    item.type === 'post' ? item.data.reposts_count : 0
  );

  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [errorComments, setErrorComments] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [localCommentsCount, setLocalCommentsCount] = useState(0);
  const [worldPersonas, setWorldPersonas] = useState<Persona[]>([]);

  useEffect(() => {
    if (item.type === 'post') {
      const savedCommentsRaw = typeof window !== 'undefined' ? localStorage.getItem(`chronos-user-comments-${item.data.world_id}`) : null;
      if (savedCommentsRaw) {
        try {
          const localComments: Comment[] = JSON.parse(savedCommentsRaw);
          const count = localComments.filter(c => c.post_id === item.data.id).length;
          setLocalCommentsCount(count);
        } catch {}
      }

      // Load world personas for simulating replies
      api.getWorldPersonas(item.data.world_id)
        .then(setWorldPersonas)
        .catch(err => console.warn('Failed to load personas for reply simulation:', err));
    }
  }, [item]);

  const handleToggleComments = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showComments) {
      setShowComments(true);
      if (comments.length === 0 && item.type === 'post') {
        setLoadingComments(true);
        setErrorComments(null);
        try {
          const data = await api.getPostComments(item.data.id);
          const savedCommentsRaw = typeof window !== 'undefined' ? localStorage.getItem(`chronos-user-comments-${item.data.world_id}`) : null;
          const localComments: Comment[] = savedCommentsRaw ? JSON.parse(savedCommentsRaw) : [];
          const postLocalComments = localComments.filter(c => c.post_id === item.data.id);
          setComments([...postLocalComments, ...data]);
        } catch (err: any) {
          setErrorComments(err.message || 'Failed to load comments');
        } finally {
          setLoadingComments(false);
        }
      }
    } else {
      setShowComments(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || item.type !== 'post') return;

    setSubmittingComment(true);
    try {
      const worldId = item.data.world_id;
      const postId = item.data.id;
      
      let activeOperator = await api.getOperatorPersona(worldId);
      if (!activeOperator) {
        activeOperator = await api.instantiateOperatorPersona(worldId, 'CITIZEN');
      }

      const randomLikes = Math.floor(Math.random() * 45) + 5;
      const randomReposts = Math.floor(randomLikes * 0.35) + 1;

      const newComment: Comment = {
        id: `local-comment-${Date.now()}`,
        post_id: postId,
        persona_id: activeOperator ? activeOperator.id : 'operator',
        content: newCommentText,
        likes_count: randomLikes,
        created_at: new Date().toISOString(),
        persona: {
          id: 'operator',
          world_id: worldId,
          name: activeOperator ? activeOperator.name : 'Citizen Operator',
          handle: activeOperator ? activeOperator.handle : 'citizen_operator',
          avatar: '',
          role: activeOperator 
            ? (activeOperator.role === 'CITIZEN' ? 'INFLUENCER' : activeOperator.role === 'IMPERIAL' ? 'POLITICIAN' : activeOperator.role === 'TECHNOLOGIST' ? 'SCIENTIST' : 'INFLUENCER')
            : 'INFLUENCER',
          followers_count: activeOperator ? activeOperator.followers_count : 8400,
          following_count: activeOperator ? activeOperator.following_count : 210,
          influence_score: activeOperator ? activeOperator.influence_score : 72,
          interests: [],
          personality: '',
        } as any
      };
      
      (newComment as any).reposts_count = randomReposts;

      const savedCommentsRaw = typeof window !== 'undefined' ? localStorage.getItem(`chronos-user-comments-${worldId}`) : null;
      const localComments: Comment[] = savedCommentsRaw ? JSON.parse(savedCommentsRaw) : [];
      localComments.unshift(newComment);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`chronos-user-comments-${worldId}`, JSON.stringify(localComments));
      }

      setComments(prev => [newComment, ...prev]);
      setLocalCommentsCount(prev => prev + 1);
      setNewCommentText('');

      // Also dynamically boost the post counts to simulate viral engagement!
      setLikesCount(prev => prev + Math.floor(Math.random() * 8) + 2);
      setRepostsCount(prev => prev + Math.floor(Math.random() * 4) + 1);

      // Simulate a random persona replying to the user's comment after a delay
      const operatorHandle = activeOperator ? activeOperator.handle : 'citizen_operator';
      
      setTimeout(() => {
        if (worldPersonas.length > 0) {
          const randomPersona = worldPersonas[Math.floor(Math.random() * worldPersonas.length)];
          const replyTemplates = [
            "Agreed. The mechanical net stream registers this as highly probable.",
            "I must disagree. The calculations do not support this hypothesis.",
            "Intriguing transmission. We should monitor this node closely.",
            "Is this officially sanctioned by the High Directorate?",
            "This signal must be amplified. Re-transmitting to my grid nodes.",
            `Fascinating perspective, @${operatorHandle}! I am archiving this for analysis.`,
            "The steam pressure rises! This debate is heating up.",
            "Excellent dispatch. This is exactly what the public needs to hear.",
            "Are you suggesting a modification to the central punch-cards?",
            "A bold statement. Let's see how the Chancellor reacts to this.",
            "Temporal synchronization levels are fluctuating due to this debate.",
            `Interesting point, @${operatorHandle}. But have you considered the ripple effects on the central cog matrix?`
          ];
          const replyContent = replyTemplates[Math.floor(Math.random() * replyTemplates.length)];
          const replyLikes = Math.floor(Math.random() * 25) + 1;
          const replyReposts = Math.floor(replyLikes * 0.3);

          const reactionComment: Comment = {
            id: `sim-comment-${Date.now()}`,
            post_id: postId,
            persona_id: randomPersona.id,
            content: replyContent,
            likes_count: replyLikes,
            created_at: new Date().toISOString(),
            persona: randomPersona
          } as any;
          (reactionComment as any).reposts_count = replyReposts;

          const currentSaved = localStorage.getItem(`chronos-user-comments-${worldId}`);
          const currentLocalComments: Comment[] = currentSaved ? JSON.parse(currentSaved) : [];
          currentLocalComments.unshift(reactionComment);
          localStorage.setItem(`chronos-user-comments-${worldId}`, JSON.stringify(currentLocalComments));

          setComments(prev => [reactionComment, ...prev]);
          setLocalCommentsCount(prev => prev + 1);
        }
      }, 1500);

      // Trigger a potential second reply 3.5 seconds later (40% chance)
      if (Math.random() < 0.4) {
        setTimeout(() => {
          if (worldPersonas.length > 0) {
            const otherPersonas = worldPersonas.filter(p => p.name !== newComment.persona?.name);
            const chosenList = otherPersonas.length > 0 ? otherPersonas : worldPersonas;
            const randomPersona = chosenList[Math.floor(Math.random() * chosenList.length)];
            
            const secondTemplates = [
              `I side with @${randomPersona.handle} on this. This alternative is dangerous.`,
              `Indeed! The timeline requires this exact calibration.`,
              `Can we get confirmation on this signal?`,
              `Fascinating indeed. Retransmitting.`
            ];
            
            const replyContent = secondTemplates[Math.floor(Math.random() * secondTemplates.length)];
            const replyLikes = Math.floor(Math.random() * 15);
            const replyReposts = Math.floor(replyLikes * 0.2);

            const reactionComment: Comment = {
              id: `sim-comment-2-${Date.now()}`,
              post_id: postId,
              persona_id: randomPersona.id,
              content: replyContent,
              likes_count: replyLikes,
              created_at: new Date().toISOString(),
              persona: randomPersona
            } as any;
            (reactionComment as any).reposts_count = replyReposts;

            const currentSaved = localStorage.getItem(`chronos-user-comments-${worldId}`);
            const currentLocalComments: Comment[] = currentSaved ? JSON.parse(currentSaved) : [];
            currentLocalComments.unshift(reactionComment);
            localStorage.setItem(`chronos-user-comments-${worldId}`, JSON.stringify(currentLocalComments));

            setComments(prev => [reactionComment, ...prev]);
            setLocalCommentsCount(prev => prev + 1);
          }
        }, 3500);
      }

    } catch (err: any) {
      setErrorComments(err.message || 'Failed to submit reply');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    setReposted(!reposted);
    setRepostsCount((prev) => (reposted ? prev - 1 : prev + 1));
  };

  // -------------------------------------------------------------
  // RENDERING: 1. NEWS CARD (THE CHRONOS TELEGRAPH)
  // -------------------------------------------------------------
  if (item.type === 'news') {
    const { title, content, category, publisher, created_at, image_url } = item.data;
    return (
      <motion.div
        className={`bg-[var(--card-bg)] text-text-main p-6 rounded-none shadow-md font-serif relative overflow-hidden select-none transition-all duration-300 ${
          isNewspaper 
            ? 'border-4 border-double border-primary-base/40 hover:border-primary-base/80' 
            : 'border border-white/10 hover:border-accent-base/40'
        }`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Tiny aged print overlays */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:4px_4px]" />
        
        {/* Masthead */}
        <div className="flex flex-col items-center border-b-4 border-double border-primary-base pb-3 mb-4">
          <div className="flex items-center gap-2 text-[10px] tracking-[0.2em] font-serif font-black uppercase text-primary-base/80 mb-1">
            <Newspaper size={12} className="text-primary-base" />
            {publisher || 'The Chronos Daily'}
          </div>
          <h4 className="text-3xl md:text-4xl font-black uppercase text-center my-3 tracking-tight font-serif text-primary-base leading-tight hover:opacity-95 transition-opacity">
            {title}
          </h4>
          <div className="flex justify-between w-full text-[9px] font-serif uppercase text-primary-base/70 pt-1.5 border-t border-primary-base/20 font-bold">
            <span>Section: {category}</span>
            <span suppressHydrationWarning>{new Date(created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Content */}
        <TelegraphPrintText text={content} />

        {image_url && (
          <div className={
            isNewspaper
              ? "w-full overflow-hidden mt-3 border border-primary-base/20 rounded-none"
              : "w-full overflow-hidden mt-3 border border-white/10 rounded-lg"
          }>
            <img
              src={image_url}
              alt="Telegraph news photo"
              className={`w-full h-auto object-cover max-h-[180px] ${
                isNewspaper ? 'filter sepia contrast-125 brightness-95 grayscale' : ''
              }`}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = getFallbackUnsplashUrl(title + " " + content);
              }}
            />
          </div>
        )}

        {/* Newspaper Footer */}
        <div className="mt-4 pt-3 border-t border-dashed border-primary-base/30 flex justify-between items-center text-[10px] font-serif text-text-dim">
          <span>PRICE: 1 PENNY</span>
          <span>IMPERIAL PRESS LICENSE #408</span>
        </div>
      </motion.div>
    );
  }

  // -------------------------------------------------------------
  // RENDERING: 2. ADVERTISEMENT CARD (BLUEPRINT SOLUTION)
  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // RENDERING: 2. ADVERTISEMENT CARD (BLUEPRINT SOLUTION)
  // -------------------------------------------------------------
  if (item.type === 'ad') {
    const { company_name, tagline, description, price, created_at, image_url } = item.data;
    if (isNewspaper) {
      return (
        <motion.div
          className="bg-[var(--card-bg)] text-primary-base border-2 border-dashed border-primary-base/30 p-6 rounded-none font-serif relative overflow-hidden flex flex-col justify-between min-h-[280px] h-auto select-none hover:border-primary-base hover:bg-black/[0.01] transition-all duration-300"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Half-tone noise effect */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] bg-[size:4px_4px]" />
          
          <div>
            <div className="flex items-center justify-between border-b border-primary-base/20 pb-2 mb-3">
              <span className="text-[10px] tracking-widest text-text-dim uppercase flex items-center gap-1.5 font-bold">
                <Tag size={12} className="text-primary-base" />
                Patent Commercial
              </span>
              <span className="text-xs font-bold border border-primary-base px-2 py-0.5 uppercase">
                {price}
              </span>
            </div>

            <h4 className="text-lg font-black text-primary-base tracking-wide uppercase font-serif mb-1">
              {company_name}
            </h4>
            <p className="text-xs text-text-dim italic mb-3">"{tagline}"</p>
            <p className="text-xs text-primary-base/80 leading-relaxed font-sans line-clamp-4">
              {description}
            </p>
            {image_url && (
              <div className="w-full overflow-hidden mt-3 border border-primary-base/20 rounded-none">
                <img
                  src={image_url}
                  alt="Patent commercial illustration"
                  className="w-full h-auto object-cover max-h-[140px] filter sepia contrast-125 brightness-95 grayscale"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getFallbackUnsplashUrl(company_name + " " + tagline + " " + description);
                  }}
                />
              </div>
            )}
          </div>

          <div className="border-t border-primary-base/20 mt-4 pt-2 flex justify-between items-center text-[9px] text-text-dim">
            <span>BABBAGE ENTERPRISES CO.</span>
            <span suppressHydrationWarning>{new Date(created_at).toLocaleDateString()}</span>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
        className="bg-[#0b2447] text-[#5fd6fa] border border-[#19376d] p-6 rounded-lg font-mono relative overflow-hidden flex flex-col justify-between min-h-[280px] h-auto select-none hover:border-[#5fd6fa]/50 hover:shadow-[0_0_25px_rgba(95,214,250,0.25)] transition-all duration-300"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Blueprint grids */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(95,214,250,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(95,214,250,0.03)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
        
        <div>
          <div className="flex items-center justify-between border-b border-[#19376d] pb-2.5 mb-3.5">
            <span className="text-[10px] tracking-widest text-[#a5f3fc] uppercase flex items-center gap-1.5">
              <Tag size={12} />
              Patent Commercial
            </span>
            <span className="text-xs font-bold text-amber-400 border border-amber-400/40 px-2 py-0.5 rounded">
              {price}
            </span>
          </div>

          <h4 className="text-lg font-bold text-white tracking-wide uppercase font-serif mb-1">
            {company_name}
          </h4>
          <p className="text-xs text-[#a5f3fc] italic mb-3">"{tagline}"</p>
          <p className="text-xs text-[#a5f3fc]/80 leading-relaxed font-sans line-clamp-4">
            {description}
          </p>
          {image_url && (
            <div className="w-full overflow-hidden mt-3 border border-white/10 rounded-lg">
              <img
                src={image_url}
                alt="Blueprint commercial illustration"
                className="w-full h-auto object-cover max-h-[140px]"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = getFallbackUnsplashUrl(company_name + " " + tagline + " " + description);
                }}
              />
            </div>
          )}
        </div>

        <div className="border-t border-[#19376d]/50 mt-4 pt-2.5 flex justify-between items-center text-[9px] text-[#5fd6fa]/60">
          <span>BABBAGE ENTERPRISES CO.</span>
          <span suppressHydrationWarning>{new Date(created_at).toLocaleDateString()}</span>
        </div>
      </motion.div>
    );
  }

  // -------------------------------------------------------------
  // RENDERING: 3. POLYSOCIAL FEED CARD (POSTS)
  // -------------------------------------------------------------
  const { id, content, created_at, persona } = item.data;
  const role = persona?.role || 'INFLUENCER';

  // Sub-classification of post styles based on Author Role
  const getPostStyle = (authorRole: string) => {
    if (isNewspaper) {
      switch (authorRole) {
        case 'SCIENTIST':
          return {
            headerBg: 'border-primary-base/20 text-text-dim',
            icon: <Binary size={12} className="text-primary-base" />,
            badgeLabel: 'Research Ledger',
            cardClass: 'border-primary-base/20 hover:border-primary-base/40 bg-black/[0.005]',
          };
        case 'POLITICIAN':
          return {
            headerBg: 'border-primary-base/20 text-text-dim',
            icon: <AlertTriangle size={12} className="text-primary-base" />,
            badgeLabel: 'State Gazette',
            cardClass: 'border-primary-base/20 hover:border-primary-base/40 bg-black/[0.015]',
          };
        case 'BRAND':
          return {
            headerBg: 'border-primary-base/20 text-text-dim',
            icon: <Compass size={12} className="text-primary-base" />,
            badgeLabel: 'Industrial Dispatch',
            cardClass: 'border-primary-base/20 hover:border-primary-base/40 bg-black/[0.005]',
          };
        default:
          return {
            headerBg: 'border-primary-base/20 text-text-dim',
            icon: <Compass size={12} className="text-primary-base" />,
            badgeLabel: 'Temporal Feed',
            cardClass: 'border-primary-base/20 hover:border-primary-base/40 bg-black/[0.005]',
          };
      }
    }

    switch (authorRole) {
      case 'SCIENTIST':
        return {
          headerBg: 'border-emerald-500/20 text-emerald-400',
          icon: <Binary size={14} />,
          badgeLabel: 'Research Ledger',
          cardClass: 'hover:border-emerald-500/30',
        };
      case 'POLITICIAN':
        return {
          headerBg: 'border-red-500/20 text-red-400',
          icon: <AlertTriangle size={14} />,
          badgeLabel: 'State Gazette',
          cardClass: 'hover:border-red-500/30 bg-gradient-to-r from-red-500/5 via-transparent to-transparent',
        };
      case 'BRAND':
        return {
          headerBg: 'border-amber-500/20 text-amber-400',
          icon: <Compass size={14} />,
          badgeLabel: 'Industrial Dispatch',
          cardClass: 'hover:border-amber-500/30',
        };
      default:
        return {
          headerBg: 'border-primary-base/20 text-primary-base',
          icon: <Compass size={14} />,
          badgeLabel: 'Temporal Feed',
          cardClass: '',
        };
    }
  };

  const styleMeta = getPostStyle(role);

  return (
    <motion.div
      className={
        isNewspaper
          ? `border border-primary-base/20 p-5 rounded-none flex flex-col gap-4 select-none transition-all duration-300 shadow-sm hover:shadow-md ${styleMeta.cardClass}`
          : `glass-panel p-5 rounded-xl border border-border-color flex flex-col gap-4 select-none ${styleMeta.cardClass}`
      }
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Author and Metadata Header */}
      <div className="flex items-start justify-between">
        <div 
          className={`flex items-center gap-3 ${persona?.id === 'local-persona-id' ? 'select-none' : 'cursor-pointer group/author'}`}
          onClick={() => persona?.id !== 'local-persona-id' && onPersonaClick && onPersonaClick(persona?.id || '')}
        >
          {/* Avatar Placeholder */}
          <div className={
            isNewspaper
              ? "w-10 h-10 rounded-none border-2 border-primary-base bg-background flex items-center justify-center font-serif font-black text-primary-base text-sm hover:bg-black/[0.03] transition-colors"
              : "w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-serif font-bold text-accent-base text-sm group-hover/author:border-accent-base group-hover/author:text-glow transition-all duration-300"
          }>
            {persona?.name ? persona.name.charAt(0) : '?'}
          </div>

          <div>
            <div className={`text-sm font-bold group-hover/author:text-accent-base transition-colors duration-200 flex items-center gap-1.5 ${
              isNewspaper ? 'text-primary-base font-serif' : 'text-text-main'
            }`}>
              {persona?.name || 'Charles Babbage III'}
              <span className={`text-[9px] px-1.5 py-0.5 border rounded font-normal ${
                isNewspaper 
                  ? 'bg-black/[0.02] border-primary-base/10 text-text-dim' 
                  : 'bg-white/5 border-white/10 text-text-dim'
              }`}>
                Influence: {persona?.influence_score || 50}
              </span>
            </div>
            <div className={`text-xs text-text-dim`}>
              @{persona?.handle || 'steam_coder_99'}
            </div>
          </div>
        </div>

        {/* Faction/Topic Classification Badge */}
        <div className={
          isNewspaper
            ? `flex items-center gap-1 font-serif text-[9px] border rounded-none px-2 py-0.5 bg-black/[0.01] ${styleMeta.headerBg}`
            : `flex items-center gap-1 font-mono text-[9px] border rounded-full px-2.5 py-0.5 bg-white/5 ${styleMeta.headerBg}`
        }>
          {styleMeta.icon}
          <span>{styleMeta.badgeLabel}</span>
        </div>
      </div>

      {/* Main Content */}
      <p className={
        isNewspaper 
          ? "text-xs leading-relaxed text-primary-base/95 font-serif first-letter:text-3xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:leading-none"
          : "text-sm leading-relaxed text-text-main font-sans"
      }>
        {content}
      </p>

      {/* Post Image Attachment */}
      {item.data.media_url && (
        <div className={`w-full overflow-hidden mt-2 ${
          isNewspaper
            ? 'border border-primary-base/20 rounded-none'
            : 'border border-white/10 rounded-lg'
        }`}>
          <img
            src={item.data.media_url}
            alt="Temporal feed media"
            className={`w-full h-auto object-cover max-h-[300px] ${
              isNewspaper ? 'filter sepia contrast-125 brightness-95 grayscale' : ''
            }`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = getFallbackUnsplashUrl(item.data.content);
            }}
          />
        </div>
      )}

      {/* Social Engagement Panel */}
      <div className="flex justify-between items-center pt-3 border-t border-white/5 text-text-dim text-xs font-mono">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              liked ? 'text-rose-500 text-glow' : 'hover:text-rose-400'
            }`}
          >
            <Heart size={14} className={liked ? 'fill-current' : ''} />
            <span>{likesCount}</span>
          </button>

          <button
            onClick={handleRepost}
            className={`flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              reposted ? 'text-green-400 text-glow' : 'hover:text-green-400'
            }`}
          >
            <RotateCw size={14} className={reposted ? 'rotate-180 duration-500' : ''} />
            <span>{repostsCount}</span>
          </button>
          <button
            onClick={handleToggleComments}
            className={`flex items-center gap-1.5 transition-all duration-200 cursor-pointer hover:text-blue-400 ${
              showComments ? 'text-blue-400 text-glow' : ''
            }`}
          >
            <MessageSquare size={14} />
            <span>{comments.length > 0 ? comments.length : (localCommentsCount + Math.floor(likesCount * 0.15))}</span>
          </button>
        </div>

        <span className="text-[10px] text-text-dim/60">
          {new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      {/* Collapsible Comments Section */}
      {showComments && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`pt-4 mt-2 overflow-hidden flex flex-col gap-3 border-t ${
            isNewspaper ? 'border-primary-base/15' : 'border-white/5'
          }`}
        >
          <h5 className={`text-[10px] font-bold uppercase tracking-wider ${
            isNewspaper ? 'font-serif text-primary-base' : 'font-mono text-text-dim'
          }`}>
            {isNewspaper ? 'Communication Ledger' : 'COMMUNICATION THREAD'}
          </h5>

          {/* Comment composer */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2 items-stretch mt-1 mb-2">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder={isNewspaper ? "Draft dispatch reply..." : "Transmit reply signal..."}
              className={
                isNewspaper
                  ? "flex-1 bg-black/[0.01] border border-primary-base/20 px-3 py-1.5 text-xs text-primary-base focus:outline-none focus:border-primary-base placeholder-primary-base/40 font-serif"
                  : "flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-text-main focus:outline-none focus:border-accent-base focus:ring-1 focus:ring-accent-base/30 transition-all font-sans placeholder-text-dim/50"
              }
            />
            <button
              type="submit"
              disabled={!newCommentText.trim() || submittingComment}
              className={
                isNewspaper
                  ? "border border-primary-base px-3 py-1.5 text-[10px] font-serif font-bold uppercase hover:bg-primary-base hover:text-[var(--bg-color)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shrink-0"
                  : "border border-accent-base hover:bg-accent-base/15 text-accent-base px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 shrink-0"
              }
            >
              <span>{submittingComment ? 'Sending...' : 'Reply'}</span>
            </button>
          </form>

          {loadingComments && (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse flex items-start gap-3">
                  <div className={`w-8 h-8 ${
                    isNewspaper ? 'bg-black/5 border border-primary-base/10 rounded-none' : 'w-8 h-8 rounded-full bg-white/5 border border-white/10'
                  }`} />
                  <div className="flex-1 space-y-1.5 py-0.5">
                    <div className={`h-2 rounded w-1/4 ${isNewspaper ? 'bg-black/5' : 'bg-white/5'}`} />
                    <div className={`h-3 rounded w-3/4 ${isNewspaper ? 'bg-black/5' : 'bg-white/5'}`} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {errorComments && (
            <div className={`text-xs ${isNewspaper ? 'font-serif text-primary-base' : 'font-mono text-rose-400'}`}>
              [TRANSMISSION ERROR]: {errorComments}
            </div>
          )}

          {!loadingComments && !errorComments && comments.length === 0 && (
            <div className={`text-xs italic py-1 ${isNewspaper ? 'font-serif text-text-dim' : 'font-mono text-text-dim/60'}`}>
              No replies registered in this sector.
            </div>
          )}

          {!loadingComments && !errorComments && comments.length > 0 && (
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {comments.map((comment) => {
                const commentRole = comment.persona?.role;
                const roleColor =
                  commentRole === 'SCIENTIST'
                    ? 'text-emerald-400'
                    : commentRole === 'POLITICIAN'
                    ? 'text-red-400'
                    : commentRole === 'BRAND'
                    ? 'text-amber-400'
                    : 'text-accent-base';

                return (
                  <div key={comment.id} className={`flex items-start gap-3 text-xs pb-3 last:border-0 last:pb-0 border-b ${
                    isNewspaper ? 'border-primary-base/10' : 'border-white/[0.02]'
                  }`}>
                    <div className={
                      isNewspaper
                        ? "w-8 h-8 border border-primary-base bg-background flex items-center justify-center font-serif font-bold text-primary-base flex-shrink-0"
                        : "w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center font-serif font-bold text-accent-base flex-shrink-0"
                    }>
                      {comment.persona?.name ? comment.persona.name.charAt(0) : '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-bold ${isNewspaper ? 'text-primary-base font-serif' : 'text-text-main'}`}>
                          {comment.persona?.name || 'Unknown Citizen'}
                        </span>
                        <span className={
                          isNewspaper
                            ? 'font-serif text-[10px] text-text-dim'
                            : `font-mono text-[10px] ${roleColor}`
                        }>
                          @{comment.persona?.handle || 'unknown'}
                        </span>
                      </div>
                      <p className={`mt-1 leading-relaxed break-words ${
                        isNewspaper ? 'text-primary-base/90 font-serif' : 'text-text-main/80 font-sans'
                      }`}>
                        {comment.content}
                      </p>
                      
                      {/* Comment Engagement row */}
                      <div className="flex items-center gap-4 mt-1.5 text-[9px] font-mono text-text-dim/75 select-none">
                        <span className="flex items-center gap-1">
                          <Heart size={10} className="text-primary-base" />
                          <span>{comment.likes_count}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <RotateCw size={10} className="text-primary-base" />
                          <span>{(comment as any).reposts_count ?? Math.max(1, Math.floor(comment.likes_count * 0.3))}</span>
                        </span>
                        <span className="text-[8px] text-text-dim/50 ml-auto" suppressHydrationWarning>
                          {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
