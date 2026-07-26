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
        <div className="bg-red-500/10 text-red-300 p-4 rounded-xl border border-red-500/20 text-sm">
          {error}
        </div>
      )}

      {/* Grid for General Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-charcoal-900/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
        <div className="col-span-full mb-2">
          <h2 className="text-lg font-serif font-medium text-white border-b border-white/10 pb-2">Informations Générales</h2>
        </div>
        
        <div className="col-span-full">
          <label className="block text-sm font-medium text-warm-300 mb-1">Titre de l&apos;annonce *</label>
          <Input name="title" value={formData.title} onChange={handleInputChange} required className="w-full bg-charcoal-950 border-white/15 text-white focus:ring-gold-400" />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-300 mb-1">Référence interne *</label>
          <Input name="reference" value={formData.reference} onChange={handleInputChange} required className="w-full bg-charcoal-950 border-white/15 text-white focus:ring-gold-400" />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-300 mb-1">Statut *</label>
          <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-charcoal-950 border border-white/15 rounded-xl focus:ring-2 focus:ring-gold-400/50 outline-none text-white font-medium">
            <option value="Disponible">Disponible</option>
            <option value="Vendu">Vendu</option>
            <option value="Loué">Loué</option>
            <option value="Réservé">Réservé</option>
            <option value="Brouillon">Brouillon</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-300 mb-1">Type de transaction *</label>
          <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-charcoal-950 border border-white/15 rounded-xl focus:ring-2 focus:ring-gold-400/50 outline-none text-white font-medium">
            <option value="Vente">Vente</option>
            <option value="Location">Location</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-300 mb-1">Catégorie *</label>
          <select name="category" value={formData.category} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-charcoal-950 border border-white/15 rounded-xl focus:ring-2 focus:ring-gold-400/50 outline-none text-white font-medium">
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
          <label className="block text-sm font-medium text-warm-300 mb-1">Affichage Accueil</label>
          <select name="homePageSection" value={formData.homePageSection} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-charcoal-950 border border-white/15 rounded-xl focus:ring-2 focus:ring-gold-400/50 outline-none text-white font-medium">
            <option value="None">Ne pas afficher sur l&apos;accueil</option>
            <option value="Exception">Section: Propriétés d&apos;Exception</option>
            <option value="Apartment">Section: Appartements d&apos;Exception</option>
          </select>
        </div>
      </div>

      {/* Grid for Details & Pricing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-charcoal-900/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
        <div className="col-span-full mb-2">
          <h2 className="text-lg font-serif font-medium text-white border-b border-white/10 pb-2">Détails & Prix</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-300 mb-1">Prix (DZD) *</label>
          <Input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full bg-charcoal-950 border-white/15 text-white focus:ring-gold-400" />
        </div>

        <div className="flex items-center md:pt-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" name="priceHidden" checked={formData.priceHidden} onChange={handleInputChange} className="rounded text-gold-400 bg-charcoal-950 border-white/20 focus:ring-gold-400 h-4 w-4" />
            <span className="text-sm font-medium text-warm-300">Prix &quot;Sur demande&quot;</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-300 mb-1">Surface (m²) *</label>
          <Input type="number" name="area" value={formData.area} onChange={handleInputChange} required className="w-full bg-charcoal-950 border-white/15 text-white focus:ring-gold-400" />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-300 mb-1">Pièces</label>
          <Input type="number" name="rooms" value={formData.rooms} onChange={handleInputChange} className="w-full bg-charcoal-950 border-white/15 text-white focus:ring-gold-400" />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-300 mb-1">Chambres</label>
          <Input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} className="w-full bg-charcoal-950 border-white/15 text-white focus:ring-gold-400" />
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-300 mb-1">Salles de bain</label>
          <Input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} className="w-full bg-charcoal-950 border-white/15 text-white focus:ring-gold-400" />
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-charcoal-900/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
        <div className="col-span-full mb-2">
          <h2 className="text-lg font-serif font-medium text-white border-b border-white/10 pb-2">Localisation</h2>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-300 mb-1">Wilaya *</label>
          <select
            name="location.wilaya"
            value={formData.location.wilaya}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2.5 bg-charcoal-950 border border-white/15 rounded-xl focus:ring-2 focus:ring-gold-400/50 outline-none text-white font-medium"
          >
            <option value="">— Sélectionner —</option>
            <option value="Alger">Alger (Wilaya 16)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-warm-300 mb-1">Commune *</label>
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
            className="w-full px-4 py-2.5 bg-charcoal-950 border border-white/15 rounded-xl focus:ring-2 focus:ring-gold-400/50 outline-none text-white font-medium"
          >
            <option value="">— Sélectionner une commune —</option>
            {ALGIERS_COMMUNES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-span-full">
          <label className="block text-sm font-medium text-warm-300 mb-1">Adresse complète</label>
          <Input name="location.address" value={formData.location.address} onChange={handleInputChange} className="w-full bg-charcoal-950 border-white/15 text-white focus:ring-gold-400" />
        </div>
      </div>

      {/* Description & Features */}
      <div className="bg-charcoal-900/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
        <h2 className="text-lg font-serif font-medium text-white border-b border-white/10 pb-2 mb-4">Description</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-warm-300 mb-1">Description détaillée *</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange} 
              required 
              rows={6}
              className="w-full px-4 py-3 bg-charcoal-950 border border-white/15 rounded-xl focus:ring-2 focus:ring-gold-400/50 outline-none resize-y text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-300 mb-1">Caractéristiques (séparées par des virgules)</label>
            <textarea 
              name="features" 
              value={formData.features} 
              onChange={handleInputChange} 
              rows={3}
              placeholder="Ex: Piscine, Garage, Vue sur mer, Jardin..."
              className="w-full px-4 py-3 bg-charcoal-950 border border-white/15 rounded-xl focus:ring-2 focus:ring-gold-400/50 outline-none resize-y text-white"
            />
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-charcoal-900/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.4)]">
        <h2 className="text-lg font-serif font-medium text-white border-b border-white/10 pb-2 mb-4">Médias (Images)</h2>
        <ImageUploader 
          existingImages={initialData?.media?.images || []} 
          onFilesSelected={setFilesToUpload} 
          onFilesDeleted={setDeletedImages}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" type="button" onClick={() => router.push('/admin/properties')} className="border-white/20 text-white hover:bg-white/10">
          Annuler
        </Button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-b from-[#E3CD86] to-[#C9A227] hover:from-[#F3E6BF] hover:to-[#D4AF37] text-[#090B10] font-bold text-sm shadow-[0_4px_20px_rgba(201,162,39,0.3)] hover:shadow-[0_4px_25px_rgba(201,162,39,0.5)] border border-[#F3E6BF]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
        >
          {isSubmitting ? 'Enregistrement en cours...' : (initialData ? 'Mettre à jour le bien' : 'Publier le bien')}
        </button>
      </div>
    </form>
  );
}
