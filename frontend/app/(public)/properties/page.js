"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PropertyCard } from '@/components/property/PropertyCard';
import { Button } from '@/components/ui';
import propertyService from '@/services/property.service';
import {
  MapPin,
  X,
  SlidersHorizontal,
  RotateCcw,
  Building2,
  Sparkles,
  Filter,
  ArrowUpDown,
  Tag,
  DollarSign,
  ChevronDown
} from 'lucide-react';

// All 57 communes of Wilaya d'Alger (Wilaya 16)
const ALGIERS_COMMUNES = [
  'Ain Benian', 'Ain Taya', 'Alger Centre', 'Bab El Oued', 'Bab Ezzouar', 'Bachdjerrah',
  'Baraki', 'Ben Aknoun', 'Belouizdad', 'Bir Mourad Raïs', 'Birkhadem', 'Bir Touta',
  'Bologhine', 'Bordj El Bahri', 'Bordj El Kiffan', 'Bouzaréah', 'Casbah', 'Chéraga',
  'Dar El Beïda', 'Dely Ibrahim', 'Djasr Kasentina', 'Douera', 'Draria', 'El Achour',
  'El Biar', 'El Harrach', 'El Magharia', 'El Madania', 'El Marsa', 'El Mouradia',
  'Hammamet', 'H\'raoua', 'Hussein Dey', 'Hydra', 'Khraicia', 'Kouba', 'Les Eucalyptus',
  'Mahelma', 'Mohammadia', 'Oued Koriche', 'Oued Smar', 'Ouled Chebel', 'Ouled Fayet',
  'Rahmania', 'Raïs Hamidou', 'Réghaïa', 'Rouiba', 'Saoula', 'Sidi Abdallah',
  'Sidi M\'Hamed', 'Sidi Moussa', 'Souidania', 'Staoueli', 'Tessala El Merdja', 'Zeralda'
];

function PropertiesCatalogContent() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('-createdAt');
  
  // Filter state (initialize synchronously from URL search params)
  const [filters, setFilters] = useState(() => ({
    commune: searchParams.get('commune') || searchParams.get('location') || '',
    type: searchParams.get('type') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: ''
  }));

  // Update filters if URL parameters change during client navigation
  useEffect(() => {
    const communeParam = searchParams.get('commune') || searchParams.get('location') || '';
    const typeParam = searchParams.get('type') || '';
    const categoryParam = searchParams.get('category') || '';
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFilters(prev => {
      if (prev.commune === communeParam && prev.type === typeParam && prev.category === categoryParam) {
        return prev;
      }
      return {
        ...prev,
        commune: communeParam,
        type: typeParam,
        category: categoryParam,
      };
    });
  }, [searchParams]);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('status', 'Disponible'); // Only show available properties to public
      
      if (filters.commune) params.append('commune', filters.commune);
      if (filters.type) params.append('type', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('price[gte]', filters.minPrice);
      if (filters.maxPrice) params.append('price[lte]', filters.maxPrice);
      
      params.append('sort', sortBy);

      const res = await propertyService.getAll(`?${params.toString()}`);
      setProperties(res.data?.properties || []);
    } catch (err) {
      console.warn("Failed to fetch properties:", err?.message || "Network Error");
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortBy]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProperties();
  }, [fetchProperties]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      commune: '',
      type: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    });
    setSortBy('-createdAt');
  };

  const hasActiveFilters = Boolean(
    filters.commune || filters.type || filters.category || filters.minPrice || filters.maxPrice
  );

  const topCommunes = ['Tous', 'Hydra', 'El Biar', 'Chéraga', 'Dely Ibrahim', 'Ben Aknoun', 'Alger Centre'];

  return (
    <div className="bg-warm-50 min-h-screen pt-28 pb-16">
      <div className="container mx-auto px-4 lg:px-8">

        {/* ═══════════════════════════════════════════════════════════
            PREMIUM DARK GREY GLASSMORPHISM FILTER BOARD
        ═══════════════════════════════════════════════════════════ */}
        <div className="mb-10 relative">
          {/* Outer glow ring */}
          <div className="absolute -inset-px rounded-[1.75rem] bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none z-10" />

          <div className="relative bg-[#1c1c1e]/90 backdrop-blur-3xl border border-white/10 rounded-[1.75rem] overflow-hidden shadow-[0_32px_80px_-12px_rgba(0,0,0,0.6)]">
            {/* Ambient top-right highlight */}
            <div className="absolute top-0 right-0 w-80 h-40 bg-white/[0.03] rounded-full blur-2xl pointer-events-none" />
            {/* Subtle gold shimmer bottom-left */}
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#c8a46e]/8 rounded-full blur-3xl pointer-events-none" />

            {/* ── Header row ─────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 pt-5 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#c8a46e]/15 border border-[#c8a46e]/25 flex items-center justify-center">
                  <SlidersHorizontal size={15} className="text-[#c8a46e]" />
                </div>
                <span className="text-[13px] font-semibold text-white/90 tracking-wide">Recherche & Filtres</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Live count badge */}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/6 border border-white/8 text-[11px] font-medium text-white/70">
                  <span className={`w-1.5 h-1.5 rounded-full ${isLoading ? 'bg-white/40' : 'bg-emerald-400'} ${!isLoading && 'animate-pulse'}`} />
                  <span>{isLoading ? 'Chargement…' : `${properties.length} bien${properties.length !== 1 ? 's' : ''}`}</span>
                </div>

                {/* Reset button — only when filters active */}
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#c8a46e]/15 hover:bg-[#c8a46e]/25 border border-[#c8a46e]/30 text-[#c8a46e] text-[11px] font-semibold transition-all duration-200 cursor-pointer"
                  >
                    <RotateCcw size={11} />
                    <span>Réinitialiser</span>
                  </button>
                )}
              </div>
            </div>

            {/* ── Quick commune shortcut pills ───────────────────── */}
            <div className="px-6 py-3 border-b border-white/[0.06] overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-2 min-w-max">
                <span className="text-[10px] uppercase tracking-widest font-bold text-white/30 mr-1 flex items-center gap-1 shrink-0">
                  <MapPin size={10} className="text-[#c8a46e]/60" />
                  Secteurs
                </span>
                {topCommunes.map(name => {
                  const active = name === 'Tous' ? !filters.commune : filters.commune.toLowerCase() === name.toLowerCase();
                  return (
                    <button
                      key={name}
                      onClick={() => setFilters(p => ({ ...p, commune: name === 'Tous' ? '' : name }))}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide transition-all duration-200 cursor-pointer border shrink-0 ${
                        active
                          ? 'bg-[#c8a46e] border-[#c8a46e] text-[#1c1c1e] shadow-md'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white/90'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Filter controls grid ────────────────────────────── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/[0.06]">

              {/* ① Commune */}
              <div className="bg-[#1c1c1e]/80 p-4 space-y-2">
                <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/35">
                  <MapPin size={10} className="text-[#c8a46e]/70" />
                  Commune
                </label>
                <div className="relative">
                  <select
                    name="commune"
                    value={filters.commune}
                    onChange={handleFilterChange}
                    className="w-full pl-7 pr-6 py-2 bg-white/[0.06] border border-white/[0.1] hover:border-white/20 focus:border-[#c8a46e]/60 rounded-lg text-[13px] text-white/90 outline-none transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#2c2c2e] text-white">Toutes</option>
                    {ALGIERS_COMMUNES.map(c => (
                      <option key={c} value={c} className="bg-[#2c2c2e] text-white">{c}</option>
                    ))}
                  </select>
                  <MapPin size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
              </div>

              {/* ② Transaction — premium toggle */}
              <div className="bg-[#1c1c1e]/80 p-4 space-y-2">
                <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/35">
                  <Tag size={10} className="text-[#c8a46e]/70" />
                  Transaction
                </label>
                <div className="flex rounded-lg overflow-hidden border border-white/[0.1] h-9">
                  {[{ val: '', label: 'Tous' }, { val: 'Vente', label: 'Vente' }, { val: 'Location', label: 'Location' }].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setFilters(p => ({ ...p, type: opt.val }))}
                      className={`flex-1 text-[12px] font-semibold transition-all duration-200 cursor-pointer ${
                        filters.type === opt.val
                          ? 'bg-[#c8a46e] text-[#1c1c1e]'
                          : 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white/80'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ③ Catégorie */}
              <div className="bg-[#1c1c1e]/80 p-4 space-y-2">
                <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/35">
                  <Building2 size={10} className="text-[#c8a46e]/70" />
                  Catégorie
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full pl-7 pr-6 py-2 bg-white/[0.06] border border-white/[0.1] hover:border-white/20 focus:border-[#c8a46e]/60 rounded-lg text-[13px] text-white/90 outline-none transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#2c2c2e] text-white">Tous types</option>
                    <option value="Appartement" className="bg-[#2c2c2e] text-white">Appartement</option>
                    <option value="Studio" className="bg-[#2c2c2e] text-white">Studio</option>
                    <option value="Duplex" className="bg-[#2c2c2e] text-white">Duplex</option>
                    <option value="Triplex" className="bg-[#2c2c2e] text-white">Triplex</option>
                    <option value="Villa" className="bg-[#2c2c2e] text-white">Villa</option>
                    <option value="Terrain" className="bg-[#2c2c2e] text-white">Terrain</option>
                    <option value="Local Commercial" className="bg-[#2c2c2e] text-white">Local Commercial</option>
                    <option value="Bureau" className="bg-[#2c2c2e] text-white">Bureau</option>
                    <option value="Immeuble" className="bg-[#2c2c2e] text-white">Immeuble</option>
                  </select>
                  <Building2 size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
              </div>

              {/* ④ Budget */}
              <div className="bg-[#1c1c1e]/80 p-4 space-y-2">
                <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/35">
                  <DollarSign size={10} className="text-[#c8a46e]/70" />
                  Budget (DZD)
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.1] hover:border-white/20 focus:border-[#c8a46e]/60 rounded-lg text-[13px] text-white/90 placeholder:text-white/25 outline-none transition-all duration-200"
                  />
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 bg-white/[0.06] border border-white/[0.1] hover:border-white/20 focus:border-[#c8a46e]/60 rounded-lg text-[13px] text-white/90 placeholder:text-white/25 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              {/* ⑤ Tri */}
              <div className="bg-[#1c1c1e]/80 p-4 space-y-2">
                <label className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-white/35">
                  <ArrowUpDown size={10} className="text-[#c8a46e]/70" />
                  Trier par
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value)}
                    className="w-full pl-7 pr-6 py-2 bg-white/[0.06] border border-white/[0.1] hover:border-white/20 focus:border-[#c8a46e]/60 rounded-lg text-[13px] text-white/90 outline-none transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="-createdAt" className="bg-[#2c2c2e] text-white">Plus récents</option>
                    <option value="price" className="bg-[#2c2c2e] text-white">Prix ↑</option>
                    <option value="-price" className="bg-[#2c2c2e] text-white">Prix ↓</option>
                  </select>
                  <ArrowUpDown size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Active commune badge */}
        {filters.commune && (
          <div className="mb-6 flex items-center justify-between bg-[#c8a46e]/10 border border-[#c8a46e]/25 px-5 py-3 rounded-2xl">
            <div className="flex items-center gap-2">
              <MapPin size={15} className="text-[#c8a46e]" />
              <span className="text-sm font-medium text-charcoal-900">
                Commune : <strong>{filters.commune}</strong>
              </span>
            </div>
            <button
              onClick={() => setFilters(p => ({ ...p, commune: '' }))}
              className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white border border-charcoal-100 hover:bg-gold-50 text-charcoal-700 transition-colors cursor-pointer shadow-sm"
            >
              <X size={12} /> Tous les secteurs
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-72 gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c8a46e]" />
            <p className="text-sm text-charcoal-500 font-medium">Recherche en cours…</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((prop, idx) => (
              <motion.div
                key={prop._id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.045 }}
              >
                <PropertyCard property={prop} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 md:p-16 text-center rounded-[2rem] border border-warm-200 shadow-lg max-w-xl mx-auto"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#c8a46e]/12 border border-[#c8a46e]/25 text-[#c8a46e] flex items-center justify-center mx-auto mb-5">
              <Filter size={24} />
            </div>
            <h3 className="font-serif text-2xl font-bold text-charcoal-900 mb-2">Aucun bien trouvé</h3>
            <p className="text-charcoal-500 text-sm mb-7 max-w-xs mx-auto">
              Aucun bien ne correspond à vos critères actuels. Essayez d&apos;élargir votre recherche.
            </p>
            <button
              onClick={clearFilters}
              className="px-7 py-2.5 rounded-full bg-[#c8a46e] hover:bg-[#b8945e] text-[#1c1c1e] font-bold text-sm tracking-wide shadow-md transition-all duration-200 inline-flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw size={14} /> Réinitialiser
            </button>
          </motion.div>
        )}

      </div>
    </div>
  );
}

export default function PropertiesCatalogPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen bg-warm-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
      </div>
    }>
      <PropertiesCatalogContent />
    </Suspense>
  );
}

