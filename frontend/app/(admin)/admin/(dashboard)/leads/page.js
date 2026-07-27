"use client";

import React, { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, Calendar, CheckCircle, Trash2, Users, ExternalLink, Home, MessageSquare, CheckCheck } from 'lucide-react';
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
    const timer = setTimeout(() => {
      fetchLeads();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        alert("Erreur lors de la suppression du lead");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-[#0B150F] tracking-tight">
            Demandes & Leads
          </h1>
          <p className="text-[#3C5245] text-sm mt-1 font-sans">
            Consultez, qualifiez et répondez en direct aux demandes de vos prospects.
          </p>
        </div>
      </div>

      {/* Luxury Solid Forest Green Table Card */}
      <div className="bg-[#132A1E]/85 backdrop-blur-xl rounded-3xl border border-[#2D5A43]/50 shadow-[0_20px_50px_rgba(19,42,30,0.15)] overflow-hidden text-white">
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#193B28]/90">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold text-[#E8C97A]">
            <Users className="w-4 h-4 text-[#E8C97A]" />
            <span>Total : {leads.length} demandes en ligne</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-[#193B28]/90 text-[#8EA89A] font-mono text-xs uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Date & Heure</th>
                <th className="px-6 py-4 font-semibold">Coordonnées Prospect</th>
                <th className="px-6 py-4 font-semibold">Type Demande</th>
                <th className="px-6 py-4 font-semibold">Bien concerné</th>
                <th className="px-6 py-4 font-semibold">Message & Budget</th>
                <th className="px-6 py-4 font-semibold text-right">Statut & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-warm-400 font-sans">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400"></div>
                      <span className="font-sans text-xs">Chargement des demandes clients...</span>
                    </div>
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-warm-400 font-sans">
                    Aucun lead reçu pour le moment.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <React.Fragment key={lead._id}>
                    <tr 
                      className={`hover:bg-[#1C412C]/80 transition-colors cursor-pointer text-white ${expandedRow === lead._id ? 'bg-[#1F4831]/80' : ''}`} 
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
                    
                    {/* Expanded WhatsApp-Style Modern Message Drawer */}
                    {expandedRow === lead._id && (
                      <tr className="bg-[#09150E] border-b border-[#2D5A43]/40">
                        <td colSpan="6" className="px-4 sm:px-8 py-8 border-l-4 border-[#25D366]">
                          <div className="max-w-4xl mx-auto bg-[#0B1A12]/95 backdrop-blur-2xl rounded-3xl p-6 border border-[#2D5A43]/50 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                            {/* Header of Chat Window */}
                            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-5 border-b border-white/10">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[#1A3A2A] border-2 border-[#25D366] flex items-center justify-center text-white font-bold text-base shadow-md">
                                  {(lead.name || 'C').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-white font-sans font-bold text-base">{lead.name || 'Client Anonyme'}</h4>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#25D366]/20 text-[#25D366] text-[10px] font-mono font-bold uppercase border border-[#25D366]/30">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span>
                                      En ligne • WhatsApp
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-warm-400 font-sans mt-0.5">
                                    {lead.phone && <span>Tél : <strong className="text-white font-mono">{lead.phone}</strong></span>}
                                    {lead.email && <span>Email : <strong className="text-white">{lead.email}</strong></span>}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <span className="text-[11px] font-mono font-semibold text-gold-400 block">
                                  {lead.type ? lead.type.toUpperCase() : 'DEMANDE DE CONTACT'}
                                </span>
                                <span className="text-[10px] text-warm-500 font-mono">
                                  Reçu le {formatDate(lead.createdAt)}
                                </span>
                              </div>
                            </div>

                            {/* WhatsApp Incoming Chat Bubble Container */}
                            <div className="relative bg-[#07110B]/80 p-5 rounded-2xl border border-white/5 mb-6 shadow-inner">
                              {/* WhatsApp Chat Bubble (Authentic WhatsApp Incoming Grey Bubble) */}
                              <div className="bg-[#202C33] text-[#E9EDEF] rounded-2xl rounded-tl-none p-4 sm:p-5 w-full max-w-full sm:max-w-2xl border border-[#2A3942] shadow-lg relative break-words">
                                {/* Bubble Header */}
                                <div className="flex items-center justify-between gap-4 mb-2 pb-2 border-b border-white/10">
                                  <span className="text-xs font-sans font-extrabold text-[#E8C97A] tracking-wide">
                                    {lead.name || 'Client La Forêt'}
                                  </span>
                                  <span className="text-[10px] font-mono text-[#8696A0] bg-[#182229] px-2.5 py-0.5 rounded border border-[#2A3942]">
                                    Message Client
                                  </span>
                                </div>

                                {/* Bubble Message Content */}
                                <div className="font-sans text-sm sm:text-base leading-relaxed text-[#E9EDEF] whitespace-pre-wrap select-text py-1.5 break-words">
                                  {lead.message || <span className="italic text-[#8696A0]">Aucun message écrit.</span>}
                                </div>

                                {/* Bubble Footer with Timestamp & WhatsApp Iconic Blue Read Checkmarks */}
                                <div className="flex items-center justify-end gap-1.5 mt-3 pt-1 text-[11px] font-mono text-[#8696A0]">
                                  <span>{formatDate(lead.createdAt)}</span>
                                  <CheckCheck className="w-4 h-4 text-[#53BDEB]" title="Reçu et lu (WhatsApp Blue Check)" />
                                </div>
                              </div>

                              {/* Associated Real Property Picture Preview Card (like a WhatsApp shared attachment) */}
                              {lead.propertyId && (
                                <div className="mt-4 max-w-2xl p-4 rounded-2xl bg-[#11271B]/90 border border-[#2D5A43]/50 flex flex-col sm:flex-row sm:items-center gap-4 shadow-md">
                                  <div className="relative w-28 h-28 sm:w-32 sm:h-28 rounded-xl overflow-hidden shrink-0 shadow-lg border border-white/20 bg-charcoal-800">
                                    <Image 
                                      src={getPropertyImage(lead.propertyId)} 
                                      alt={lead.propertyId.title || 'Propriété La Forêt'} 
                                      fill 
                                      sizes="128px"
                                      className="object-cover group-hover:scale-105 transition-transform duration-300" 
                                    />
                                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] font-mono text-[#E8C97A]">
                                      PIÈCE JOINTE
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-[10px] text-[#25D366] font-mono font-bold uppercase tracking-wider bg-[#25D366]/10 px-2 py-0.5 rounded border border-[#25D366]/30">
                                        BIEN IMMOBILIER CONCERNÉ
                                      </span>
                                      <span className="text-xs text-gold-400 font-mono font-semibold">
                                        Réf: {lead.propertyId.reference || 'N/A'}
                                      </span>
                                    </div>
                                    <h4 className="text-white font-sans font-bold text-base sm:text-lg truncate">
                                      {lead.propertyId.title || 'Bien immobilier'}
                                    </h4>
                                    <div className="text-xs text-warm-300 font-sans mt-1 line-clamp-1">
                                      {lead.propertyId.location?.commune || 'Alger'} • {lead.propertyId.category || 'Villa'}
                                    </div>
                                  </div>
                                  {lead.propertyId.slug && (
                                    <Link 
                                      href={`/properties/${lead.propertyId.slug}`} 
                                      target="_blank" 
                                      className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D5A43] hover:bg-[#3B7658] text-white border border-[#2D5A43] text-xs font-bold transition-all shadow-md shrink-0 mt-2 sm:mt-0"
                                    >
                                      <ExternalLink size={14} />
                                      <span>Voir l&apos;annonce</span>
                                    </Link>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Quick Action Buttons Toolbar */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-white/10">
                              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                                {/* Official WhatsApp Direct Open Button */}
                                {lead.phone && (
                                  <a 
                                    href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Bonjour ${lead.name || ''}, nous faisons suite à votre message sur La Forêt Immobilier.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-[#071E10] font-extrabold text-xs shadow-[0_4px_15px_rgba(37,211,102,0.3)] hover:shadow-[0_4px_22px_rgba(37,211,102,0.5)] transition-all duration-300 hover:scale-105"
                                  >
                                    <MessageSquare size={16} className="fill-current" />
                                    <span>Répondre sur WhatsApp</span>
                                  </a>
                                )}

                                {/* Email Reply Button */}
                                {lead.email && (
                                  <a 
                                    href={`mailto:${lead.email}?subject=${encodeURIComponent(`La Forêt Immobilier — Suite à votre demande`)}`}
                                    className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-b from-[#E8C97A] to-[#C9A227] hover:from-[#F5D88E] hover:to-[#D4AF37] text-[#090B10] font-bold text-xs shadow-[0_4px_15px_rgba(201,162,39,0.3)] hover:scale-105 transition-all duration-300"
                                  >
                                    <Mail size={15} />
                                    <span>Répondre par Email</span>
                                  </a>
                                )}

                                {/* Call Phone Button */}
                                {lead.phone && (
                                  <a 
                                    href={`tel:${lead.phone}`}
                                    className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-semibold transition-all"
                                  >
                                    <Phone size={15} />
                                    <span>Appeler ({lead.phone})</span>
                                  </a>
                                )}
                              </div>

                              {(lead.status === 'New' || lead.status === 'Nouveau') && (
                                <button 
                                  onClick={() => handleStatusChange(lead._id, 'Contacté')}
                                  className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-[#2D5A43]/30 text-[#E8C97A] border border-[#2D5A43]/60 hover:bg-[#2D5A43]/50 text-xs font-bold transition-all"
                                >
                                  <CheckCircle size={15} className="text-[#25D366]" />
                                  <span>Marquer comme Contacté</span>
                                </button>
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
