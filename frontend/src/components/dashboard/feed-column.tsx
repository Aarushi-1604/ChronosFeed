'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Database } from 'lucide-react';
import FeedCard, { FeedItem } from '../cards/feed-card';
import FeedComposer from './feed-composer';
import { Post } from '../../types';

interface FeedColumnProps {
  initialItems: FeedItem[];
  worldId: string;
  hasMore: boolean;
  nextCursor: string | null;
  onLoadMore: () => Promise<void>;
  onPersonaClick?: (personaId: string) => void;
  onAddLocalPost: (content: string, faction: string) => void;
  isLoadingMore: boolean;
  feedLoading: boolean;
}

export default function FeedColumn({
  initialItems,
  worldId,
  hasMore,
  nextCursor,
  onLoadMore,
  onPersonaClick,
  onAddLocalPost,
  isLoadingMore,
  feedLoading,
}: FeedColumnProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoadingMore]);
  return (
    <div className="flex flex-col gap-9 h-full md:max-h-[calc(100vh-140px)] max-h-none overflow-y-auto pr-2 custom-scrollbar select-none">
      {/* Compose Feed Box */}
      <FeedComposer onPublish={onAddLocalPost} />

      {/* Feed Stream */}
      {feedLoading ? (
        <div className="flex flex-col gap-9">
          {/* Post Skeleton */}
          <div className="glass-panel p-5 rounded-xl border border-border-color/40 flex flex-col gap-4 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10" />
                <div className="space-y-1.5 py-0.5">
                  <div className="h-3 bg-white/5 rounded w-28" />
                  <div className="h-3 bg-white/5 rounded w-16" />
                </div>
              </div>
              <div className="h-5 bg-white/5 rounded-full w-24" />
            </div>
            <div className="space-y-2">
              <div className="h-3.5 bg-white/5 rounded w-full" />
              <div className="h-3.5 bg-white/5 rounded w-[90%]" />
              <div className="h-3.5 bg-white/5 rounded w-[40%]" />
            </div>
            <div className="border-t border-white/5 pt-3 flex justify-between items-center">
              <div className="flex gap-6">
                <div className="h-3 bg-white/5 rounded w-12" />
                <div className="h-3 bg-white/5 rounded w-12" />
                <div className="h-3 bg-white/5 rounded w-12" />
              </div>
              <div className="h-3 bg-white/5 rounded w-10" />
            </div>
          </div>

          {/* News Skeleton */}
          <div className="bg-[#f2ebd9]/20 border-2 border-[#806f50]/40 p-6 rounded-sm shadow-md font-serif flex flex-col gap-4 animate-pulse">
            <div className="flex flex-col items-center border-b border-dashed border-[#806f50]/30 pb-3">
              <div className="h-3 bg-[#806f50]/10 rounded w-20 mb-2" />
              <div className="h-6 bg-[#806f50]/15 rounded w-3/4 mb-1.5" />
              <div className="h-2.5 bg-[#806f50]/10 rounded w-1/2" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-[#806f50]/15 rounded w-full" />
              <div className="h-3 bg-[#806f50]/15 rounded w-[95%]" />
              <div className="h-3 bg-[#806f50]/15 rounded w-[80%]" />
            </div>
            <div className="border-t border-dashed border-[#806f50]/20 pt-3 flex justify-between">
              <div className="h-2.5 bg-[#806f50]/10 rounded w-12" />
              <div className="h-2.5 bg-[#806f50]/10 rounded w-24" />
            </div>
          </div>

          {/* Ad Skeleton */}
          <div className="bg-[#0b2447]/20 border border-[#19376d]/40 p-6 rounded-lg font-mono flex flex-col justify-between h-[280px] animate-pulse">
            <div>
              <div className="flex items-center justify-between border-b border-[#19376d]/20 pb-2.5 mb-3.5">
                <div className="h-3 bg-[#5fd6fa]/10 rounded w-20" />
                <div className="h-4 bg-[#5fd6fa]/15 rounded w-12" />
              </div>
              <div className="h-5 bg-white/5 rounded w-1/3 mb-2" />
              <div className="h-3 bg-[#5fd6fa]/10 rounded w-1/2 mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-[#5fd6fa]/10 rounded w-full" />
                <div className="h-3 bg-[#5fd6fa]/10 rounded w-[85%]" />
                <div className="h-3 bg-[#5fd6fa]/10 rounded w-[90%]" />
              </div>
            </div>
            <div className="border-t border-[#19376d]/20 pt-2.5 flex justify-between">
              <div className="h-2 bg-[#5fd6fa]/10 rounded w-24" />
              <div className="h-2 bg-[#5fd6fa]/10 rounded w-16" />
            </div>
          </div>
        </div>
      ) : initialItems.length > 0 ? (
        <div className="flex flex-col gap-9">
          <AnimatePresence initial={false}>
            {initialItems.map((item) => {
              // Create unique key based on type + ID
              const itemKey = `${item.type}-${item.type === 'post' ? item.data.id : item.type === 'news' ? item.data.id : item.data.id}`;
              return (
                <motion.div
                  key={itemKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <FeedCard item={item} onPersonaClick={onPersonaClick} />
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Load More Button */}
          {hasMore && (
            <div ref={loadMoreRef}>
              <div className="flex justify-center mt-2 mb-6">
                <button
                  onClick={onLoadMore}
                  disabled={isLoadingMore}
                  className="glass-button w-full py-3.5 rounded-xl text-xs font-mono uppercase tracking-wider font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <>
                      <RefreshCw className="animate-spin" size={14} />
                      <span>Syncing Temporal Stream...</span>
                    </>
                  ) : (
                    <>
                      <Database size={14} />
                      <span>Retrieve Further Records</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 glass-panel rounded-xl text-center border-dashed">
          <span className="font-mono text-sm text-text-dim">No transmissions detected in this reality.</span>
        </div>
      )}
    </div>
  );
}
