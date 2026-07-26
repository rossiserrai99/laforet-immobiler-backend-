import React from 'react';
import { PropertyForm } from '@/features/admin/PropertyForm';

export const metadata = {
  title: "Nouveau Bien | LA FORÊT",
};

export default function NewPropertyPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-serif font-bold text-white mb-2">Ajouter un nouveau bien</h1>
        <p className="text-warm-300 text-sm">Complétez le formulaire ci-dessous pour publier une nouvelle annonce immobilière de prestige.</p>
      </div>

      <PropertyForm />
    </div>
  );
}
