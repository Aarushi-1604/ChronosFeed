import React from 'react';
import { useTheme } from '../../context/theme-context';

interface ChronosLogoProps {
  className?: string;
  size?: number;
}

export default function ChronosLogo({ className = '', size = 48 }: ChronosLogoProps) {
  const { theme } = useTheme();
  const isNewspaper = theme.startsWith('newspaper');

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.15)] ${className}`}
    >
      <defs>
        {/* Metallic Gold Gradient for Banner & Borders */}
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#AA771C" />
          <stop offset="20%" stopColor="#F5F5B7" />
          <stop offset="40%" stopColor="#C09F50" />
          <stop offset="60%" stopColor="#FDF7C5" />
          <stop offset="80%" stopColor="#B38728" />
          <stop offset="100%" stopColor="#AA771c" />
        </linearGradient>

        {/* Copper / Steampunk Bronze Gradient */}
        <linearGradient id="bronzeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5d4037" />
          <stop offset="30%" stopColor="#d7ccc8" />
          <stop offset="50%" stopColor="#8d6e63" />
          <stop offset="70%" stopColor="#efebe9" />
          <stop offset="100%" stopColor="#4e342e" />
        </linearGradient>

        {/* Deep Cosmic space background gradient */}
        <linearGradient id="spaceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#080b11" />
          <stop offset="60%" stopColor="#0f1626" />
          <stop offset="100%" stopColor="#1e2942" />
        </linearGradient>

        {/* Greece Temple / Ancient Parchment background gradient */}
        <linearGradient id="parchmentGradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d2c4a9" />
          <stop offset="50%" stopColor="#e9dec7" />
          <stop offset="100%" stopColor="#baab8e" />
        </linearGradient>

        {/* Glass shine gradient */}
        <linearGradient id="glassShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
        </linearGradient>

        {/* Reusable Steampunk Gear Group */}
        <g id="steampunkGear">
          <circle cx="0" cy="0" r="10" fill="url(#bronzeGradient)" stroke="url(#goldGradient)" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="5" fill="var(--bg-color)" stroke="url(#goldGradient)" strokeWidth="0.5" />
          {/* Gear Teeth */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
            <rect
              key={deg}
              x="-2"
              y="-14"
              width="4"
              height="5"
              fill="url(#bronzeGradient)"
              stroke="url(#goldGradient)"
              strokeWidth="0.4"
              rx="0.5"
              transform={`rotate(${deg} 0 0)`}
            />
          ))}
        </g>

        {/* Standard-compliant Clip Path for split background */}
        <clipPath id="clockClip">
          <circle cx="100" cy="90" r="71" />
        </clipPath>
      </defs>

      {/* ── BACKGROUND DIAL FRAME ── */}
      {/* Outer clock dial frame */}
      <circle cx="100" cy="90" r="76" fill="var(--bg-color)" stroke="url(#goldGradient)" strokeWidth="3" />
      <circle cx="100" cy="90" r="72" fill="none" stroke="url(#goldGradient)" strokeWidth="0.8" className="opacity-40" />

      {/* Split Dualities Background (Past Greece vs Future Space) */}
      <g clipPath="url(#clockClip)">
        {/* Left Side: Ancient Greece/Rome Temple (Parchment Background - Perfect Half-circle) */}
        <path d="M100,19 A71,71 0 0,0 100,161 Z" fill="url(#parchmentGradient)" />
        {/* Right Side: Deep Space Rocket Launch (Cosmic Starry Gradient - Perfect Half-circle) */}
        <path d="M100,19 A71,71 0 0,1 100,161 Z" fill="url(#spaceGradient)" />
      </g>

      {/* ── BACKGROUND DETAILS ── */}
      {/* Left side details: Greek Columns Temple */}
      <g className="opacity-45 font-serif" fill="#24180d" transform="translate(42, 68)">
        {/* Stylobate / Steps */}
        <rect x="0" y="24" width="46" height="3" />
        <rect x="3" y="27" width="40" height="3" />
        {/* Pediment (Triangle Roof) */}
        <polygon points="0,6 23,0 46,6" />
        <rect x="0" y="6" width="46" height="2" />
        {/* Columns */}
        <rect x="4" y="8" width="3.5" height="16" />
        <rect x="12" y="8" width="3.5" height="16" />
        <rect x="20" y="8" width="3.5" height="16" />
        <rect x="28" y="8" width="3.5" height="16" />
        <rect x="36" y="8" width="3.5" height="16" />
      </g>

      {/* Right side details: Rocket & Planets */}
      <g transform="translate(115, 45)">
        {/* Stars */}
        <circle cx="45" cy="5" r="1.2" fill="#fff" className="animate-pulse" />
        <circle cx="10" cy="-15" r="0.8" fill="#fff" className="animate-pulse" />
        <circle cx="35" cy="-25" r="1.5" fill="#fff" />
        {/* Moon / Planet */}
        <circle cx="40" cy="-10" r="6" fill="#fff" className="opacity-80" />
        <circle cx="38" cy="-12" r="2" fill="rgba(0,0,0,0.15)" />
        {/* Rocket Fire/Plume */}
        <path d="M19,30 C15,35 15,48 20,55 C25,48 25,35 21,30 Z" fill="#FF8A00" className="animate-pulse" />
        <path d="M18,35 C16,38 16,45 20,50 C24,45 24,38 22,35 Z" fill="#FFD600" className="animate-pulse" />
        {/* Space Rocket */}
        <path d="M15,30 L20,5 L25,30 Z" fill="url(#goldGradient)" /> {/* Nose/Body */}
        <rect x="18" y="15" width="4" height="20" fill="url(#bronzeGradient)" rx="1" />
        <circle cx="20" cy="22" r="1.5" fill="#080b11" />
        {/* Fins */}
        <path d="M15,25 L10,35 L17,33 Z" fill="url(#goldGradient)" />
        <path d="M25,25 L30,35 L23,33 Z" fill="url(#goldGradient)" />
      </g>

      {/* ── CLOCK MARKS & ROMAN NUMERAL ── */}
      {/* Roman XII at top */}
      <text
        x="100"
        y="32"
        fontFamily="serif"
        fontSize="12"
        fontWeight="bold"
        textAnchor="middle"
        fill="url(#goldGradient)"
        className="tracking-wide"
      >
        XII
      </text>
      {/* Dial ticks */}
      {[30, 60, 120, 150, 210, 240, 300, 330].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = (100 + Math.cos(rad) * 64).toFixed(3);
        const y1 = (90 + Math.sin(rad) * 64).toFixed(3);
        const x2 = (100 + Math.cos(rad) * 70).toFixed(3);
        const y2 = (90 + Math.sin(rad) * 70).toFixed(3);
        return (
          <line
            key={deg}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#goldGradient)"
            strokeWidth="1.2"
            className="opacity-55"
          />
        );
      })}

      {/* ── DYNAMIC SPINNING GEARS ── */}
      {/* Left Gear (Counter-Clockwise) */}
      <g transform="translate(32, 85)">
        <g>
          <use href="#steampunkGear" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 0"
            to="-360 0 0"
            dur="26s"
            repeatCount="indefinite"
          />
        </g>
      </g>
      {/* Right Gear (Clockwise) */}
      <g transform="translate(168, 85)">
        <g>
          <use href="#steampunkGear" />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 0"
            to="360 0 0"
            dur="20s"
            repeatCount="indefinite"
          />
        </g>
      </g>

      {/* ── THE HOURGLASS (TEMPORAL SYMBOL) ── */}
      <g transform="translate(100, 85)">
        {/* Pillars / Columns */}
        <line x1="-22" y1="-44" x2="-22" y2="44" stroke="url(#goldGradient)" strokeWidth="4" strokeLinecap="round" />
        <line x1="22" y1="-44" x2="22" y2="44" stroke="url(#goldGradient)" strokeWidth="4" strokeLinecap="round" />
        
        {/* Top & Bottom Metal Caps */}
        <rect x="-26" y="-48" width="52" height="6" fill="url(#goldGradient)" rx="2" />
        <rect x="-26" y="42" width="52" height="6" fill="url(#goldGradient)" rx="2" />
        
        {/* Glass Bulbs Shape - Cross-browser compatible fill-opacity */}
        <path
          d="M-18,-42 C-18,-15 -2,-5 -2,0 C-2,5 -18,15 -18,42 L18,42 C18,15 2,5 2,0 C2,-5 18,-15 18,-42 Z"
          fill="#ffffff"
          fillOpacity={0.07}
          stroke="url(#goldGradient)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* ── SAND DYNAMICS ── */}
        {/* Draining pile (Top) */}
        <path d="M-15,-40 C-12,-28 12,-28 15,-40 Z" fill="#E8C35E" className="opacity-85" />
        
        {/* Falling Sand Stream */}
        <line
          x1="0"
          y1="-38"
          x2="0"
          y2="38"
          stroke="#E8C35E"
          strokeWidth="2"
          strokeDasharray="4 6"
          className="animate-[dash_1.5s_linear_infinite]"
          style={{ strokeDashoffset: 10 }}
        />

        {/* Accumulating pile (Bottom) */}
        <path d="M-16,40 C-8,32 8,32 16,40 Z" fill="#E8C35E" className="opacity-95" />
        <path d="M-9,40 C-3,34 3,34 9,40 Z" fill="#FDF7C5" className="opacity-80 animate-pulse" />

        {/* Glass shines (Reflections) */}
        <path d="M-15,-38 C-12,-15 -2,-5 -2,0" stroke="url(#glassShine)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M15,38 C12,15 2,5 2,0" stroke="url(#glassShine)" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* ── METALLIC BANNER & CHRONOSFEED LABEL ── */}
      <g transform="translate(100, 138)">
        {/* Ribbon / Scroll Backdrop */}
        <path
          d="M-82,-12 L82,-12 C90,-12 94,-5 90,4 L82,16 C80,20 74,22 68,22 L-68,22 C-74,22 -80,20 -82,16 L-90,4 C-94,-5 -90,-12 -82,-12 Z"
          fill="#0F0C08"
          stroke="url(#goldGradient)"
          strokeWidth="3.5"
        />
        <path
          d="M-78,-8 L78,-8 C84,-8 87,-3 84,3 L78,12 C76,15 72,17 66,17 L-66,17 C-72,17 -76,15 -78,12 L-84,3 C-87,-3 -84,-8 -78,-8 Z"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="0.8"
          className="opacity-45"
        />
        
        {/* Scroll Ribbon Ends (Back folds) */}
        <path d="M-82,-12 L-92,-2 L-82,3 Z" fill="#6D4C18" stroke="url(#goldGradient)" strokeWidth="1" />
        <path d="M82,-12 L92,-2 L82,3 Z" fill="#6D4C18" stroke="url(#goldGradient)" strokeWidth="1" />

        {/* Bold ChronosFeed Lettering */}
        <text
          x="0"
          y="10"
          fontFamily="serif"
          fontSize="19"
          fontWeight="900"
          letterSpacing="0.05em"
          textAnchor="middle"
          fill="url(#goldGradient)"
          style={{ textShadow: '0px 2px 4px rgba(0,0,0,0.8)' }}
        >
          CHRONOSFEED
        </text>
      </g>

      {/* ── LOWER SHIELD / SUBTITLE ── */}
      {/* Under-shield frame with teeth at bottom */}
      <path
        d="M60,160 C75,168 125,168 140,160 L134,166 C124,171 76,171 66,166 Z"
        fill="url(#bronzeGradient)"
        stroke="url(#goldGradient)"
        strokeWidth="1.2"
      />
      
      {/* Subtext: HISTORY - SIMULATION - BEYOND */}
      <text
        x="100"
        y="173"
        fontFamily="sans-serif"
        fontSize="6.5"
        fontWeight="800"
        letterSpacing="0.18em"
        textAnchor="middle"
        fill="url(#goldGradient)"
        className="uppercase font-bold"
      >
        HISTORY – SIMULATION – BEYOND
      </text>

      {/* Small hanging gear detail at bottom center */}
      <path d="M96,178 L104,178 L100,183 Z" fill="url(#goldGradient)" />
      <circle cx="100" cy="184" r="3" fill="url(#bronzeGradient)" stroke="url(#goldGradient)" strokeWidth="0.5" />
    </svg>
  );
}
