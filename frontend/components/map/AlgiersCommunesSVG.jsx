"use client";

import React, { useState, useRef } from 'react';
import { Plus, Minus, RotateCcw, MapPin, TrendingUp, Home, Building2, Award } from 'lucide-react';

// Comprehensive dataset of Algiers luxury & central communes with polished SVG path geometries
export const ALGIERS_COMMUNES_DATA = [
  {
    id: 'zeralda',
    name: 'Zeralda',
    zone: 'Ouest Littoral',
    propsCount: 12,
    villasCount: 8,
    appartementsCount: 4,
    avgPrice: '120 M DA',
    avgSurface: '420 m²',
    trend: '+2% ce mois',
    // Western coast
    path: 'M 40 180 L 95 165 L 115 210 L 80 255 L 30 235 Z',
    centroid: { x: 72, y: 209 }
  },
  {
    id: 'ain_benian',
    name: 'Aïn Benian',
    zone: 'Ouest Littoral',
    propsCount: 14,
    villasCount: 9,
    appartementsCount: 5,
    avgPrice: '95 M DA',
    avgSurface: '340 m²',
    trend: '+4% ce mois',
    path: 'M 95 165 L 165 140 L 185 185 L 135 210 L 115 210 Z',
    centroid: { x: 139, y: 175 }
  },
  {
    id: 'cheraga',
    name: 'Chéraga',
    zone: 'Ouest Résidentiel',
    propsCount: 24,
    villasCount: 10,
    appartementsCount: 14,
    avgPrice: '78 M DA',
    avgSurface: '210 m²',
    trend: '+8% ce mois',
    path: 'M 165 140 L 235 130 L 255 185 L 195 210 L 185 185 Z',
    centroid: { x: 207, y: 166 }
  },
  {
    id: 'ouled_fayet',
    name: 'Ouled Fayet',
    zone: 'Ouest Résidentiel',
    propsCount: 9,
    villasCount: 5,
    appartementsCount: 4,
    avgPrice: '52 M DA',
    avgSurface: '175 m²',
    trend: '+1% ce mois',
    path: 'M 135 210 L 195 210 L 210 265 L 140 270 L 115 210 Z',
    centroid: { x: 159, y: 236 }
  },
  {
    id: 'dely_ibrahim',
    name: 'Dely Ibrahim',
    zone: 'Centre Ouest',
    propsCount: 18,
    villasCount: 7,
    appartementsCount: 11,
    avgPrice: '88 M DA',
    avgSurface: '230 m²',
    trend: '+5% ce mois',
    path: 'M 195 210 L 255 185 L 295 205 L 285 260 L 210 265 Z',
    centroid: { x: 248, y: 225 }
  },
  {
    id: 'bouzareah',
    name: 'Bouzaréah',
    zone: 'Hauteurs',
    propsCount: 11,
    villasCount: 7,
    appartementsCount: 4,
    avgPrice: '65 M DA',
    avgSurface: '290 m²',
    trend: '+2% ce mois',
    path: 'M 235 130 L 310 110 L 335 160 L 280 180 L 255 185 Z',
    centroid: { x: 283, y: 146 }
  },
  {
    id: 'el_biar',
    name: 'El Biar',
    zone: 'Hauteurs de Prestige',
    propsCount: 22,
    villasCount: 12,
    appartementsCount: 10,
    avgPrice: '145 M DA',
    avgSurface: '310 m²',
    trend: '+12% ce mois',
    path: 'M 280 180 L 335 160 L 375 175 L 360 215 L 295 205 Z',
    centroid: { x: 329, y: 186 }
  },
  {
    id: 'ben_aknoun',
    name: 'Ben Aknoun',
    zone: 'Hauteurs Résidentielles',
    propsCount: 15,
    villasCount: 6,
    appartementsCount: 9,
    avgPrice: '110 M DA',
    avgSurface: '240 m²',
    trend: '+6% ce mois',
    path: 'M 295 205 L 360 215 L 375 255 L 310 270 L 285 260 Z',
    centroid: { x: 335, y: 241 }
  },
  {
    id: 'hydra',
    name: 'Hydra',
    zone: 'Zone Diplomatique',
    propsCount: 31,
    villasCount: 18,
    appartementsCount: 13,
    avgPrice: '210 M DA',
    avgSurface: '480 m²',
    trend: '+15% ce mois',
    path: 'M 360 215 L 430 200 L 450 250 L 385 275 L 375 255 Z',
    centroid: { x: 400, y: 239 }
  },
  {
    id: 'sidi_yahia',
    name: 'Sidi Yahia',
    zone: 'Carré d&apos;Or',
    propsCount: 19,
    villasCount: 7,
    appartementsCount: 12,
    avgPrice: '135 M DA',
    avgSurface: '220 m²',
    trend: '+9% ce mois',
    path: 'M 385 275 L 450 250 L 470 300 L 395 315 L 375 255 Z',
    centroid: { x: 423, y: 284 }
  },
  {
    id: 'alger_centre',
    name: 'Alger Centre',
    zone: 'Cœur Historique',
    propsCount: 27,
    villasCount: 2,
    appartementsCount: 25,
    avgPrice: '62 M DA',
    avgSurface: '145 m²',
    trend: '+7% ce mois',
    path: 'M 335 160 L 415 130 L 455 170 L 430 200 L 375 175 Z',
    centroid: { x: 402, y: 167 }
  },
  {
    id: 'kouba',
    name: 'Kouba',
    zone: 'Est Résidentiel',
    propsCount: 16,
    villasCount: 8,
    appartementsCount: 8,
    avgPrice: '72 M DA',
    avgSurface: '210 m²',
    trend: '+3% ce mois',
    path: 'M 450 250 L 525 235 L 550 290 L 470 300 Z',
    centroid: { x: 498, y: 268 }
  },
  {
    id: 'birkhadem',
    name: 'Birkhadem',
    zone: 'Sud Prestige',
    propsCount: 13,
    villasCount: 9,
    appartementsCount: 4,
    avgPrice: '85 M DA',
    avgSurface: '320 m²',
    trend: '+4% ce mois',
    path: 'M 395 315 L 470 300 L 485 360 L 405 370 Z',
    centroid: { x: 438, y: 336 }
  },
  {
    id: 'bab_ezzouar',
    name: 'Bab Ezzouar',
    zone: 'Quartier d&apos;Affaires',
    propsCount: 14,
    villasCount: 1,
    appartementsCount: 13,
    avgPrice: '48 M DA',
    avgSurface: '135 m²',
    trend: '+11% ce mois',
    path: 'M 525 235 L 630 215 L 660 270 L 550 290 Z',
    centroid: { x: 591, y: 252 }
  },
  {
    id: 'dar_el_beida',
    name: 'Dar El Beïda',
    zone: 'Est International',
    propsCount: 10,
    villasCount: 4,
    appartementsCount: 6,
    avgPrice: '55 M DA',
    avgSurface: '200 m²',
    trend: '+2% ce mois',
    path: 'M 630 215 L 720 200 L 745 265 L 660 270 Z',
    centroid: { x: 688, y: 237 }
  }
];

// Helper to determine fill color based on property count & selection
function getCommuneFill(commune, isSelected, isHovered) {
  if (isSelected) return '#fbbf24'; // Luxury Gold accent when selected
  if (isHovered) return '#38bdf8'; // Crisp sky highlight on hover
  
  const count = commune.propsCount;
  if (count >= 25) return '#1e3a8a'; // Deep Luxury Navy (Hydra, Alger Centre)
  if (count >= 20) return '#1d4ed8'; // Royal Blue (Chéraga, El Biar)
  if (count >= 15) return '#2563eb'; // Rich Slate Blue (Dely Ibrahim, Sidi Yahia, Ben Aknoun)
  if (count >= 10) return '#3b82f6'; // Medium Blue (Aïn Benian, Zeralda, Kouba)
  return '#60a5fa'; // Soft Ice Blue (Few properties)
}

export function AlgiersCommunesSVG({ selectedCommune, onSelectCommune }) {
  const [hoveredCommune, setHoveredCommune] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const svgRef = useRef(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.35, 2.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.35, 0.75));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[480px] md:h-[560px] lg:h-[640px] rounded-3xl overflow-hidden bg-gradient-to-br from-charcoal-900/90 via-charcoal-950/80 to-charcoal-900/90 border border-white/10 shadow-2xl flex flex-col justify-between">
      {/* Subtle blueprint grid & radial glow behind map */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"></div>
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-20 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Floating Glass Tooltip */}
      {hoveredCommune && (
        <div 
          className="absolute z-30 pointer-events-none transition-all duration-300 ease-out transform -translate-x-1/2 -translate-y-full mb-4 bg-charcoal-900/80 backdrop-blur-2xl border border-white/20 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6)] min-w-[230px]"
          style={{
            left: `${(hoveredCommune.centroid.x / 780) * 100}%`,
            top: `${(hoveredCommune.centroid.y / 440) * 85}%`,
          }}
        >
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
            <span className="font-sans font-bold text-white text-base tracking-tight">{hoveredCommune.name}</span>
            <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 border border-gold-400/30">
              {hoveredCommune.zone}
            </span>
          </div>
          <div className="space-y-1.5 text-xs text-warm-200">
            <div className="flex justify-between items-center">
              <span className="text-white/60">Biens disponibles:</span>
              <span className="font-bold text-white text-sm">{hoveredCommune.propsCount}</span>
            </div>
            <div className="flex justify-between items-center text-[11px] text-white/70">
              <span>Appartements / Villas:</span>
              <span className="font-medium text-gold-300">{hoveredCommune.appartementsCount} apt / {hoveredCommune.villasCount} vls</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-white/10">
              <span className="text-white/60">Prix moyen:</span>
              <span className="font-semibold text-gold-400">{hoveredCommune.avgPrice}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Interactive SVG Map */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
        <svg
          ref={svgRef}
          viewBox="0 0 780 440"
          className="w-full h-full max-h-[540px] transition-transform duration-500 ease-out drop-shadow-[0_15px_35px_rgba(0,0,0,0.45)]"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'center center'
          }}
        >
          <defs>
            {/* Elegant inner shadow filter for luxury tiles */}
            <filter id="tile-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000" floodOpacity="0.35" />
            </filter>
            {/* Subtle texture gradient for communes */}
            <linearGradient id="luxury-shine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Render all commune paths */}
          {ALGIERS_COMMUNES_DATA.map((commune) => {
            const isSelected = selectedCommune?.id === commune.id;
            const isHovered = hoveredCommune?.id === commune.id;
            const fillColor = getCommuneFill(commune, isSelected, isHovered);

            return (
              <g 
                key={commune.id} 
                className="cursor-pointer group transition-all duration-300"
                onMouseEnter={() => setHoveredCommune(commune)}
                onMouseLeave={() => setHoveredCommune(null)}
                onClick={() => onSelectCommune && onSelectCommune(commune)}
              >
                {/* Commune Path */}
                <path
                  d={commune.path}
                  fill={fillColor}
                  stroke={isSelected ? '#fbbf24' : isHovered ? '#ffffff' : 'rgba(255,255,255,0.25)'}
                  strokeWidth={isSelected ? '3' : isHovered ? '2.5' : '1.2'}
                  filter="url(#tile-glow)"
                  className="transition-all duration-300 ease-out origin-center"
                  style={{
                    transform: isHovered ? 'scale(1.03) translateY(-2px)' : isSelected ? 'scale(1.02)' : 'scale(1)'
                  }}
                />

                {/* Shine overlay */}
                <path
                  d={commune.path}
                  fill="url(#luxury-shine)"
                  className="pointer-events-none opacity-80"
                />

                {/* Commune Label */}
                <text
                  x={commune.centroid.x}
                  y={commune.centroid.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`pointer-events-none select-none transition-all duration-300 ${
                    isSelected ? 'fill-charcoal-950 font-extrabold text-xs' : 'fill-white font-semibold text-[11px]'
                  }`}
                  style={{
                    textShadow: isSelected ? 'none' : '0 2px 4px rgba(0,0,0,0.85)'
                  }}
                >
                  {commune.name}
                </text>
                
                {/* Tiny property badge indicator */}
                {commune.propsCount >= 20 && (
                  <circle
                    cx={commune.centroid.x + 24}
                    cy={commune.centroid.y - 10}
                    r="4"
                    className="fill-gold-400 animate-pulse pointer-events-none"
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Floating Apple-Style Zoom & Reset Controls */}
      <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
          title="Zoom avant"
        >
          <Plus size={18} />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105 active:scale-95"
          title="Zoom arrière"
        >
          <Minus size={18} />
        </button>
        <button
          onClick={handleReset}
          className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center transition-all duration-200 shadow-lg hover:scale-105 active:scale-95 mt-1"
          title="Réinitialiser la vue"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Premium Gradient Map Legend at Bottom */}
      <div className="absolute bottom-6 left-6 right-6 z-20 hidden md:flex items-center justify-between px-6 py-3 rounded-2xl bg-charcoal-900/75 backdrop-blur-xl border border-white/15 text-xs text-white shadow-lg">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white/80">Intensité de l&apos;offre :</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-[#60a5fa] border border-white/30"></div>
            <span className="text-white/70">Résidentiel</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-[#3b82f6] border border-white/30"></div>
            <span className="text-white/70">Intermédiaire (12 - 17 biens)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-[#1d4ed8] border border-white/30"></div>
            <span className="text-white/70">Forte demande (18 - 24 biens)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-[#1e3a8a] border border-gold-400/80 shadow-[0_0_8px_rgba(251,191,36,0.4)]"></div>
            <span className="text-gold-300 font-semibold">Zone de Prestige (25+ biens)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
