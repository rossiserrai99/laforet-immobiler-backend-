"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Button } from '@/components/ui';
import { ImageUploader } from '@/components/admin/ImageUploader';
import propertyService from '@/services/property.service';

// All 57 communes of Wilaya d'Alger (Wilaya 16)
const ALGIERS_COMMUNES = [
  'Alger Centre', 'Sidi M\'Hamed', 'El Madania', 'Belouizdad', 'Bab El Oued',
  'Bologhine', 'Casbah', 'Oued Koriche', 'Bir Mourad Raïs', 'El Biar',
  'Bouzaréah', 'Birkhadem', 'El Harrach', 'Baraki', 'Oued Smar',
  'Bachdjerrah', 'Hussein Dey', 'Kouba', 'Souidania', 'Chéraga',
  'Saoula', 'Hydra', 'Mohammadia', 'Bordj El Kiffan', 'El Magharia',
  'Bab Ezzouar', 'Ben Aknoun', 'Dely Ibrahim', 'Hammamet', 'Raïs Hamidou',
  'Djasr Kasentina', 'El Mouradia', 'Ain Benian', 'Staoueli', 'Zeralda',
  'Mahelma', 'Rahmania', 'Ouled Chebel', 'Sidi Abdallah', 'Ain Taya',
  'Bordj El Bahri', 'El Marsa', 'H\'raoua', 'Rouiba', 'Réghaia',
  'Ain Taya', 'Bordj El Bahri', 'El Mersa', 'Dar El Beïda', 'Bab Ezzouar',
  'Ben Aknoun', 'Dely Ibrahim', 'Hammamet', 'Raïs Hamidou', 'Khraicia',
  'Sidi Moussa', 'Ain Benian'
].filter((v, i, a) => a.indexOf(v) === i).sort();

export function PropertyForm({ initialData = null }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    reference: '',
    category: 'Appartement',
    type: 'Vente',
    status: 'Disponible',
    price: '',
    priceHidden: false,
    area: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    location: {
      wilaya: '',
      commune: '',
      address: ''
    },
    features: '', // string representation for textarea
    homePageSection: 'None'
  });

  const [filesToUpload, setFilesToUpload] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  useEffect(() => {
    if (initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: initialData.title || '',
        reference: initialData.reference || '',
        category: initialData.category || 'Appartement',
        type: initialData.type || 'Vente',
        status: initialData.status || 'Disponible',
        price: initialData.price || '',
        priceHidden: initialData.priceHidden || false,
        area: initialData.area || '',
        rooms: initialData.rooms || '',
        bedrooms: initialData.bedrooms || '',
        bathrooms: initialData.bathrooms || '',
        description: initialData.description || '',
        location: {
          wilaya: initialData.location?.wilaya || '',
          commune: initialData.location?.commune || '',
          address: initialData.location?.address || ''
        },
        features: initialData.features ? initialData.features.join(', ') : '',
        homePageSection: initialData.homePageSection || 'None'
      });
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('location.')) {
      const locationField = name.split('.')[1];
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Build FormData for multipart upload
      const data = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        if (key === 'location') {
          data.append('location', JSON.stringify(formData.location));
        } else if (key === 'features') {
          // Convert comma separated string to array string
          const featuresArray = formData.features.split(',').map(f => f.trim()).filter(f => f !== '');
          data.append('features', JSON.stringify(featuresArray));
        } else {
          data.append(key, formData[key]);
        }
      });

      // Append files
      filesToUpload.forEach(file => {
        data.append('images', file);
      });

      // Append deleted images if any
      if (deletedImages.length > 0) {
        data.append('deletedImages', JSON.stringify(deletedImages));
      }

      if (initialData) {
        await propertyService.update(initialData._id, data);
      } else {
        await propertyService.create(data);
      }

      router.push('/admin/properties');
      router.refresh();
    } catch (err) {
      // Intentionally not using console.error to prevent Next.js dev overlay from blocking the UI
      console.log('Erreur de sauvegarde:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde.');
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-500/10 text-red-700 p-4 rounded-xl border border-red-500/30 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Grid for General Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F3F6F4] border border-[#C5D2CB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-3xl p-6 md:p-8">
        <div className="col-span-full mb-1">
          <h2 className="text-xl font-sans font-bold text-[#0B150F] border-b border-[#D8E2DC] pb-3">Informations Générales</h2>
        </div>
        
        <div className="col-span-full">
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Titre de l&apos;annonce *</label>
          <Input name="title" value={formData.title} onChange={handleInputChange} required className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] placeholder-[#7E9689] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm" />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Référence interne *</label>
          <Input name="reference" value={formData.reference} onChange={handleInputChange} required className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] placeholder-[#7E9689] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm" />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Statut *</label>
          <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm">
            <option value="Disponible">Disponible</option>
            <option value="Vendu">Vendu</option>
            <option value="Loué">Loué</option>
            <option value="Réservé">Réservé</option>
            <option value="Brouillon">Brouillon</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Type de transaction *</label>
          <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm">
            <option value="Vente">Vente</option>
            <option value="Location">Location</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Catégorie *</label>
          <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm">
            <option value="Appartement">Appartement</option>
            <option value="Studio">Studio</option>
            <option value="Duplex">Duplex</option>
            <option value="Triplex">Triplex</option>
            <option value="Villa">Villa</option>
            <option value="Terrain">Terrain</option>
            <option value="Local Commercial">Local Commercial</option>
            <option value="Bureau">Bureau</option>
            <option value="Immeuble">Immeuble</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Affichage Accueil</label>
          <select name="homePageSection" value={formData.homePageSection} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm">
            <option value="None">Ne pas afficher sur l&apos;accueil</option>
            <option value="Exception">Section: Propriétés d&apos;Exception</option>
            <option value="Apartment">Section: Appartements d&apos;Exception</option>
          </select>
        </div>
      </div>

      {/* Grid for Details & Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#F3F6F4] border border-[#C5D2CB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-3xl p-6 md:p-8">
        <div className="col-span-full mb-1">
          <h2 className="text-xl font-sans font-bold text-[#0B150F] border-b border-[#D8E2DC] pb-3">Détails & Prix</h2>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Prix (DZD) *</label>
          <Input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] placeholder-[#7E9689] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm" />
        </div>

        <div className="flex items-center md:pt-6">
          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input type="checkbox" name="priceHidden" checked={formData.priceHidden} onChange={handleInputChange} className="rounded text-[#133E26] bg-white border-[#B8C9C0] focus:ring-[#133E26] h-4 w-4" />
            <span className="text-sm font-medium text-[#1E3025]">Prix &quot;Sur demande&quot;</span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Surface (m²) *</label>
          <Input type="number" name="area" value={formData.area} onChange={handleInputChange} required className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] placeholder-[#7E9689] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm" />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Pièces</label>
          <Input type="number" name="rooms" value={formData.rooms} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] placeholder-[#7E9689] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm" />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Chambres</label>
          <Input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] placeholder-[#7E9689] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm" />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Salles de bain</label>
          <Input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] placeholder-[#7E9689] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm" />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#F3F6F4] border border-[#C5D2CB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-3xl p-6 md:p-8">
        <div className="col-span-full mb-1">
          <h2 className="text-xl font-sans font-bold text-[#0B150F] border-b border-[#D8E2DC] pb-3">Localisation</h2>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Wilaya *</label>
          <select
            name="location.wilaya"
            value={formData.location.wilaya}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm"
          >
            <option value="">— Sélectionner —</option>
            <option value="Alger">Alger (Wilaya 16)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Commune *</label>
          <select
            name="location.commune"
            value={formData.location.commune}
            onChange={(e) => {
              handleInputChange(e);
              if (e.target.value) {
                setFormData(prev => ({ ...prev, location: { ...prev.location, wilaya: 'Alger', commune: e.target.value } }));
              }
            }}
            required
            className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm"
          >
            <option value="">— Sélectionner une commune —</option>
            {ALGIERS_COMMUNES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-span-full">
          <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Adresse complète</label>
          <Input name="location.address" value={formData.location.address} onChange={handleInputChange} className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] placeholder-[#7E9689] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm" />
        </div>
      </div>

      {/* Description & Features */}
      <div className="bg-[#F3F6F4] border border-[#C5D2CB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-3xl p-6 md:p-8">
        <h2 className="text-xl font-sans font-bold text-[#0B150F] border-b border-[#D8E2DC] pb-3 mb-5">Description</h2>
        
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Description détaillée *</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              required 
              rows={6}
              placeholder="Décrivez les atouts, l'agencement et l'environnement du bien..."
              className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] placeholder-[#7E9689] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm resize-y"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider font-bold text-[#133E26] mb-1.5">Caractéristiques (séparées par des virgules)</label>
            <textarea 
              name="features" 
              value={formData.features} 
              onChange={handleInputChange} 
              rows={3}
              placeholder="Ex: Piscine, Garage, Vue sur mer, Jardin..."
              className="w-full px-4 py-3 bg-white border border-[#B8C9C0] rounded-xl text-[#0B150F] placeholder-[#7E9689] focus:border-[#133E26] focus:ring-2 focus:ring-[#133E26]/20 outline-none transition-all font-medium text-sm shadow-sm resize-y"
            />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-[#F3F6F4] border border-[#C5D2CB] shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-3xl p-6 md:p-8">
        <h2 className="text-xl font-sans font-bold text-[#0B150F] border-b border-[#D8E2DC] pb-3 mb-5">Médias (Images)</h2>
        <ImageUploader 
          existingImages={initialData?.media?.images || []} 
          onFilesSelected={setFilesToUpload} 
          onFilesDeleted={setDeletedImages}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-6 border-t border-[#D8E2DC]">
        <button 
          type="button" 
          onClick={() => router.push('/admin/properties')} 
          className="w-full sm:w-auto px-6 py-3.5 sm:py-3 rounded-xl bg-[#E2EAE5] hover:bg-[#D3DDD7] text-[#133E26] font-bold text-sm border border-[#B8C9C0] transition-all duration-200 text-center"
        >
          Annuler
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 sm:py-3 rounded-xl bg-[#133E26] hover:bg-[#1A4F32] text-white font-bold text-sm shadow-[0_4px_15px_rgba(19,62,38,0.25)] hover:shadow-[0_4px_22px_rgba(19,62,38,0.35)] border border-[#2D5A43] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? 'Enregistrement en cours...' : (initialData ? 'Mettre à jour le bien' : 'Publier le bien')}
        </button>
      </div>
    </form>
  );
}
