"use client";

import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, Calendar, CheckCircle, Trash2, Users, ExternalLink, Home } from 'lucide-react';
import leadService from '@/services/lead.service';

function LeadsPageContent() {
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const data = await leadService.getAll();
      setLeads(data.data?.leads || data.leads || []);
      
      const leadIdFromUrl = searchParams.get('id');
      if (leadIdFromUrl) {
        setExpandedRow(leadIdFromUrl);
      }
    } catch (error) {
      console.warn('Failed to fetch leads:', error?.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [searchParams]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await leadService.updateStatus(id, newStatus);
      setLeads(leads.map(lead => lead._id === id ? { ...lead, status: newStatus } : lead));
    } catch (error) {
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce lead définitivement ?")) {
      try {
        await leadService.remove(id);
        setLeads(leads.filter(lead => lead._id !== id));
      } catch (error) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Aujourd'hui";
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Nouveau':
      case 'New':
        return 'bg-red-500/20 text-red-300 border border-red-500/30';
      case 'Contacté':
      case 'Contacted':
        return 'bg-gold-500/20 text-gold-300 border border-gold-500/30';
      case 'Résolu':
      case 'Resolved':
        return 'bg-forest-500/20 text-forest-300 border border-forest-500/30';
      default:
        return 'bg-warm-500/20 text-warm-300 border border-warm-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-white tracking-tight">
            Demandes & Leads
          </h1>
          <p className="text-warm-300 text-sm mt-1 font-sans">
            Consultez, qualifiez et répondez en direct aux demandes de vos prospects.
          </p>
        </div>
      </div>

      {/* Luxury Glassmorphism Table Card */}
      <div className="bg-[#1C2234]/60 backdrop-blur-xl rounded-2xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-charcoal-950/40">
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider font-semibold text-warm-300">
            <Users className="w-4 h-4 text-gold-400" />
            <span>Total : {leads.length} demandes en ligne</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-charcoal-950/70 text-warm-300 font-sans text-xs uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Date & Heure</th>
                <th className="px-6 py-4 font-semibold">Coordonnées Prospect</th>
                <th className="px-6 py-4 font-semibold">Type Demande</th>
                <th className="px-6 py-4 font-semibold">Bien concerné</th>
                <th className="px-6 py-4 font-semibold">Statut du Lead</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-warm-400 font-sans">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400"></div>
                      <span className="text-xs font-mono uppercase tracking-widest">Chargement des leads...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-warm-400">
                    Aucune demande client reçue pour le moment.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <React.Fragment key={lead._id}>
                    <tr 
                      className={`hover:bg-white/5 transition-colors cursor-pointer text-white ${expandedRow === lead._id ? 'bg-white/10' : ''}`} 
                      onClick={() => setExpandedRow(expandedRow === lead._id ? null : lead._id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-sans font-medium text-warm-300">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-2 text-gold-400" />
                          {formatDate(lead.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-sans font-semibold text-white">{lead.name || 'Anonyme'}</div>
                        {lead.email && (
                          <div className="text-xs text-warm-400 flex items-center mt-1 font-sans">
                            <Mail size={12} className="mr-1.5 text-gold-400"/> {lead.email}
                          </div>
                        )}
                        {lead.phone && (
                          <div className="text-xs text-warm-400 flex items-center mt-1 font-sans">
                            <Phone size={12} className="mr-1.5 text-gold-400"/> {lead.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-sans font-semibold bg-white/10 text-white border border-white/15">
                          {lead.type || 'Contact'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-warm-300">
                        {lead.propertyId ? (
                          <div>
                            <div className="font-sans font-medium text-white line-clamp-1 max-w-xs">{lead.propertyId.title}</div>
                            <div className="text-xs font-sans font-semibold text-gold-400 mt-1">RÉF: {lead.propertyId.reference}</div>
                          </div>
                        ) : (
                          <span className="text-warm-500 italic text-xs font-sans">Demande Générale</span>
                        )}
                      </td>
                      <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status || 'Nouveau'}
                          onChange={(e) => handleStatusChange(lead._id, e.target.value)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border font-sans font-semibold uppercase tracking-wider outline-none cursor-pointer bg-charcoal-900 ${getStatusBadgeClass(lead.status)}`}
                        >
                          <option value="Nouveau" className="bg-charcoal-900 text-white font-sans">Nouveau</option>
                          <option value="New" className="bg-charcoal-900 text-white font-sans">Nouveau (En attente)</option>
                          <option value="Contacté" className="bg-charcoal-900 text-white font-sans">Contacté</option>
                          <option value="Contacted" className="bg-charcoal-900 text-white font-sans">Contacté</option>
                          <option value="Résolu" className="bg-charcoal-900 text-white font-sans">Résolu</option>
                          <option value="Resolved" className="bg-charcoal-900 text-white font-sans">Résolu</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(lead._id); }}
                          title="Supprimer"
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-transparent hover:border-red-500/30 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                    
                    {/* Expanded Message Drawer */}
                    {expandedRow === lead._id && (
                      <tr className="bg-charcoal-950/60 border-b border-white/10">
                        <td colSpan="6" className="px-6 py-6 border-l-4 border-gold-400">
                          <div className="max-w-4xl">
                            <span className="text-xs font-sans font-semibold uppercase tracking-wider text-gold-400 block mb-2">
                              Message de {lead.name} :
                            </span>
                            <div className="bg-charcoal-900/90 p-4 rounded-xl border border-white/10 text-warm-200 whitespace-pre-wrap text-sm leading-relaxed">
                              {lead.message || <span className="italic text-warm-500">Aucun message fourni par le client.</span>}
                            </div>
                            
                            {lead.propertyId && (
                              <div className="mt-4 p-4 rounded-xl bg-charcoal-900/50 border border-white/10 flex flex-col sm:flex-row sm:items-center gap-4">
                                {lead.propertyId.images && lead.propertyId.images[0] ? (
                                  <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 shadow-md">
                                    <Image src={lead.propertyId.images[0]} alt={lead.propertyId.title || 'Propriété'} fill className="object-cover" />
                                  </div>
                                ) : (
                                  <div className="w-24 h-24 rounded-lg bg-charcoal-800 flex items-center justify-center shrink-0 border border-white/10 shadow-md">
                                    <Home className="w-8 h-8 text-warm-500" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs text-gold-400 font-sans font-semibold uppercase tracking-wider mb-1">PROPRIÉTÉ DEMANDÉE</div>
                                  <h4 className="text-white font-sans font-bold text-lg truncate">{lead.propertyId.title}</h4>
                                  <div className="text-sm text-warm-400 font-sans mt-0.5">Réf: {lead.propertyId.reference}</div>
                                </div>
                                {lead.propertyId.slug && (
                                  <Link 
                                    href={`/properties/${lead.propertyId.slug}`} 
                                    target="_blank" 
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-semibold transition-all shrink-0 mt-3 sm:mt-0"
                                  >
                                    <ExternalLink size={15} />
                                    <span>Voir l'annonce</span>
                                  </Link>
                                )}
                              </div>
                            )}

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              {(lead.status === 'New' || lead.status === 'Nouveau') && (
                                <button 
                                  onClick={() => handleStatusChange(lead._id, 'Contacté')}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-500/20 text-forest-300 border border-forest-500/30 hover:bg-forest-500/30 text-xs font-semibold transition-all"
                                >
                                  <CheckCircle size={15} />
                                  <span>Marquer comme Contacté</span>
                                </button>
                              )}
                              {lead.email && (
                                <a 
                                  href={`mailto:${lead.email}`}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-b from-[#E3CD86] to-[#C9A227] hover:from-[#F3E6BF] hover:to-[#D4AF37] text-[#090B10] font-bold text-xs shadow-[0_4px_15px_rgba(201,162,39,0.3)] hover:shadow-[0_4px_20px_rgba(201,162,39,0.5)] border border-[#F3E6BF]/40 hover:scale-105 transition-all duration-300"
                                >
                                  <Mail size={15} />
                                  <span>Répondre par Email</span>
                                </a>
                              )}
                              {lead.phone && (
                                <a 
                                  href={`tel:${lead.phone}`}
                                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-semibold transition-all"
                                >
                                  <Phone size={15} />
                                  <span>Appeler le {lead.phone}</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-gold-400 border-t-transparent animate-spin"></div>
      </div>
    }>
      <LeadsPageContent />
    </Suspense>
  );
}
