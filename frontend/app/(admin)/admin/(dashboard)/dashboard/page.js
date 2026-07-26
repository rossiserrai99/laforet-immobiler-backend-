"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Home, Users, CheckCircle, Clock, PlusCircle, ArrowRight, Eye, Mail, Phone, MapPin, Sparkles, Building2 } from 'lucide-react';
import adminService from '@/services/admin.service';
import propertyService from '@/services/property.service';
import leadService from '@/services/lead.service';

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

        let propsList = [];
        if (propsRes.status === 'fulfilled') {
          propsList = propsRes.value?.data?.properties || propsRes.value?.properties || [];
          setRecentProperties(propsList);
          const totalInDB = propsRes.value?.data?.total || propsRes.value?.results || propsList.length;
          if (!loadedStats.totalProperties || loadedStats.totalProperties === 0) {
            loadedStats.totalProperties = totalInDB;
          }
          if (!loadedStats.activeProperties || loadedStats.activeProperties === 0) {
            loadedStats.activeProperties = propsList.filter(p => p.status === 'Disponible').length || totalInDB;
          }
        }

        let leadsList = [];
        if (leadsRes.status === 'fulfilled') {
          leadsList = leadsRes.value?.data?.leads || leadsRes.value?.leads || [];
          setRecentLeads(leadsList.slice(0, 5));
          const leadsTotalInDB = leadsRes.value?.data?.results ?? leadsRes.value?.data?.total ?? leadsRes.value?.results ?? leadsList.length;
          if (!loadedStats.totalLeads || loadedStats.totalLeads === 0) {
            loadedStats.totalLeads = leadsTotalInDB;
          }
          if (!loadedStats.newLeads || loadedStats.newLeads === 0) {
            loadedStats.newLeads = leadsList.filter(l => l.status === 'New' || l.status === 'Nouveau').length;
          }
        }

        setStats(loadedStats);
      } catch (err) {
        console.warn("Failed to fetch dashboard data:", err?.message || "Error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Price formatter without centimes
  const formatPrice = (price) => {
    if (!price) return "Sur demande";
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0
    }).format(price).replace('DZD', 'DA');
  };

  return (
    <div className="space-y-10">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-sans font-extrabold text-white tracking-tight">
            Tableau de Bord Exécutif
          </h1>
          <p className="text-warm-300 text-sm mt-1 font-sans">
            Aperçu en temps réel de votre portefeuille immobilier et des demandes clients.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-b from-[#E3CD86] to-[#C9A227] hover:from-[#F3E6BF] hover:to-[#D4AF37] text-[#090B10] font-bold text-sm shadow-[0_4px_20px_rgba(201,162,39,0.3)] hover:shadow-[0_4px_25px_rgba(201,162,39,0.5)] border border-[#F3E6BF]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Ajouter un Bien</span>
          </Link>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-charcoal-900/80 border border-white/15 text-white font-medium text-sm hover:border-gold-400/50 hover:bg-charcoal-800 transition-all"
          >
            <Users className="w-4 h-4 text-gold-400" />
            <span>Gérer les Leads</span>
          </Link>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-400"></div>
          <p className="text-warm-400 text-sm font-mono uppercase tracking-widest">Chargement des données en cours...</p>
        </div>
      ) : (
        <>
          {/* 4 KPI Luxury Glassmorphic Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#1C2234]/60 backdrop-blur-xl p-6 rounded-2xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-gold-500/40 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-warm-300 text-xs font-sans font-semibold uppercase tracking-wider">Total Catalogue</span>
                <div className="w-11 h-11 rounded-xl bg-gold-400/10 border border-gold-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Home className="w-5 h-5 text-gold-400" />
                </div>
              </div>
              <div className="text-3xl font-sans font-extrabold tracking-tight text-white mb-1">{stats.totalProperties}</div>
              <p className="text-xs text-warm-400 font-sans">Biens enregistrés dans l&apos;agence</p>
            </div>
            
            <div className="bg-[#1C2234]/60 backdrop-blur-xl p-6 rounded-2xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-gold-500/40 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-warm-300 text-xs font-sans font-semibold uppercase tracking-wider">Biens Disponibles</span>
                <div className="w-11 h-11 rounded-xl bg-forest-400/10 border border-forest-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-5 h-5 text-forest-400" />
                </div>
              </div>
              <div className="text-3xl font-sans font-extrabold tracking-tight text-white mb-1">{stats.activeProperties}</div>
              <p className="text-xs text-forest-400 font-sans font-medium">Actuellement visibles en ligne</p>
            </div>

            <div className="bg-[#1C2234]/60 backdrop-blur-xl p-6 rounded-2xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-gold-500/40 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-warm-300 text-xs font-sans font-semibold uppercase tracking-wider">Demandes Reçues</span>
                <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5 text-warm-300" />
                </div>
              </div>
              <div className="text-3xl font-sans font-extrabold tracking-tight text-white mb-1">{stats.totalLeads}</div>
              <p className="text-xs text-warm-400 font-sans">Total des contacts clients</p>
            </div>

            <div className="bg-[#1C2234]/60 backdrop-blur-xl p-6 rounded-2xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:border-gold-500/40 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-warm-300 text-xs font-sans font-semibold uppercase tracking-wider">Leads En Attente</span>
                <div className="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Clock className="w-5 h-5 text-red-400" />
                </div>
              </div>
              <div className="text-3xl font-sans font-extrabold tracking-tight text-red-400 mb-1">{stats.newLeads}</div>
              <p className="text-xs text-red-400/80 font-sans font-medium">Nécessitent votre attention</p>
            </div>
          </div>

          {/* 2-Column Real-Time Data Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Properties Luxury Table */}
            <div className="bg-[#1C2234]/60 backdrop-blur-xl rounded-2xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-gold-400" />
                  <h3 className="font-sans text-lg font-extrabold text-white tracking-tight">Derniers Biens Ajoutés</h3>
                </div>
                <Link 
                  href="/admin/properties" 
                  className="text-xs font-sans font-semibold uppercase tracking-wider text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors"
                >
                  <span>Voir Tout ({stats.totalProperties || recentProperties.length})</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="flex-1 p-4 overflow-x-auto">
                {recentProperties.length === 0 ? (
                  <div className="text-center py-12 text-warm-400 text-sm font-sans">
                    Aucune propriété enregistrée pour l&apos;instant.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentProperties.map(property => (
                      <div 
                        key={property._id} 
                        className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-charcoal-800 shrink-0 border border-white/10">
                            {property.images && property.images[0] ? (
                              <Image 
                                src={property.images[0]} 
                                alt={property.title}
                                fill
                                sizes="48px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-warm-500 text-xs font-sans">No img</div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-sm font-sans font-semibold text-white truncate max-w-[200px] sm:max-w-[240px]">
                              {property.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-warm-400 mt-0.5 font-sans">
                              <span className="text-gold-400 font-medium">{property.type}</span>
                              <span>•</span>
                              <span className="truncate">{property.location?.commune || 'Alger'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 ml-3">
                          <div className="text-sm font-sans font-extrabold text-white tracking-tight">
                            {formatPrice(property.price)}
                          </div>
                          <div className="mt-1">
                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-sans uppercase tracking-wider font-semibold ${
                              property.status === 'Disponible' 
                                ? 'bg-forest-500/20 text-forest-300 border border-forest-500/30' 
                                : 'bg-warm-500/20 text-warm-300 border border-warm-500/30'
                            }`}>
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

            {/* Recent Leads Luxury Table */}
            <div className="bg-[#1C2234]/60 backdrop-blur-xl rounded-2xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gold-400" />
                  <h3 className="font-sans text-lg font-extrabold text-white tracking-tight">Dernières Demandes Clients</h3>
                </div>
                <Link 
                  href="/admin/leads" 
                  className="text-xs font-sans font-semibold uppercase tracking-wider text-gold-400 hover:text-gold-300 flex items-center gap-1 transition-colors"
                >
                  <span>Gérer Tout ({stats.totalLeads || recentLeads.length})</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="flex-1 p-4 overflow-x-auto">
                {recentLeads.length === 0 ? (
                  <div className="text-center py-12 text-warm-400 text-sm font-sans">
                    Aucun lead reçu pour le moment.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentLeads.map(lead => (
                      <div 
                        key={lead._id} 
                        onClick={() => router.push(`/admin/leads?id=${lead._id}`)}
                        className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/15 transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-sans font-semibold text-sm text-white">{lead.name || 'Anonyme'}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-sans uppercase tracking-wider font-semibold ${
                              (lead.status === 'Nouveau' || lead.status === 'New')
                                ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                                : 'bg-gold-500/20 text-gold-300 border border-gold-500/30'
                            }`}>
                              {lead.status === 'New' ? 'Nouveau' : (lead.status || 'Nouveau')}
                            </span>
                          </div>
                          <span className="text-xs text-warm-400 font-sans font-medium">
                            {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('fr-FR') : "Aujourd'hui"}
                          </span>
                        </div>

                        <p className="text-xs text-warm-300 line-clamp-2 mb-2 font-light">
                          {lead.message || "Aucun message spécifié."}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-warm-400">
                          {lead.phone && (
                            <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 text-gold-400 hover:underline">
                              <Phone size={12} />
                              <span>{lead.phone}</span>
                            </a>
                          )}
                          {lead.email && (
                            <a href={`mailto:${lead.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1 hover:text-white truncate">
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
