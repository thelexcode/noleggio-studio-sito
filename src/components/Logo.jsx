import React from 'react';

const Logo = ({ className = "h-12 w-auto", ...props }) => {
  return (
    <svg
      viewBox="0 0 280 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="HD Studio"
      style={{ overflow: 'visible' }}
      className={className}
      {...props}
    >
      <defs>
        <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" runButt="true"/>
        </filter>

        <linearGradient id="metal-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E0E0E0" />
          <stop offset="50%" stopColor="#B0B0B0" />
          <stop offset="100%" stopColor="#E0E0E0" />
        </linearGradient>

        <linearGradient id="red-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF4D4D" />
          <stop offset="100%" stopColor="#CC0000" />
        </linearGradient>
      </defs>

      {/* Viewfinder Corners (The Rectangle Borders) */}
      <g stroke="currentColor" strokeWidth="4" strokeLinecap="round">
        {/* Top Left */}
        <path d="M 10,35 V 10 H 35" />
        {/* Top Right */}
        <path d="M 245,10 H 270 V 35" />
        {/* Bottom Right */}
        <path d="M 270,85 V 110 H 245" />
        {/* Bottom Left */}
        <path d="M 35,110 H 10 V 85" />
      </g>

      {/* Center Content Group */}
      <g transform="translate(20, 10)">
          {/* Pill Frame */}
          <rect
            x="50"
            y="15"
            width="140"
            height="50"
            rx="25"
            stroke="#A0A0A0"
            strokeWidth="4"
            fill="none"
            filter="url(#drop-shadow)"
          />

          {/* HD Text */}
          <text
            x="120"
            y="52"
            textAnchor="middle"
            fontSize="36"
            fontWeight="900"
            fontFamily="Arial, sans-serif"
            fill="url(#metal-gradient)"
            filter="url(#drop-shadow)"
            style={{ letterSpacing: '2px' }}
          >
            HD
          </text>

          {/* STUDIO Text */}
          <text
            x="120"
            y="85"
            textAnchor="middle"
            fontSize="16"
            fontWeight="bold"
            fontFamily="Arial, sans-serif"
            fill="currentColor"
            style={{ letterSpacing: '4px' }}
          >
            STUDIO
          </text>

          {/* Red Circle with Glow */}
          <circle 
            cx="50" 
            cy="40" 
            r="28" 
            fill="url(#red-gradient)" 
            filter="url(#glow-red)"
          />

           {/* Play Icon */}
          <path
            d="M 42,28 L 62,40 L 42,52 Z"
            fill="white"
            transform="translate(4, 0)" 
          />
      </g>
    </svg>
  );
};

export default Logo;
