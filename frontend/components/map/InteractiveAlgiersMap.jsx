"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Home, 
  TrendingUp, 
  Award, 
  MapPin, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Filter,
  RotateCcw
} from 'lucide-react';
import AlgiersCommunesD3Map from './AlgiersCommunesD3Map';
import algiersData from './algiersCommunesGeoJSON.json';
import propertyService from '@/services/property.service';

const ALGIERS_COMMUNES_DATA = algiersData.features.map(f => f.properties);

// Normalize database commune strings to the 57 Algiers commune names
function normalizeCommune(dbCommune = "") {
  if (!dbCommune) return "";
  const cleaned = dbCommune.trim().toLowerCase();
  if (cleaned === 'hydra' || cleaned === 'sidi yahya' || cleaned === 'sidi yahia') return 'Hydra';
  if (cleaned === 'el biar' || cleaned === 'elbiar') return 'El Biar';
  if (cleaned === 'delybrahim' || cleaned === 'dely ibrahim' || cleaned === 'dely brahim' || cleaned === 'dely-ibrahim') return 'Dely Ibrahim';
  if (cleaned === 'benaknoun' || cleaned === 'ben aknoun' || cleaned === 'ben-aknoun') return 'Ben Aknoun';
  if (cleaned === 'birkhadem' || cleaned === 'bir khadem') return 'Birkhadem';
  if (cleaned === 'draria') return 'Draria';
  if (cleaned === 'souidania') return 'Souidania';
  if (cleaned === 'ain naaja' || cleaned === 'ain naadja' || cleaned === 'djasr kasentina') return 'Djasr Kasentina';
  if (cleaned === 'reghaia' || cleaned === 'réghaïa') return 'Reghaia';
  if (cleaned === 'alger' || cleaned === 'alger centre' || cleaned === 'alger-centre') return 'Alger Centre';
  if (cleaned === 'cheraga' || cleaned === 'chéraga') return 'Cheraga';
  if (cleaned === 'ouled fayet') return 'Ouled Fayet';
  if (cleaned === 'staoueli' || cleaned === 'staouéli') return 'Staoueli';
  if (cleaned === 'zeralda' || cleaned === 'zéralda') return 'Zeralda';
  if (cleaned === 'ain benian' || cleaned === 'aïn benian') return 'Ain Benian';
  if (cleaned === 'kouba') return 'Kouba';
  if (cleaned === 'hussein dey') return 'Hussein Dey';
  if (cleaned === 'bir mourad rais' || cleaned === 'bir mourad raïs') return 'Bir Mourad Rais';
  if (cleaned === 'bouzareah' || cleaned === 'bouzaréah') return 'Bouzareah';

  const match = algiersData.features.find(f => {
    const name = f.properties.name || f.properties.name_fr || '';
    return name.toLowerCase() === cleaned;
  });
  return match ? (match.properties.name || match.properties.name_fr) : dbCommune;
}

// Animated Count-Up component for luxury stats
function CountUpNumber({ end, duration = 1800, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const prevEndRef = useRef(0);

  useEffect(() => {
    if (hasAnimated && prevEndRef.current !== end) {
      const startValue = prevEndRef.current;
      const targetValue = end;
      let startTime = null;
      const animDuration = Math.min(500, duration);
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / animDuration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const val = Math.floor(startValue + (targetValue - startValue) * easeOut);
        setCount(val);
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(targetValue);
          prevEndRef.current = targetValue;
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [end, hasAnimated, duration]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          prevEndRef.current = end;
          let startTime = null;
          const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(easeOut * end));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            } else {
              setCount(end);
              prevEndRef.current = end;
            }
          };
          window.requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export function InteractiveAlgiersMap({ allProperties: propsFromParent = [] }) {
  const [fetchedProperties, setFetchedProperties] = useState([]);
  const [loading, setLoading] = useState(() => propsFromParent.length === 0);

  const actualProperties = propsFromParent.length > 0 ? propsFromParent : fetchedProperties;

  useEffect(() => {
    if (propsFromParent.length === 0) {
      async function loadProperties() {
        try {
          const res = await propertyService.getAll('?status=Disponible&limit=1000');
          const props = res.data?.properties || [];
          setFetchedProperties(props);
        } catch (err) {
          console.warn("Failed to fetch actual properties for map:", err?.message || "Network Error");
        } finally {
          setLoading(false);
        }
      }
      loadProperties();
    }
  }, [propsFromParent.length]);

  const realCommunesData = useMemo(() => {
    return ALGIERS_COMMUNES_DATA.map(commune => {
      const matchedProps = actualProperties.filter(p => {
        const pCommune = normalizeCommune(p.location?.commune || "");
        return pCommune.toLowerCase() === commune.name.toLowerCase();
      });

      const totalCount = matchedProps.length;
      const villasCount = matchedProps.filter(p => p.category === 'Villa').length;
      const appartementsCount = matchedProps.filter(p => p.category === 'Appartement').length;

      let avgPrice = commune.avgPrice || "Sur demande";
      if (totalCount > 0) {
        const sumPrice = matchedProps.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
        const avg = Math.round(sumPrice / totalCount);
        if (avg >= 1000000) {
          avgPrice = `${Math.round(avg / 1000000)} M DA`;
        } else if (avg > 0) {
          avgPrice = `${avg.toLocaleString('fr-DZ')} DA`;
        }
      }

      let avgSurface = commune.avgSurface || "240 m²";
      if (totalCount > 0) {
        const sumArea = matchedProps.reduce((acc, p) => acc + (Number(p.area) || 0), 0);
        const avgA = Math.round(sumArea / totalCount);
        if (avgA > 0) {
          avgSurface = `${avgA} m²`;
        }
      }

      return {
        ...commune,
        totalCount,
        villasCount,
        appartementsCount,
        avgPrice,
        avgSurface,
      };
    });
  }, [actualProperties]);

  const [selectedCommuneName, setSelectedCommuneName] = useState('Hydra');

  const selectedCommune = useMemo(() => {
    if (selectedCommuneName === null) return null;
    const active = realCommunesData.find(c => c.name === selectedCommuneName);
    if (active) return active;
    const fallbackActive = realCommunesData.filter(c => (c.totalCount || 0) > 0);
    return fallbackActive.find(c => c.name === 'Hydra') || fallbackActive[0] || realCommunesData.find(c => c.name === 'Hydra') || realCommunesData[0];
  }, [realCommunesData, selectedCommuneName]);

  const [activeTab, setActiveTab] = useState('all');

  // Calculate real aggregate stats across all properties
  const totalProperties = actualProperties.length > 0
    ? actualProperties.length
    : realCommunesData.reduce((acc, c) => acc + (c.totalCount || 0), 0);
  const totalVillas = actualProperties.length > 0
    ? actualProperties.filter(p => p.category === 'Villa').length
    : realCommunesData.reduce((acc, c) => acc + (c.villasCount || 0), 0);
  const totalAppartements = actualProperties.length > 0
    ? actualProperties.filter(p => p.category === 'Appartement').length
    : realCommunesData.reduce((acc, c) => acc + (c.appartementsCount || 0), 0);
  const totalCommunes = ALGIERS_COMMUNES_DATA.length;

  // Currently displayed stats (either national/wilaya index or selected commune)
  const displayProps = selectedCommune ? (selectedCommune.totalCount || 0) : totalProperties;
  const displayVillas = selectedCommune ? (selectedCommune.villasCount || 0) : totalVillas;
  const displayAppartements = selectedCommune ? (selectedCommune.appartementsCount || 0) : totalAppartements;
  const displayPrice = selectedCommune ? selectedCommune.avgPrice : "110 M DA";
  const displayTitle = selectedCommune ? selectedCommune.name : "Wilaya d'Alger (57 Communes)";

  return (
    <section className="relative pt-10 md:pt-14 pb-24 md:pb-32 overflow-hidden bg-charcoal-950 text-white">
      {/* 1. FIXED PARALLAX BACKGROUND WITH 4% BLUR & SUBTLE DARK TINT */}
      {/* Fixed Parallax Background Image with 4% blur and scale to prevent edge bleeding */}
      <div 
        className="absolute inset-0 z-0 bg-fixed bg-cover bg-center blur-[3px] scale-105 transition-all duration-700"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1596&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')` }}
      ></div>

      {/* Subtle Dark Tint overlay (~45% dark tint) so the picture remains clearly visible while keeping text legible */}
      <div className="absolute inset-0 z-0 bg-charcoal-950/45 pointer-events-none"></div>

      {/* Subtle blueprint grid over the image */}
      <div className="absolute inset-0 z-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none"></div>
      
      {/* Soft radial gradients & subtle orange/gold accent lights */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gold-500/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-amber-500/15 rounded-full blur-[110px] pointer-events-none"></div>
      
      <div className="max-w-[1560px] mx-auto px-4 md:px-8 lg:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 reveal-section">
          <h2 className="font-sans text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 drop-shadow-sm">
            Nos biens <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-500">par commune</span>
          </h2>
          <p className="text-warm-200 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Explorez les biens disponibles dans les différentes communes d&apos;Alger à travers notre interface analytique de prestige.
          </p>
        </div>

        {/* 2. APPLE-LEVEL FLOATING GLASS CARD (30% Left / 70% Right) */}
        <div className="relative rounded-[32px] md:rounded-[36px] bg-charcoal-900/70 backdrop-blur-3xl border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_25px_80px_-15px_rgba(0,0,0,0.85)] p-6 md:p-10 lg:p-12 transition-all duration-500">
          
          {/* Subtle upper reflection highlight */}
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-stretch">
            
            {/* LEFT SIDE: Information & Analytics Panel (~32% Width) */}
            <div className="w-full lg:w-[32%] flex flex-col justify-between space-y-6">
              
              {/* Header Box: Active Commune or National Index */}
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-gold-400/40 transition-all duration-300 shadow-lg">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/5 rounded-full blur-2xl group-hover:bg-gold-400/10 transition-colors"></div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-gold-400 shrink-0" size={18} />
                    <span className="text-xs uppercase font-bold tracking-wider text-warm-200">
                      {selectedCommune ? "Commune Sélectionnée" : "Indice Global Alger"}
                    </span>
                  </div>
                  {selectedCommune && (
                    <button 
                      onClick={() => setSelectedCommuneName(null)}
                      className="text-[11px] text-white/60 hover:text-gold-400 flex items-center gap-1 transition-colors"
                      title="Afficher l'indice global"
                    >
                      <RotateCcw size={12} />
                      <span>Tous</span>
                    </button>
                  )}
                </div>

                <h3 className="font-sans text-3xl font-extrabold text-white tracking-tight mb-2">
                  {displayTitle}
                </h3>
                
                {/* Hero Stat Number */}
                <div className="flex items-baseline gap-3 my-4">
                  <span className="font-sans text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-warm-200">
                    <CountUpNumber end={displayProps} duration={1200} />
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-medium text-white/70">Biens en portefeuille</span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                      <TrendingUp size={12} />
                      {selectedCommune ? selectedCommune.trend : "↑ +14% en 2026"}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-warm-300/80 leading-relaxed pt-3 border-t border-white/10">
                  {selectedCommune 
                    ? `Zone résidentielle de prestige (${selectedCommune.name} • Daïra de ${selectedCommune.daira || 'Alger'}), offrant un cadre sécurisé et des biens exclusifs.`
                    : "Couverture exclusive sur les meilleures communes de la capitale et du littoral ouest."}
                </p>
              </div>

              {/* MINI GLASS STAT CARDS (4-Grid / Stack) */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                
                {/* Stat 1: Appartements */}
                <div className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 shadow-md group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Building2 size={16} />
                    </div>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300">
                      Apt
                    </span>
                  </div>
                  <div className="font-sans text-2xl font-bold text-white tracking-tight">
                    <CountUpNumber end={displayAppartements} duration={1400} />
                  </div>
                  <p className="text-[11px] text-white/60 mt-0.5">Appartements de prestige</p>
                </div>

                {/* Stat 2: Villas */}
                <div className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 shadow-md group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Home size={16} />
                    </div>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-300">
                      Villa
                    </span>
                  </div>
                  <div className="font-sans text-2xl font-bold text-white tracking-tight">
                    <CountUpNumber end={displayVillas} duration={1400} />
                  </div>
                  <p className="text-[11px] text-white/60 mt-0.5">Villas & Demeures</p>
                </div>

                {/* Stat 3: Communes Couvertes / Surface */}
                <div className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 shadow-md group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Award size={16} />
                    </div>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                      {selectedCommune ? "Surface" : "Secteurs"}
                    </span>
                  </div>
                  <div className="font-sans text-2xl font-bold text-white tracking-tight">
                    {selectedCommune ? selectedCommune.avgSurface : <CountUpNumber end={totalCommunes} duration={1000} />}
                  </div>
                  <p className="text-[11px] text-white/60 mt-0.5">
                    {selectedCommune ? "Surface moyenne" : "Communes couvertes"}
                  </p>
                </div>

                {/* Stat 4: Prix Moyen */}
                <div className="bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-2xl p-4 transition-all duration-300 shadow-md group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp size={16} />
                    </div>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300">
                      Prix
                    </span>
                  </div>
                  <div className="font-sans text-2xl font-bold text-gold-300 tracking-tight">
                    {displayPrice}
                  </div>
                  <p className="text-[11px] text-white/60 mt-0.5">Valorisation moyenne</p>
                </div>

              </div>

              {/* Action CTA for Selected Commune */}
              <div className="pt-2">
                <Link
                  href={selectedCommune ? `/properties?commune=${encodeURIComponent(selectedCommune.name)}` : "/properties"}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-400 hover:to-gold-500 text-charcoal-950 font-sans font-bold text-sm shadow-[0_10px_25px_rgba(251,191,36,0.3)] hover:shadow-[0_15px_30px_rgba(251,191,36,0.45)] transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <span>
                    {selectedCommune 
                      ? `Explorer les biens à ${selectedCommune.name} (${selectedCommune.totalCount || 0})` 
                      : `Voir tout le catalogue Alger (${totalProperties})`}
                  </span>
                  <ArrowUpRight size={16} className="stroke-[2.5]" />
                </Link>
              </div>

            </div>

            {/* RIGHT SIDE: Interactive SVG Map Area (~68% Width) */}
            <div className="w-full lg:w-[68%] flex flex-col justify-center">
              <AlgiersCommunesD3Map 
                selectedCommune={selectedCommune} 
                onSelectCommune={(commune) => setSelectedCommuneName(commune ? commune.name : null)}
                communesData={realCommunesData}
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
