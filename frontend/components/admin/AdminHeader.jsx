"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Globe, ShieldCheck, Building2, Users, X, ArrowRight, Phone, Mail, Menu } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import propertyService from '@/services/property.service';
import leadService from '@/services/lead.service';

const DEFAULT_PROPERTY_IMAGE = "https://res.cloudinary.com/zt28qj9l/image/upload/v1784965809/make_picture_high_definition_res__202607250849_msbqp4.jpg";
const getPropertyImage = (property) => {
  if (!property) return DEFAULT_PROPERTY_IMAGE;
  
  const isValidUrl = (url) => typeof url === 'string' && url.trim().length > 5 && (url.startsWith('http') || url.startsWith('/'));

  if (property.media?.coverImage?.url && isValidUrl(property.media.coverImage.url)) {
    return property.media.coverImage.url;
  }
  if (property.media?.images && Array.isArray(property.media.images) && property.media.images.length > 0) {
    const firstImg = property.media.images[0];
    if (isValidUrl(firstImg)) return firstImg;
    if (firstImg?.url && isValidUrl(firstImg.url)) return firstImg.url;
  }
  if (property.images && Array.isArray(property.images) && property.images.length > 0) {
    const firstImg = property.images[0];
    if (isValidUrl(firstImg)) return firstImg;
    if (firstImg?.url && isValidUrl(firstImg.url)) return firstImg.url;
  }
  if (property.coverImage && isValidUrl(property.coverImage)) return property.coverImage;
  if (property.coverImage?.url && isValidUrl(property.coverImage.url)) return property.coverImage.url;
  if (property.image && isValidUrl(property.image)) return property.image;
  if (property.image?.url && isValidUrl(property.image.url)) return property.image.url;

  return DEFAULT_PROPERTY_IMAGE;
};

const formatPrice = (price) => {
  if (!price) return 'Prix sur demande';
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'DZD', maximumFractionDigits: 0 }).format(price);
};

export function AdminHeader({ onOpenMobileMenu }) {
  const { admin } = useAdminAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [allProperties, setAllProperties] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchContainerRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch data when user focuses or starts searching
  const loadSearchData = async () => {
    if (allProperties.length > 0 || allLeads.length > 0 || isLoading) return;
    setIsLoading(true);
    try {
      const [propsRes, leadsRes] = await Promise.allSettled([
        propertyService.getAll(),
        leadService.getAll()
      ]);
      if (propsRes.status === 'fulfilled') {
        setAllProperties(propsRes.value.data?.properties || propsRes.value.properties || []);
      }
      if (leadsRes.status === 'fulfilled') {
        setAllLeads(leadsRes.value.data?.leads || leadsRes.value.leads || []);
      }
    } catch (err) {
      console.warn('Erreur chargement recherche:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard shortcut Ctrl+K or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
        loadSearchData();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [allProperties.length, allLeads.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const query = searchQuery.trim().toLowerCase();
  const filteredProperties = query ? allProperties.filter((p) => {
    return (
      (p.title && p.title.toLowerCase().includes(query)) ||
      (p.reference && p.reference.toLowerCase().includes(query)) ||
      (p.type && p.type.toLowerCase().includes(query)) ||
      (p.location?.commune && p.location.commune.toLowerCase().includes(query))
    );
  }) : [];

  const filteredLeads = query ? allLeads.filter((l) => {
    return (
      (l.name && l.name.toLowerCase().includes(query)) ||
      (l.email && l.email.toLowerCase().includes(query)) ||
      (l.phone && l.phone.toLowerCase().includes(query)) ||
      (l.message && l.message.toLowerCase().includes(query)) ||
      (l.type && l.type.toLowerCase().includes(query))
    );
  }) : [];

  const handleSelectProperty = (id) => {
    setIsOpen(false);
    setSearchQuery('');
    router.push(`/admin/properties/${id}/edit`);
  };

  const handleSelectLead = (id) => {
    setIsOpen(false);
    setSearchQuery('');
    router.push(`/admin/leads?id=${id}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-[#E2E8F0] px-4 sm:px-6 py-3.5 sm:py-4 transition-all duration-300 shadow-sm">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
        {/* Left: Mobile Menu Toggle & System Status Badge */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onOpenMobileMenu}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[#2D5A43]/10 text-[#133E26] hover:bg-[#2D5A43]/20 transition-colors shrink-0"
              title="Ouvrir le menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#2D5A43]/15 border border-[#2D5A43]/40 text-[#2D5A43] text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#2D5A43] animate-pulse"></span>
              <span>Direction Algérie</span>
            </div>
          </div>
          <span className="text-[#CBD5E1] hidden sm:inline">•</span>
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#64748B] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D5A43]" />
            <span>Serveur Sécurisé — En Ligne</span>
          </div>
        </div>

        {/* Right: Quick Search */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end" ref={searchContainerRef}>
          {/* Premium Floating Searching Pill with Interactive Results Dropdown */}
          <div className="relative flex-1 sm:w-80 group">
            <Search className="w-4 h-4 text-[#2D5A43] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none group-hover:scale-110 transition-transform" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Rechercher un bien, lead, client..."
              value={searchQuery}
              onFocus={() => {
                setIsOpen(true);
                loadSearchData();
              }}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isOpen) setIsOpen(true);
                loadSearchData();
              }}
              className="w-full bg-white text-[#0B150F] placeholder-[#64748B] text-base sm:text-xs font-medium rounded-full pl-10 pr-16 py-2.5 border border-[#CBD5E1]/80 shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_20px_rgba(45,90,67,0.12)] focus:shadow-[0_6px_25px_rgba(45,90,67,0.18)] focus:border-[#2D5A43] transition-all duration-300 outline-none font-sans"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-[#64748B] hover:text-[#09140D] hover:bg-gray-100 transition-colors"
                title="Effacer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-[#2D5A43] bg-[#2D5A43]/10 px-2 py-0.5 rounded-full border border-[#2D5A43]/30">
                ⌘K
              </span>
            )}

            {/* Live Search Results Dropdown Panel */}
            {isOpen && query.length > 0 && (
              <div className="absolute top-full mt-2 right-0 left-0 sm:left-auto sm:w-[420px] bg-white/95 backdrop-blur-2xl rounded-2xl border border-[#2D5A43]/30 shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-50 overflow-hidden text-left max-h-[70vh] flex flex-col">
                <div className="p-3 bg-[#132A1E] text-white flex items-center justify-between border-b border-white/10">
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-[#E8C97A]">
                    Résultats ({filteredProperties.length + filteredLeads.length})
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/70 hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-y-auto divide-y divide-gray-100 p-2 space-y-2">
                  {isLoading && (
                    <div className="p-6 text-center text-xs text-[#64748B] font-sans">
                      Recherche en cours...
                    </div>
                  )}

                  {!isLoading && filteredProperties.length === 0 && filteredLeads.length === 0 && (
                    <div className="p-6 text-center text-xs text-[#64748B] font-sans">
                      Aucun bien ou client trouvé pour « <span className="font-bold text-[#0B150F]">{searchQuery}</span> ».
                    </div>
                  )}

                  {/* Properties Results */}
                  {filteredProperties.length > 0 && (
                    <div>
                      <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#2D5A43] bg-[#EAF2ED] rounded-lg mb-1 flex items-center gap-1.5">
                        <Building2 className="w-3 h-3" />
                        <span>Biens Immobiliers ({filteredProperties.length})</span>
                      </div>
                      <div className="space-y-1">
                        {filteredProperties.map((p) => (
                          <div
                            key={p._id}
                            onClick={() => handleSelectProperty(p._id)}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F1F5F9] cursor-pointer transition-colors"
                          >
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                              <Image
                                src={getPropertyImage(p)}
                                alt={p.title || 'Bien'}
                                fill
                                sizes="40px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-sans font-bold text-[#0B150F] truncate">
                                {p.title}
                              </div>
                              <div className="text-[11px] text-[#64748B] font-sans truncate">
                                {p.type} • {p.location?.commune || 'Alger'} • <span className="font-mono font-semibold text-[#133E26]">{formatPrice(p.price)}</span>
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clients / Leads Results */}
                  {filteredLeads.length > 0 && (
                    <div className="pt-2">
                      <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#133E26] bg-[#EAF2ED] rounded-lg mb-1 flex items-center gap-1.5">
                        <Users className="w-3 h-3" />
                        <span>Clients & Leads ({filteredLeads.length})</span>
                      </div>
                      <div className="space-y-1">
                        {filteredLeads.map((lead) => (
                          <div
                            key={lead._id}
                            onClick={() => handleSelectLead(lead._id)}
                            className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F1F5F9] cursor-pointer transition-colors"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-sans font-bold text-[#0B150F] truncate">
                                  {lead.name || 'Anonyme'}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold uppercase bg-[#EAF2ED] text-[#133E26]">
                                  {lead.status || 'Nouveau'}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-[11px] text-[#64748B] mt-0.5 font-sans">
                                {lead.phone && (
                                  <span className="flex items-center gap-1 font-mono">
                                    <Phone className="w-3 h-3 text-[#133E26]" />
                                    {lead.phone}
                                  </span>
                                )}
                                {lead.email && (
                                  <span className="flex items-center gap-1 truncate">
                                    <Mail className="w-3 h-3 text-[#133E26]" />
                                    {lead.email}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-[#64748B] shrink-0 ml-2" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Public Site Button */}
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F1E14] text-xs font-medium transition-all shadow-2xs"
            title="Ouvrir le site public"
          >
            <Globe className="w-3.5 h-3.5 text-[#2D5A43]" />
            <span className="hidden md:inline">Site Public</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

