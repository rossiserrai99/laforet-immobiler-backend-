"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Home, Users, CheckCircle, Clock, PlusCircle, ArrowRight, Eye, Mail, Phone, MapPin, Sparkles, Building2, TrendingUp, ShieldCheck } from 'lucide-react';
import adminService from '@/services/admin.service';
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

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    totalLeads: 0,
    newLeads: 0
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentLeads, setRecentLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [statsData, propsRes, leadsRes] = await Promise.allSettled([
          adminService.getStats(),
          propertyService.getAll('?limit=5&sort=-createdAt'),
          leadService.getAll()
        ]);

        let loadedStats = { totalProperties: 0, activeProperties: 0, totalLeads: 0, newLeads: 0 };
        if (statsData.status === 'fulfilled') {
          const s = statsData.value?.data?.stats || statsData.value?.stats;
          if (s) {
            loadedStats = { ...loadedStats, ...s };
          }
        }

        if (propsRes.status === 'fulfilled') {
          const propsList = propsRes.value?.data?.properties || propsRes.value?.properties || [];
          setRecentProperties(propsList);
          const totalInDB = propsRes.value?.data?.total || propsRes.value?.results || propsList.length;
          if (!loadedStats.totalProperties || loadedStats.totalProperties === 0) {
            loadedStats.totalProperties = totalInDB;
          }
          if (!loadedStats.activeProperties || loadedStats.activeProperties === 0) {
            loadedStats.activeProperties = propsList.filter(p => p.status === 'Disponible' || p.status === 'Available' || !p.status).length;
          }
        }

        if (leadsRes.status === 'fulfilled') {
          const leadsList = leadsRes.value?.data?.leads || leadsRes.value?.leads || [];
          setRecentLeads(leadsList.slice(0, 5));
          if (!loadedStats.totalLeads || loadedStats.totalLeads === 0) {
            loadedStats.totalLeads = leadsList.length;
          }
          if (!loadedStats.newLeads || loadedStats.newLeads === 0) {
            loadedStats.newLeads = leadsList.filter(l => l.status === 'New' || l.status === 'Nouveau' || !l.status).length;
          }
        }

        setStats(loadedStats);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Sur demande';
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-10">
      {/* Header section (Orcish Executive Header on Google Dashboard White) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#0B150F] tracking-tight">
            Bienvenue dans votre Tableau de Bord
          </h1>
          <p className="text-[#3C5245] text-sm mt-2 font-sans font-medium">
            Aperçu en temps réel du portefeuille immobilier de prestige et des demandes clients.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <Link
            href="/admin/properties/new"
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#133E26] hover:bg-[#1B4F32] text-white font-bold text-sm shadow-sm border border-[#2D5A43]/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <PlusCircle className="w-4 h-4 text-[#E8C97A]" />
            <span>Ajouter un Bien</span>
          </Link>
          <Link
            href="/admin/leads"
            className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0E2015] hover:bg-[#153120] border border-[#2D5A43]/40 text-white font-medium text-sm transition-all shadow-sm"
          >
            <Users className="w-4 h-4 text-[#E8C97A]" />
            <span>Gérer les Leads</span>
          </Link>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2D5A43]"></div>
          <p className="text-[#3C5245] text-xs font-mono uppercase tracking-widest">Chargement des données en cours...</p>
        </div>
      ) : (
        <>
          {/* 4 KPI Luxury Medium-Opacity Forest Green Glassmorphism Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Catalogue Total */}
            <div className="bg-[#132A1E]/85 hover:bg-[#183526]/90 backdrop-blur-xl p-6 rounded-3xl border border-[#2D5A43]/50 hover:border-[#E8C97A]/60 transition-all duration-300 shadow-[0_15px_35px_rgba(19,42,30,0.18)] group relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#2D5A43]/30 to-transparent rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#8EA89A] text-xs font-mono font-semibold uppercase tracking-wider">Total Catalogue</span>
                <div className="w-11 h-11 rounded-2xl bg-[#2D5A43]/30 border border-[#2D5A43]/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Home className="w-5 h-5 text-[#E8C97A]" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-extrabold tracking-tight text-white mb-2">{stats.totalProperties}</div>
              <div className="flex items-center gap-1.5 text-xs text-[#E8C97A] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8C97A]"></span>
                <span>Biens de prestige enregistrés</span>
              </div>
            </div>
            
            {/* Card 2: Biens Disponibles */}
            <div className="bg-[#132A1E]/85 hover:bg-[#183526]/90 backdrop-blur-xl p-6 rounded-3xl border border-[#2D5A43]/50 hover:border-[#4A8C5C]/60 transition-all duration-300 shadow-[0_15px_35px_rgba(19,42,30,0.18)] group relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#4A8C5C]/30 to-transparent rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#8EA89A] text-xs font-mono font-semibold uppercase tracking-wider">Biens Disponibles</span>
                <div className="w-11 h-11 rounded-2xl bg-[#4A8C5C]/20 border border-[#4A8C5C]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-5 h-5 text-[#4A8C5C]" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-extrabold tracking-tight text-white mb-2">{stats.activeProperties}</div>
              <div className="flex items-center gap-1.5 text-xs text-[#4A8C5C] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4A8C5C]"></span>
                <span>Visibles en ligne</span>
              </div>
            </div>

            {/* Card 3: Demandes Reçues */}
            <div className="bg-[#132A1E]/85 hover:bg-[#183526]/90 backdrop-blur-xl p-6 rounded-3xl border border-[#2D5A43]/50 hover:border-[#E8C97A]/60 transition-all duration-300 shadow-[0_15px_35px_rgba(19,42,30,0.18)] group relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#E8C97A]/20 to-transparent rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#8EA89A] text-xs font-mono font-semibold uppercase tracking-wider">Demandes Reçues</span>
                <div className="w-11 h-11 rounded-2xl bg-[#E8C97A]/15 border border-[#E8C97A]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-[#E8C97A]" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-extrabold tracking-tight text-white mb-2">{stats.totalLeads}</div>
              <div className="flex items-center gap-1.5 text-xs text-[#8EA89A] font-medium">
                <span>Total des contacts clients</span>
              </div>
            </div>

            {/* Card 4: Leads En Attente */}
            <div className="bg-[#132A1E]/85 hover:bg-[#183526]/90 backdrop-blur-xl p-6 rounded-3xl border border-[#2D5A43]/50 hover:border-red-500/50 transition-all duration-300 shadow-[0_15px_35px_rgba(19,42,30,0.18)] group relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-500/20 to-transparent rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[#8EA89A] text-xs font-mono font-semibold uppercase tracking-wider">Leads En Attente</span>
                <div className="w-11 h-11 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5 text-red-400" />
                </div>
              </div>
              <div className="text-3xl sm:text-4xl font-mono font-extrabold tracking-tight text-red-400 mb-2">{stats.newLeads}</div>
              <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
                <span>Nécessitent votre attention</span>
              </div>
            </div>
          </div>

          {/* 2-Column Real-Time Data Tables (Medium Opacity Forest Green Glassmorphism) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Properties Table */}
            <div className="bg-[#132A1E]/85 backdrop-blur-xl rounded-3xl border border-[#2D5A43]/50 shadow-[0_20px_50px_rgba(19,42,30,0.15)] overflow-hidden flex flex-col text-white">
              <div className="p-6 border-b border-white/10 bg-[#193B28]/90 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#2D5A43]/30 border border-[#2D5A43]/50">
                    <Building2 className="w-5 h-5 text-[#E8C97A]" />
                  </div>
                  <div>
                    <h3 className="font-sans text-lg font-extrabold text-white tracking-tight">Derniers Biens Ajoutés</h3>
                    <p className="text-xs text-[#8EA89A]">Catalogue immobilier en temps réel</p>
                  </div>
                </div>
                <Link 
                  href="/admin/properties" 
                  className="text-xs font-mono font-semibold uppercase tracking-wider text-[#E8C97A] hover:text-white flex items-center gap-1 transition-colors px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10"
                >
                  <span>Voir Tout ({stats.totalProperties || recentProperties.length})</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="flex-1 p-6 overflow-x-auto">
                {recentProperties.length === 0 ? (
                  <div className="text-center py-12 text-[#8EA89A] text-sm font-sans">
                    Aucune propriété enregistrée pour l&apos;instant.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentProperties.map(property => (
                      <div 
                        key={property._id} 
                        className="flex items-center justify-between p-4 rounded-2xl bg-[#B0B8B4] hover:bg-[#9FA8A3] border border-[#88948E] shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#97A39D] shrink-0 border border-[#7D8B84]">
                            <Image 
                              src={getPropertyImage(property)} 
                              alt={property.title || 'Bien'}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-sans font-bold text-[#09140D] truncate max-w-[200px] sm:max-w-[240px]">
                              {property.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-[#243B2E] mt-0.5 font-sans">
                              <span className="text-[#133E26] font-extrabold">{property.type}</span>
                              <span>•</span>
                              <span className="truncate">{property.location?.commune || 'Alger'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-3">
                          <div className="text-sm font-mono font-extrabold text-[#09140D] tracking-tight">
                            {formatPrice(property.price)}
                          </div>
                          <div className="mt-1">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-[#EAF2ED] text-[#133E26] border border-[#94B3A1] shadow-sm">
                              {property.status || 'Disponible'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Leads Table */}
            <div className="bg-[#132A1E]/85 backdrop-blur-xl rounded-3xl border border-[#2D5A43]/50 shadow-[0_20px_50px_rgba(19,42,30,0.15)] overflow-hidden flex flex-col text-white">
              <div className="p-6 border-b border-white/10 bg-[#193B28]/90 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#2D5A43]/30 border border-[#2D5A43]/50">
                    <Users className="w-5 h-5 text-[#E8C97A]" />
                  </div>
                  <div>
                    <h3 className="font-sans text-lg font-extrabold text-white tracking-tight">Dernières Demandes Clients</h3>
                    <p className="text-xs text-[#8EA89A]">Suivi de la clientèle d&apos;exception</p>
                  </div>
                </div>
                <Link 
                  href="/admin/leads" 
                  className="text-xs font-mono font-semibold uppercase tracking-wider text-[#E8C97A] hover:text-white flex items-center gap-1 transition-colors px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/10"
                >
                  <span>Gérer Tout ({stats.totalLeads || recentLeads.length})</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="flex-1 p-6 overflow-x-auto">
                {recentLeads.length === 0 ? (
                  <div className="text-center py-12 text-[#8EA89A] text-sm font-sans">
                    Aucun lead reçu pour le moment.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentLeads.map(lead => (
                      <div 
                        key={lead._id} 
                        onClick={() => router.push(`/admin/leads?id=${lead._id}`)}
                        className="p-4 rounded-2xl bg-[#B0B8B4] hover:bg-[#9FA8A3] border border-[#88948E] shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-sans font-bold text-sm text-[#09140D]">{lead.name || 'Anonyme'}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold shadow-sm ${
                              (lead.status === 'Nouveau' || lead.status === 'New')
                                ? 'bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]' 
                                : 'bg-[#EAF2ED] text-[#133E26] border border-[#94B3A1]'
                            }`}>
                              {lead.status === 'New' ? 'Nouveau' : (lead.status || 'Nouveau')}
                            </span>
                          </div>
                          <span className="text-xs text-[#243B2E] font-mono font-medium">
                            {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('fr-FR') : "Aujourd'hui"}
                          </span>
                        </div>

                        <p className="text-xs text-[#0F2016] line-clamp-2 mb-2 font-normal">
                          {lead.message || "Aucun message spécifié."}
                        </p>

                        <div className="flex items-center gap-4 text-xs">
                          {lead.phone && (
                            <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[#133E26] font-bold hover:underline font-mono">
                              <Phone size={12} />
                              <span>{lead.phone}</span>
                            </a>
                          )}
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-[#243B2E] hover:text-[#09140D] font-medium truncate">
                              <Mail size={12} />
                              <span>{lead.email}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
