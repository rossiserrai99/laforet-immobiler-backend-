"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  MapPin, 
  ExternalLink, 
  Compass, 
  Map as MapIcon, 
  Locate, 
  Maximize,
  Sparkles,
  Building2
} from 'lucide-react';

export function AgencyLocationMap() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerInstanceRef = useRef(null);
  const [viewMode, setViewMode] = useState('maplibre'); // 'maplibre' (Carto Dark Matter GL) | 'google'
  const [isLoaded, setIsLoaded] = useState(false);

  // Exact coordinates requested by the user: 36.76757687221316, 3.0508153070324933
  // Note: MapLibre GL uses [longitude, latitude] format
  const geoLat = 36.76757687221316;
  const geoLng = 3.0508153070324933;
  const lngLat = [geoLng, geoLat];
  const addressName = "62 Boulevard 5, Alger";

  // Initialize MapLibre GL Map
  useEffect(() => {
    if (viewMode !== 'maplibre' || !mapContainerRef.current) return;

    // Clean up any existing instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: lngLat,
      zoom: 16.5,
      pitch: 45, // Elegant 3D tilt for luxury dashboard feel
      bearing: -15,
      attributionControl: false
    });

    map.on('load', () => {
      setIsLoaded(true);

      // Add a custom glowing pulse ring around the agency coordinates using MapLibre GL layers
      map.addSource('agency-pulse-source', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: lngLat
          }
        }
      });

      map.addLayer({
        id: 'agency-pulse-circle',
        type: 'circle',
        source: 'agency-pulse-source',
        paint: {
          'circle-radius': 45,
          'circle-color': '#fbbf24',
          'circle-opacity': 0.15,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#fbbf24',
          'circle-stroke-opacity': 0.4
        }
      });
    });

    // Create custom HTML element for luxury agency marker
    const markerEl = document.createElement('div');
    markerEl.className = 'cursor-pointer group flex items-center justify-center relative';
    markerEl.innerHTML = `
      <div class="absolute -inset-4 rounded-full bg-amber-400/20 animate-ping"></div>
      <div class="absolute -inset-2 rounded-full bg-amber-400/30 blur-sm"></div>
      <div class="w-10 h-10 rounded-full bg-slate-900 border-2 border-amber-400 shadow-2xl flex items-center justify-center text-amber-400 transform transition-transform duration-300 hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
      <div class="absolute top-11 whitespace-nowrap bg-slate-900/95 border border-amber-400/60 text-amber-300 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full shadow-lg backdrop-blur-md">
        LA FORÊT • 62 BD 5
      </div>
    `;

    // Create custom popup
    const popup = new maplibregl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false,
      className: 'luxury-maplibre-popup'
    }).setHTML(`
      <div class="p-3 bg-slate-900/95 text-white rounded-xl border border-white/15 shadow-2xl min-w-[200px] font-sans">
        <div class="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">Siège Officiel</div>
        <div class="font-serif font-bold text-base text-white mt-0.5">Agence La Forêt</div>
        <div class="text-xs text-slate-300 mt-0.5">${addressName}</div>
        <div class="text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-white/10">36.7675° N, 3.0508° E</div>
      </div>
    `);

    const marker = new maplibregl.Marker({
      element: markerEl,
      anchor: 'center'
    })
      .setLngLat(lngLat)
      .setPopup(popup)
      .addTo(map);

    // Open popup by default
    marker.togglePopup();

    mapInstanceRef.current = map;
    markerInstanceRef.current = marker;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  const handleZoomIn = useCallback(() => {
    mapInstanceRef.current?.zoomIn({ duration: 300 });
  }, []);

  const handleZoomOut = useCallback(() => {
    mapInstanceRef.current?.zoomOut({ duration: 300 });
  }, []);

  const handleResetBearing = useCallback(() => {
    mapInstanceRef.current?.resetNorthPitch({ duration: 500 });
  }, []);

  const handleRecenter = useCallback(() => {
    mapInstanceRef.current?.flyTo({
      center: lngLat,
      zoom: 16.5,
      pitch: 45,
      bearing: -15,
      duration: 1200
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full h-[480px] md:h-[540px] lg:h-[580px] rounded-3xl overflow-hidden bg-gradient-to-br from-charcoal-900/95 via-charcoal-950/90 to-charcoal-900/95 border border-white/15 shadow-2xl flex flex-col justify-between group/map">
      {/* Top Header & View Mode Switcher */}
      <div className="absolute top-5 left-5 right-5 flex flex-wrap items-center justify-between gap-3 z-30 pointer-events-auto">
        <div className="flex items-center gap-2.5 bg-charcoal-900/90 backdrop-blur-xl border border-white/20 rounded-full px-4 py-2 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-gold-400 animate-pulse"></div>
          <span className="text-xs font-mono uppercase tracking-widest text-gold-400 font-bold">
            Siège Officiel LA FORÊT
          </span>
          <span className="hidden sm:inline-block text-white/30">•</span>
          <span className="hidden sm:inline-block text-xs text-white font-sans font-medium">
            {addressName}
          </span>
        </div>

        {/* View Mode Switcher: Carte Prestige (MapLibre GL) vs Vue Google */}
        <div className="flex items-center bg-charcoal-900/90 backdrop-blur-xl border border-white/20 rounded-full p-1 shadow-lg">
          <button
            onClick={() => setViewMode('maplibre')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              viewMode === 'maplibre'
                ? 'bg-gold-400 text-charcoal-950 shadow-md'
                : 'text-warm-300 hover:text-white'
            }`}
          >
            <Compass size={14} />
            <span>Carte Prestige</span>
          </button>
          <button
            onClick={() => setViewMode('google')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              viewMode === 'google'
                ? 'bg-gold-400 text-charcoal-950 shadow-md'
                : 'text-warm-300 hover:text-white'
            }`}
          >
            <MapIcon size={14} />
            <span>Vue Google</span>
          </button>
        </div>
      </div>

      {/* Map Display Area */}
      {viewMode === 'maplibre' ? (
        <div className="relative w-full h-full">
          <div 
            ref={mapContainerRef} 
            className="w-full h-full absolute inset-0 outline-none" 
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-charcoal-950/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-gold-400 border-t-transparent animate-spin"></div>
                <span className="text-xs font-mono text-warm-300 uppercase tracking-widest">Chargement de la Carte Prestige...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Google Maps View strictly centered on exact coordinates 36.76757687221316, 3.0508153070324933 */
        <div className="relative w-full h-full min-h-[420px] md:min-h-[480px]">
          <iframe
            src="https://maps.google.com/maps?q=36.76757687221316,3.0508153070324933+(Agence+La+For%C3%AAt+-+62+Boulevard+5,+Alger)&t=&z=17&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full absolute inset-0 object-cover"
          ></iframe>
        </div>
      )}

      {/* Floating Luxury Tooltip Card (Always visible on bottom-left) */}
      <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-charcoal-900/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.6)] max-w-sm z-30 pointer-events-auto">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-11 h-11 rounded-xl bg-gold-400/20 border border-gold-400/40 flex items-center justify-center shrink-0">
            <MapPin className="text-gold-400" size={22} />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-400 font-bold block">
              Siège • Agence Immobilière
            </span>
            <h4 className="font-serif text-lg font-bold text-white mt-0.5">
              Agence La Forêt
            </h4>
            <p className="text-xs text-warm-200 font-medium mt-0.5">
              62 Boulevard 5, Alger, Algérie
            </p>
            <p className="text-[10px] text-white/50 font-mono mt-1">
              GPS: {geoLat}, {geoLng}
            </p>
          </div>
        </div>

        <a
          href="https://maps.app.goo.gl/EfX8h7h6satkmTRC8"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-gold-400 text-charcoal-950 font-bold text-xs hover:bg-gold-300 transition-colors shadow-md group/btn"
        >
          <span>Ouvrir sur Google Maps</span>
          <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
        </a>
      </div>

      {/* MapLibre Controls (Zoom In/Out, Recenter, Reset Bearing) - Bottom Right */}
      {viewMode === 'maplibre' && (
        <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-30 pointer-events-auto">
          <button 
            onClick={handleZoomIn}
            className="w-10 h-10 rounded-full bg-charcoal-900/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg hover:bg-white/20 hover:border-gold-400 transition-all"
            aria-label="Zoom avant"
          >
            <Plus size={18} />
          </button>
          <button 
            onClick={handleZoomOut}
            className="w-10 h-10 rounded-full bg-charcoal-900/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg hover:bg-white/20 hover:border-gold-400 transition-all"
            aria-label="Zoom arrière"
          >
            <Minus size={18} />
          </button>
          <button 
            onClick={handleRecenter}
            className="w-10 h-10 rounded-full bg-charcoal-900/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg hover:bg-white/20 hover:border-gold-400 transition-all"
            aria-label="Centrer sur l'agence"
            title="Centrer sur 62 Boulevard 5"
          >
            <Locate size={16} className="text-gold-400" />
          </button>
          <button 
            onClick={handleResetBearing}
            className="w-10 h-10 rounded-full bg-charcoal-900/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg hover:bg-white/20 hover:border-gold-400 transition-all"
            aria-label="Réinitialiser l'orientation Nord"
            title="Orientation Nord"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
