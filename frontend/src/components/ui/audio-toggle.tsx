'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { getAudioEngine } from '../../lib/audio-engine';

export default function AudioToggle() {
  const [enabled, setEnabled] = useState(false);

  // Load initial audio preference
  useEffect(() => {
    const saved = localStorage.getItem('chronos-audio') === 'true';
    setEnabled(saved);
  }, []);

  // Sync state with audio engine and localStorage
  useEffect(() => {
    const engine = getAudioEngine();
    if (!engine) return;

    if (enabled) {
      engine.startAmbient();
      localStorage.setItem('chronos-audio', 'true');
    } else {
      engine.stopAmbient();
      localStorage.setItem('chronos-audio', 'false');
    }
  }, [enabled]);

  // Keypress listener for mechanical typewriter clicks
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Only click on actual text/symbol inputs to be satisfying, not modifiers/nav keys
      if (
        e.key.length === 1 ||
        e.key === 'Backspace' ||
        e.key === 'Enter' ||
        e.key === 'Spacebar' ||
        e.key === ' '
      ) {
        const engine = getAudioEngine();
        if (engine) {
          engine.playClick();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);

  // Listen to navigation transitions to play paper rustle
  useEffect(() => {
    if (!enabled) return;
    
    const engine = getAudioEngine();
    if (engine) {
      // Play a soft paper rustle on mount (e.g. when page changes)
      engine.playPageRustle();
    }
  }, [enabled]);

  const handleToggle = () => {
    setEnabled((prev) => !prev);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      title={enabled ? 'Mute engine audio' : 'Unmute engine audio'}
      className="border border-primary-base px-2.5 py-0.5 font-serif text-[9px] tracking-wider font-bold uppercase hover:bg-primary-base hover:text-[var(--bg-color)] transition-all duration-300 cursor-pointer flex items-center gap-1 shrink-0"
    >
      {enabled ? (
        <>
          <Volume2 size={10} className="animate-pulse" />
          <span>♨ Audio On</span>
        </>
      ) : (
        <>
          <VolumeX size={10} />
          <span>♨ Audio Off</span>
        </>
      )}
    </button>
  );
}
