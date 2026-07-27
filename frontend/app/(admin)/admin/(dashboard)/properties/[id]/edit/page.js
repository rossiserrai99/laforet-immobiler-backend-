"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { PropertyForm } from '@/features/admin/PropertyForm';
import propertyService from '@/services/property.service';

export default function EditPropertyPage() {
  const params = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProperty = async (id) => {
    try {
      const response = await propertyService.getAll(`?_id=${id}`);
      if (response.data.properties && response.data.properties.length > 0) {
        setProperty(response.data.properties[0]);
      }
    } catch (error) {
      console.warn("Failed to fetch property for editing:", error?.message || error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchProperty(params.id);
    }
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#133E26]"></div>
        <div className="text-center text-[#3C5245] text-sm font-mono uppercase tracking-widest">Chargement du bien...</div>
      </div>
    );
  }

  if (!property) {
    return <div className="text-center p-12 text-red-500 font-medium">Bien introuvable dans la base de données.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 border-b border-[#D8E2DC] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-sans font-extrabold text-[#0B150F] tracking-tight mb-1.5">
            Modifier le bien : {property.title}
          </h1>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#133E26]/10 text-[#133E26] text-xs font-mono font-bold uppercase border border-[#133E26]/20">
              Réf : {property.reference}
            </span>
            <span className="text-xs text-[#52665A] font-sans font-medium">
              • Modification en cours
            </span>
          </div>
        </div>
      </div>

      <PropertyForm initialData={property} />
    </div>
  );
}
