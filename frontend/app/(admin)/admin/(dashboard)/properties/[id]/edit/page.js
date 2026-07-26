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
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gold-400"></div>
        <div className="text-center text-warm-400 text-sm font-mono uppercase tracking-widest">Chargement du bien...</div>
      </div>
    );
  }

  if (!property) {
    return <div className="text-center p-12 text-red-400">Bien introuvable dans la base de données.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Modifier la propriété : {property.title}</h1>
        <p className="text-warm-300 text-xs font-mono uppercase tracking-widest text-gold-400">Référence: {property.reference}</p>
      </div>

      <PropertyForm initialData={property} />
    </div>
  );
}
