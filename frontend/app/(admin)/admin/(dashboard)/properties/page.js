"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, ExternalLink, Building2, Search, Filter } from 'lucide-react';
import propertyService from '@/services/property.service';

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const data = await propertyService.getAll('?limit=200&sort=-createdAt');
      setProperties(data.data?.properties || data.properties || []);
    } catch (error) {
      console.warn('Failed to fetch properties:', error?.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Disponible':
        return 'bg-forest-500/20 text-forest-300 border border-forest-500/30';
      case 'Vendu':
      case 'Loué':
        return 'bg-charcoal-700/60 text-warm-400 border border-white/10';
      case 'Réservé':
        return 'bg-gold-500/20 text-gold-300 border border-gold-500/30';
      default:
        return 'bg-warm-500/20 text-warm-300 border border-warm-500/30';
    }
  };

  const formatPrice = (price, priceHidden) => {
    if (priceHidden || !price) return "Sur demande";
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0
    }).format(price).replace('DZD', 'DA');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer définitivement ce bien ?')) {
      try {
        await propertyService.remove(id);
        fetchProperties();
      } catch (error) {
        alert('Erreur lors de la suppression');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-white tracking-tight">
            Catalogue des Biens
          </h1>
          <p className="text-warm-300 text-sm mt-1 font-sans">
            Gérez en temps réel vos propriétés, prix et disponibilités.
          </p>
        </div>
        <Link 
          href="/admin/properties/new" 
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-b from-[#E3CD86] to-[#C9A227] hover:from-[#F3E6BF] hover:to-[#D4AF37] text-[#090B10] font-bold text-sm shadow-[0_4px_20px_rgba(201,162,39,0.3)] hover:shadow-[0_4px_25px_rgba(201,162,39,0.5)] border border-[#F3E6BF]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un Bien</span>
        </Link>
      </div>

      {/* Luxury Glassmorphism Table Card */}
      <div className="bg-[#1C2234]/60 backdrop-blur-xl rounded-2xl border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.3)] overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-charcoal-950/40">
          <div className="flex items-center gap-2 text-xs font-sans uppercase tracking-wider font-semibold text-warm-300">
            <Building2 className="w-4 h-4 text-gold-400" />
            <span>Total : {properties.length} propriétés</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-charcoal-950/70 text-warm-300 font-sans text-xs uppercase tracking-wider font-semibold border-b border-white/10">
              <tr>
                <th className="px-6 py-4 font-semibold">Bien & Référence</th>
                <th className="px-6 py-4 font-semibold">Catégorie</th>
                <th className="px-6 py-4 font-semibold">Commune</th>
                <th className="px-6 py-4 font-semibold">Prix</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-warm-400 font-sans">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400"></div>
                      <span className="font-sans text-xs">Chargement de votre catalogue...</span>
                    </div>
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-warm-400 font-sans">
                    Aucun bien immobilier enregistré. Cliquez sur &quot;Ajouter un Bien&quot; pour commencer.
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-charcoal-800 shrink-0 border border-white/10">
                          {property.images && property.images[0] ? (
                            <Image 
                              src={property.images[0]} 
                              alt={property.title}
                              fill
                              sizes="56px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-warm-500 text-xs font-sans">No img</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[11px] font-sans uppercase tracking-wider text-gold-400 font-semibold block mb-0.5">
                            RÉF: {property.reference || 'N/A'}
                          </span>
                          <div className="font-sans font-semibold text-white truncate max-w-[240px]">
                            {property.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-warm-300">
                      <span className="font-sans font-medium text-white">{property.type}</span>
                      <span className="block text-xs text-warm-400 font-sans">{property.category}</span>
                    </td>
                    <td className="px-6 py-4 text-warm-300 font-sans">
                      {property.location?.commune || 'Alger'}
                    </td>
                    <td className="px-6 py-4 font-sans font-extrabold tracking-tight text-white">
                      {formatPrice(property.price, property.priceHidden)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-sans uppercase tracking-wider font-semibold ${getStatusBadge(property.status)}`}>
                        {property.status || 'Disponible'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {property.slug && (
                          <Link 
                            href={`/properties/${property.slug}`}
                            target="_blank"
                            title="Voir en ligne"
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-warm-300 hover:text-gold-400 border border-transparent hover:border-white/10 transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link 
                          href={`/admin/properties/${property._id}/edit`}
                          title="Modifier"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-warm-300 hover:text-white border border-transparent hover:border-white/10 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(property._id)}
                          title="Supprimer"
                          className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-transparent hover:border-red-500/30 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
