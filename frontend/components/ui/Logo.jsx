import React from 'react';

export function Logo({ className, variant = 'default' }) {
  // variant: 'default' = light bg (deep greens), 'light' = dark bg (brighter greens + vibrant gold)
  const isDark = variant === 'light';

  // Gold tones
  const gold1 = isDark ? '#E8C97A' : '#B8945A';
  const gold2 = isDark ? '#C8A84B' : '#8A6A2A';

  // Forest green — lateral gradient: left (lit) → right (shadow)
  const greenLit   = isDark ? '#4A8C5C' : '#2E6B44';   // bright left edge
  const greenMid   = isDark ? '#2E6040' : '#1A4A2A';   // mid tone
  const greenShadow= isDark ? '#152E1F' : '#0A1F10';   // dark right edge / shadow

  // Trunk / ground
  const trunkColor = isDark ? '#3A6B46' : '#1D4A2B';

  const litId     = `lit-${variant}`;
  const shadowId  = `shadow-${variant}`;
  const goldId    = `gold-${variant}`;
  const groundId  = `ground-${variant}`;
  const textGradientId = `text-gradient-${variant}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 760 210"
      className={className}
      width="100%"
      height="100%"
    >
      <defs>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Playfair+Display:wght@700&display=swap');
          .logo-sm {
            font-family: 'Cinzel', 'Times New Roman', serif;
            font-size: 18px;
            font-weight: 500;
            letter-spacing: 8px;
          }
          .logo-lg {
            font-family: 'Playfair Display', 'Georgia', serif;
            font-size: 78px;
            font-weight: 700;
            letter-spacing: 3px;
          }
          .logo-xs {
            font-family: 'Cinzel', system-ui, sans-serif;
            font-size: 10.5px;
            font-weight: 400;
            letter-spacing: 4.5px;
          }
        `}</style>

        {/* Lateral shading gradient — left (light) to right (shadow) for 3D depth */}
        <linearGradient id={litId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={greenLit} />
          <stop offset="55%"  stopColor={greenMid} />
          <stop offset="100%" stopColor={greenShadow} />
        </linearGradient>

        {/* Slightly shifted for tall tree's right-edge shadow */}
        <linearGradient id={shadowId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={greenMid} />
          <stop offset="60%"  stopColor={greenMid} />
          <stop offset="100%" stopColor={greenShadow} />
        </linearGradient>

        {/* Ground curve gradient top-to-bottom */}
        <linearGradient id={groundId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={greenMid} />
          <stop offset="100%" stopColor={greenShadow} />
        </linearGradient>

        {/* Gold gradient */}
        <linearGradient id={goldId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={gold1} />
          <stop offset="100%" stopColor={gold2} />
        </linearGradient>

        {/* Text gradient for LAFORET (Deep Forest Green with light gradient) */}
        <linearGradient id={textGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor={isDark ? '#2E6B44' : '#1A4A2A'} />
          <stop offset="100%" stopColor={isDark ? '#225936' : '#10331C'} />
        </linearGradient>

        {/* Drop shadow filter for the whole icon */}
        <filter id={`shadow-filter-${variant}`} x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor={greenShadow} floodOpacity="0.5" />
        </filter>

        {/* Very light shadow for text */}
        <filter id={`text-shadow-${variant}`} x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="1" dy="2" stdDeviation="2" floodColor={greenShadow} floodOpacity="0.25" />
        </filter>
      </defs>

      <g filter={`url(#shadow-filter-${variant})`}>
        {/* ========== GROUND ROLLING HILL ========== */}
        <path
          fill={`url(#${groundId})`}
          d="M 8 188 C 60 162, 130 148, 200 162 C 260 174, 310 185, 350 188 C 310 188, 200 188, 8 188 Z"
        />

        {/* ========== SMALL TREE — LEFT ========== */}
        {/* trunk */}
        <rect fill={trunkColor} x="63" y="152" width="5" height="24" rx="1" />
        {/* bottom tier — widest */}
        <path
          fill={`url(#${litId})`}
          d="M 65.5 100
             C 58 112, 44 130, 40 148
             L 91 148
             C 87 130, 73 112, 65.5 100 Z"
        />
        {/* middle tier */}
        <path
          fill={`url(#${litId})`}
          d="M 65.5 70
             C 59 80, 47 96, 44 112
             L 87 112
             C 84 96, 72 80, 65.5 70 Z"
        />
        {/* top tier */}
        <path
          fill={`url(#${litId})`}
          d="M 65.5 42
             C 61 51, 52 64, 50 76
             L 81 76
             C 79 64, 70 51, 65.5 42 Z"
        />

        {/* ========== TALL TREE — RIGHT (behind house) ========== */}
        {/* trunk */}
        <rect fill={trunkColor} x="117" y="142" width="7" height="36" rx="1" />
        {/* bottom tier */}
        <path
          fill={`url(#${shadowId})`}
          d="M 120.5 82
             C 110 100, 88 132, 84 158
             L 157 158
             C 153 132, 131 100, 120.5 82 Z"
        />
        {/* middle tier */}
        <path
          fill={`url(#${shadowId})`}
          d="M 120.5 48
             C 111 64, 94 92, 90 112
             L 151 112
             C 147 92, 130 64, 120.5 48 Z"
        />
        {/* top tier */}
        <path
          fill={`url(#${shadowId})`}
          d="M 120.5 14
             C 113 28, 100 52, 97 70
             L 144 70
             C 141 52, 128 28, 120.5 14 Z"
        />
      </g>

      {/* ========== HOUSE ROOF ========== */}
      <path
        stroke={`url(#${goldId})`}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        d="M 154 108 L 191 77 L 272 126"
      />

      {/* Window grid — 2×2 */}
      <g fill={`url(#${goldId})`}>
        <rect x="177" y="112" width="9" height="9" rx="1.5" />
        <rect x="190" y="112" width="9" height="9" rx="1.5" />
        <rect x="177" y="125" width="9" height="9" rx="1.5" />
        <rect x="190" y="125" width="9" height="9" rx="1.5" />
      </g>

      {/* ========== TYPOGRAPHY ========== */}
      {/* Subtitle */}
      <text className="logo-sm" x="314" y="86" fill={`url(#${goldId})`}>
        AGENCE IMMOBILIÈRE
      </text>

      {/* Main brand name */}
      <text className="logo-lg" x="310" y="162" fill={`url(#${textGradientId})`} filter={`url(#text-shadow-${variant})`}>
        LAFORET
      </text>

      {/* Motto with flanking lines */}
      <line x1="314" y1="189" x2="338" y2="189" stroke={`url(#${goldId})`} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="672" y1="189" x2="696" y2="189" stroke={`url(#${goldId})`} strokeWidth="1.5" strokeLinecap="round"/>
      <text className="logo-xs" x="348" y="193" fill={`url(#${goldId})`}>
        VOTRE PROJET, NOTRE ENGAGEMENT
      </text>
    </svg>
  );
}
