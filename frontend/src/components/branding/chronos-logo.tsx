import React from 'react';

interface ChronosLogoProps {
  className?: string;
  size?: number;
}

export default function ChronosLogo({ className = '', size = 32 }: ChronosLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${className}`}
    >
      {/* Outer Hexagon / Frame */}
      <polygon
        points="50,5 89,27.5 89,72.5 50,95 11,72.5 11,27.5"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary-base opacity-40"
      />
      {/* Outer Ring / Gear representation */}
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="4 8"
        className="text-secondary-base animate-[spin_40s_linear_infinite]"
      />
      
      {/* Hourglass paths */}
      <path
        d="M30,25 L70,25 L50,50 L30,25 Z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
        className="text-accent-base"
      />
      <path
        d="M30,75 L70,75 L50,50 L30,75 Z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
        className="text-accent-base"
      />

      {/* Center Anchor / Simulation Node */}
      <circle
        cx="50"
        cy="50"
        r="4"
        fill="currentColor"
        className="text-white text-glow shadow-[0_0_8px_currentColor]"
      />
      
      {/* Simulated Time Particles */}
      <circle cx="50" cy="35" r="2" fill="currentColor" className="text-accent-base animate-pulse" />
      <circle cx="48" cy="60" r="1.5" fill="currentColor" className="text-secondary-base animate-pulse" />
      <circle cx="52" cy="68" r="2" fill="currentColor" className="text-secondary-base animate-pulse" />
    </svg>
  );
}
