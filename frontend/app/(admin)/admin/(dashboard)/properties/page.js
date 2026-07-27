"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Edit, Trash2, ExternalLink, Building2, Search, Filter } from 'lucide-react';
import propertyService from '@/services/property.service';

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
    const timer = setTimeout(() => {
      fetchProperties();
    }, 0);
    return () => clearTimeout(timer);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-[#0B150F] tracking-tight">
            Catalogue des Biens
          </h1>
          <p className="text-[#3C5245] text-sm mt-1 font-sans">
            Gérez en temps réel vos propriétés, prix et disponibilités.
          </p>
        </div>
        <Link 
          href="/admin/properties/new" 
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#133E26] hover:bg-[#1B4F32] text-white font-bold text-sm shadow-sm border border-[#2D5A43]/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <Plus className="w-4 h-4 text-[#E8C97A]" />
          <span>Ajouter un Bien</span>
        </Link>
      </div>

      {/* Luxury Solid Forest Green Table Card */}
      <div className="bg-[#132A1E]/85 backdrop-blur-xl rounded-3xl border border-[#2D5A43]/50 shadow-[0_20px_50px_rgba(19,42,30,0.15)] overflow-hidden text-white">
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#193B28]/90">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-bold text-[#E8C97A]">
            <Building2 className="w-4 h-4 text-[#E8C97A]" />
            <span>Total : {properties.length} propriétés</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans">
            <thead className="bg-[#193B28]/90 text-[#8EA89A] font-mono text-xs uppercase tracking-wider font-semibold border-b border-white/10">
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
                    Aucune propriété dans le catalogue.
                  </td>
                </tr>
              ) : (
                properties.map((property) => (
                  <tr key={property._id} className="hover:bg-[#1C412C]/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-charcoal-800 shrink-0 border border-white/10">
                          <Image 
                            src={getPropertyImage(property)} 
                            alt={property.title || 'Bien immobilier'}
                            fill
                            sizes="56px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
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
                            className="p-2.5 sm:p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-warm-300 hover:text-gold-400 border border-transparent hover:border-white/10 transition-all"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link 
                          href={`/admin/properties/${property._id}/edit`}
                          title="Modifier"
                          className="p-2.5 sm:p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-warm-300 hover:text-white border border-transparent hover:border-white/10 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => handleDelete(property._id)}
                          title="Supprimer"
                          className="p-2.5 sm:p-2 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-transparent hover:border-red-500/30 transition-all"
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
