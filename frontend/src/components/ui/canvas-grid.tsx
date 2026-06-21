'use client';

import React, { useEffect, useRef } from 'react';

export default function CanvasGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Track mouse coordinate offsets for interactive drift
    let mouseX = -9999;
    let mouseY = -9999;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Particles representing "historical events" or nodes in the universe
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      pulse: number;
    }

    const particles: Particle[] = [];
    const numParticles = 45;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.15,
        pulse: Math.random() * 0.03 + 0.005,
      });
    }

    // Get color from active CSS theme variables
    const getThemeColors = () => {
      if (typeof window === 'undefined') return { primary: '99, 102, 241', accent: '236, 72, 153' };
      const style = getComputedStyle(document.documentElement);
      const primary = style.getPropertyValue('--color-primary').trim() || '99 102 241';
      const accent = style.getPropertyValue('--color-accent').trim() || '236 72 153';
      return { primary, accent };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const colors = getThemeColors();
      const primaryColor = `rgba(${colors.primary.replace(/\s+/g, ',')}, `;
      const accentColor = `rgba(${colors.accent.replace(/\s+/g, ',')}, `;

      // Draw drifting Grid Lines
      ctx.strokeStyle = `${primaryColor}0.025)`;
      ctx.lineWidth = 1;

      const gridSize = 65;
      const xOffset = (Date.now() * 0.003) % gridSize;
      const yOffset = (Date.now() * 0.003) % gridSize;

      for (let x = xOffset; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = yOffset; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw particulate dust
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Boundary bounce
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse repulsion: push particles away gently
        if (mouseX !== -9999 && mouseY !== -9999) {
          const dx = p.x - mouseX;
          const dy = p.y - mouseY;
          const dist = Math.hypot(dx, dy);
          if (dist < 130) {
            const force = (130 - dist) * 0.015;
            p.x += (dx / dist) * force;
            p.y += (dy / dist) * force;
          }
        }

        // Pulse alpha
        p.alpha += p.pulse;
        if (p.alpha > 0.75 || p.alpha < 0.12) {
          p.pulse *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${accentColor}${p.alpha})`;
        ctx.fill();

        // Draw links between close particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 160) {
            const linkAlpha = (1 - dist / 160) * 0.06 * Math.min(p.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${primaryColor}${linkAlpha})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />
      {/* Tactile Parchment Paper Grain Overlay */}
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.018] z-30">
        <filter id="parchmentNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#parchmentNoise)" />
      </svg>
    </>
  );
}
