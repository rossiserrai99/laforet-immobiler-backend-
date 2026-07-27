"use client";

import React, { useState, useMemo, useRef } from "react";
import * as d3 from "d3";
import { Sparkles, Home, Building2, MapPin, TrendingUp, Info } from "lucide-react";
import algiersData from "./algiersCommunesGeoJSON.json";

export default function AlgiersCommunesD3Map({ selectedCommune, onSelectCommune, communesData }) {
  const [hoveredCommune, setHoveredCommune] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // SVG dimensions
  const width = 1000;
  const height = 640;

  // 1. Create D3 geographic projection fitted precisely to the 57 communes of Wilaya d'Alger
  const { pathGenerator, centroids, features } = useMemo(() => {
    const geoJson = algiersData;
    
    // Use Mercator projection fitted cleanly with padding inside 1000x640 viewBox
    const projection = d3
      .geoMercator()
      .fitExtent(
        [
          [35, 35],
          [width - 35, height - 35],
        ],
        geoJson
      );

    const pathGen = d3.geoPath().projection(projection).digits(2);

    // Compute centroids and merge real properties for labels & interactions
    const featList = geoJson.features.map((feature) => {
      const name = feature.properties.name || feature.properties.name_fr;
      const realData = communesData?.find(c => c.name.toLowerCase() === name.toLowerCase());
      const mergedProps = {
        ...feature.properties,
        ...(realData || {})
      };
      const rawCentroid = pathGen.centroid(feature);
      const centroid = [
        Number((rawCentroid[0] || 0).toFixed(2)),
        Number((rawCentroid[1] || 0).toFixed(2)),
      ];
      return {
        ...feature,
        properties: mergedProps,
        id: name,
        centroid,
        d: pathGen(feature),
      };
    });

    return {
      pathGenerator: pathGen,
      centroids: featList,
      features: featList,
    };
  }, [width, height, communesData]);

  // 2. Color density scale based on total properties in a commune
  const colorScale = useMemo(() => {
    const maxVal = d3.max(features, (f) => f.properties.totalCount || 0) || 5;
    const minVal = 0;
    
    // Returns subtle luxury glass fills scaling from dark slate glass to warm gold glass
    return d3.scaleLinear()
      .domain([minVal, maxVal])
      .range([0.08, 0.42]);
  }, [features]);

  // Handle mouse move for tooltip positioning
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // Smart tooltip positioning clamped to actual container DOM dimensions so it is never hidden behind screen edges
  const getTooltipStyle = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const containerW = rect?.width || width;
    const containerH = rect?.height || height;
    const tooltipW = 264; // w-64 is 256px + borders
    const tooltipH = 220;

    // Maximum left coordinate to keep tooltip fully inside the right edge
    const maxLeft = Math.max(10, containerW - tooltipW - 12);
    let left = Math.max(10, Math.min(tooltipPos.x + 16, maxLeft));

    // On mobile screens (< 640px), if tapping near the right side, position tooltip to the left of touch point
    if (containerW < 640 && tooltipPos.x > containerW - 170) {
      left = Math.max(10, Math.min(tooltipPos.x - tooltipW - 12, maxLeft));
      if (left < 10) left = Math.max(10, containerW - tooltipW - 12);
    }

    let top = Math.max(16, tooltipPos.y - 95);
    if (top + tooltipH > containerH - 12) {
      top = Math.max(16, containerH - tooltipH - 12);
    }

    return {
      left: `${left}px`,
      top: `${top}px`,
    };
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-auto md:h-full min-h-[260px] sm:min-h-[380px] md:min-h-[520px] flex items-center justify-center select-none overflow-hidden py-1 sm:py-4 md:py-0"
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-radial from-gold-500/10 via-transparent to-transparent opacity-60 pointer-events-none"></div>

      {/* SVG Geographic Polygons */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        suppressHydrationWarning={true}
        className="w-full h-auto md:h-full max-h-[340px] sm:max-h-[480px] md:max-h-[680px] overflow-visible drop-shadow-[0_15px_35px_rgba(0,0,0,0.65)]"
      >
        <defs>
          {/* Active gold glowing gradient */}
          <linearGradient id="selectedPolyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#d97706" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#b45309" stopOpacity="0.65" />
          </linearGradient>

          {/* Hovered polygon gradient */}
          <linearGradient id="hoverPolyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.3" />
          </linearGradient>

          {/* Subtle grid pattern */}
          <pattern id="polyGrid" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 16 0 L 0 0 0 16" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          </pattern>

          {/* Glow filter for active polygon */}
          <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Base Layer Polygons */}
        <g className="communes-group">
          {features.map((feature, idx) => {
            const isSelected = selectedCommune?.name === feature.properties.name;
            const isHovered = hoveredCommune?.name === feature.properties.name;
            const hasProperties = (feature.properties.totalCount || 0) > 0;
            const densityAlpha = colorScale(feature.properties.totalCount || 0);

            // Determine fill style: highlight communes with real available properties
            let fillStyle = hasProperties 
              ? `rgba(251, 191, 36, ${Math.max(densityAlpha, 0.16).toFixed(3)})` 
              : `rgba(255, 255, 255, 0.05)`;
            if (isSelected) fillStyle = "url(#selectedPolyGrad)";
            else if (isHovered) fillStyle = "url(#hoverPolyGrad)";

            return (
              <path
                key={`${feature.properties.name}-${idx}`}
                d={feature.d}
                fill={fillStyle}
                stroke={
                  isSelected
                    ? "#fcd34d"
                    : isHovered
                    ? "rgba(255, 255, 255, 0.9)"
                    : hasProperties
                    ? "rgba(251, 191, 36, 0.45)"
                    : "rgba(255, 255, 255, 0.18)"
                }
                strokeWidth={isSelected ? 2.5 : isHovered ? 1.8 : hasProperties ? 1.2 : 0.8}
                filter={isSelected ? "url(#goldGlow)" : undefined}
                className="transition-all duration-300 ease-out cursor-pointer hover:brightness-125"
                onMouseEnter={(e) => {
                  if (containerRef.current && e.clientX && e.clientY) {
                    const rect = containerRef.current.getBoundingClientRect();
                    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }
                  setHoveredCommune(feature.properties);
                }}
                onMouseLeave={() => setHoveredCommune(null)}
                onClick={(e) => {
                  if (containerRef.current && e.clientX && e.clientY) {
                    const rect = containerRef.current.getBoundingClientRect();
                    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                  }
                  setHoveredCommune(feature.properties);
                  onSelectCommune(feature.properties);
                }}
              />
            );
          })}
        </g>

        {/* 2. Crisp Commune Name Labels & Mini Badges for Prestige & Selected Communes */}
        <g className="commune-labels pointer-events-none">
          {features.map((feature, idx) => {
            const isSelected = selectedCommune?.name === feature.properties.name;
            const isHovered = hoveredCommune?.name === feature.properties.name;
            const isPrestige = [
              "Hydra",
              "Cheraga",
              "Dely Ibrahim",
              "Ben Aknoun",
              "El Biar",
              "Ain Benian",
              "Zeralda",
              "Bab El Oued",
              "Alger Centre",
            ].includes(feature.properties.name) || (feature.properties.totalCount > 0);

            if (!isSelected && !isHovered && !isPrestige) return null;

            const [cx, cy] = feature.centroid;
            if (isNaN(cx) || isNaN(cy)) return null;

            return (
              <g
                key={`label-${feature.properties.name}-${idx}`}
                transform={`translate(${cx.toFixed(2)}, ${cy.toFixed(2)})`}
                className="transition-opacity duration-300"
              >
                {/* Center dot pin */}
                <circle
                  r={isSelected ? 3.5 : 2}
                  fill={isSelected ? "#fbbf24" : "#ffffff"}
                  className={isSelected ? "animate-ping" : ""}
                />
                <circle
                  r={isSelected ? 3.5 : 2}
                  fill={isSelected ? "#fbbf24" : "#ffffff"}
                  stroke="rgba(0,0,0,0.5)"
                  strokeWidth="1"
                />

                {/* Commune Text Label */}
                <text
                  y={-8}
                  textAnchor="middle"
                  className={`font-sans text-[11px] font-semibold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] ${
                    isSelected
                      ? "fill-gold-300 text-gold-300 font-bold text-[13px]"
                      : isHovered
                      ? "fill-white text-white font-bold text-[12px]"
                      : "fill-warm-200 text-warm-200"
                  }`}
                >
                  {feature.properties.name}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* 3. High-End Floating Glass Tooltip */}
      {hoveredCommune && (
        <div
          className="absolute z-50 pointer-events-none transition-all duration-75 ease-out"
          style={getTooltipStyle()}
        >
          <div className="w-64 p-4 rounded-xl bg-charcoal-950/85 backdrop-blur-xl border border-white/20 shadow-2xl text-white">
            {/* Tooltip Header */}
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} className="text-gold-400" />
                <span className="font-sans text-sm font-bold tracking-tight text-white">
                  {hoveredCommune.name}
                </span>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-gold-400/20 text-gold-300 border border-gold-400/30">
                Wilaya 16
              </span>
            </div>

            {/* Properties summary */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-warm-200">
                <span className="flex items-center gap-1.5">
                  <TrendingUp size={13} className="text-gold-400" />
                  Total biens disponibles:
                </span>
                <span className="font-semibold text-white">
                  {hoveredCommune.totalCount} biens
                </span>
              </div>

              <div className="flex items-center justify-between text-warm-300 pt-1">
                <span className="flex items-center gap-1.5 text-white/70">
                  <Home size={13} className="text-amber-400" />
                  Villas de prestige:
                </span>
                <span className="font-medium text-white">
                  {hoveredCommune.villasCount}
                </span>
              </div>

              <div className="flex items-center justify-between text-warm-300">
                <span className="flex items-center gap-1.5 text-white/70">
                  <Building2 size={13} className="text-blue-400" />
                  Appartements:
                </span>
                <span className="font-medium text-white">
                  {hoveredCommune.appartementsCount}
                </span>
              </div>

              {/* Price Indicator */}
              <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-medium text-warm-300">
                  Prix moyen estimé:
                </span>
                <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-amber-400">
                  {hoveredCommune.avgPrice}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Map Footer Badge / Legend */}
      <div className="absolute bottom-4 right-4 z-20 hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-charcoal-950/75 backdrop-blur-md border border-white/10 text-xs text-warm-300 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-white/20 border border-white/40"></span>
          <span>Standard</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gold-500/50 border border-gold-400"></span>
          <span>Haute densité prestige</span>
        </div>
        <div className="h-3 w-px bg-white/20 mx-1"></div>
        <div className="flex items-center gap-1.5 text-gold-300 font-medium">
          <Info size={13} className="text-gold-400" />
          <span>57 Communes &bull; D3.js GeoJSON</span>
        </div>
      </div>
    </div>
  );
}
