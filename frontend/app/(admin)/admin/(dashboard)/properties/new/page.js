import React from 'react';
import { PropertyForm } from '@/features/admin/PropertyForm';

export const metadata = {
  title: "Nouveau Bien | LA FORÊT",
};

export default function NewPropertyPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 border-b border-[#D8E2DC] pb-6">
        <h1 className="text-3xl font-sans font-extrabold text-[#0B150F] tracking-tight mb-1">
          Ajouter un nouveau bien
        </h1>
        <p className="text-[#3C5245] text-sm font-sans">
          Complétez le formulaire ci-dessous pour publier une nouvelle annonce immobilière dans votre catalogue.
        </p>
      </div>

      <PropertyForm />
    </div>
  );
}
