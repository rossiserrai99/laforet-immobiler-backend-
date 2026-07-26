"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calculator, CheckCircle2, Award, Shield, Home, ArrowRight, Star,
  MapPin, Ruler, DoorOpen, Sparkles, Phone, Mail, User, MessageSquare,
  ChevronRight, TrendingUp, Clock, Lock
} from 'lucide-react';
import { PROPERTY_CATEGORIES } from '@/lib/constants';
import leadService from '@/services/lead.service';

const PROPERTY_TYPE_ICONS = {
  villa: '🏡',
  apartment: '🏢',
  studio: '🏠',
  land: '🌿',
  commercial: '🏪',
  office: '💼',
  luxury_home: '✨',
};

const TRUST_STATS = [
  { value: '+24 ans', label: "D'expertise immobilière", icon: Award },
  { value: '100%', label: 'Confidentialité garantie', icon: Lock },
  { value: '48h', label: "Délai de réponse max.", icon: Clock },
  { value: '5★', label: 'Satisfaction clients', icon: Star },
];

const CONDITIONS = [
  { value: 'Excellent / Luxe', label: 'Excellent / Luxe', desc: 'Finitions haut de gamme, rénovation récente' },
  { value: 'Bon état', label: 'Bon état', desc: 'Bien entretenu, quelques travaux mineurs' },
  { value: 'À rénover', label: 'À rénover', desc: 'Travaux importants à prévoir' },
];

export default function EstimationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propertyType: 'villa',
    commune: 'Hydra',
    surface: '',
    rooms: '',
    condition: 'Excellent / Luxe',
    name: '',
    email: '',
    phone: '',
    comments: ''
  });

  const communes = [
    "Hydra", "Chéraga", "Dely Ibrahim", "Ben Aknoun", "El Biar",
    "Ain Benian", "Zeralda", "Alger Centre", "Bab El Oued", "Kouba",
    "Birkhadem", "Birmandreis", "Ouled Fayet", "Draria", "Staoueli"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await leadService.create({
        name: formData.name || 'Client Estimation',
        email: formData.email,
        phone: formData.phone,
        message: `[Estimation ${formData.propertyType} - ${formData.commune} - ${formData.surface}m² - ${formData.rooms} pièces - État: ${formData.condition}] ${formData.comments || ''}`,
        type: 'Estimation',
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Erreur envoi estimation:", error);
      alert("Une erreur est survenue lors de l'envoi de la demande. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateForm = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const canProceedStep1 = formData.surface && formData.surface > 0;

  return (
    <div className="min-h-screen bg-charcoal-950">

      {/* ─── HERO ─── */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,162,39,0.15),transparent)]" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cpath d='M0 60L60 0M-10 10L10 -10M50 70L70 50' stroke='%23ffffff' stroke-width='0.3' opacity='0.04'/%3E%3C/svg%3E")`
          }}
        />

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-gold-400 font-mono text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/8 mb-8">
              <Sparkles size={12} />
              <span>Expertise Confidentielle • Depuis 2002</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-light text-white mb-6 tracking-tight leading-none">
              Estimer votre
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 font-normal">
                Patrimoine
              </span>
            </h1>

            <p className="text-warm-300 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-12">
              Obtenez une évaluation patrimoniale précise et discrète de votre propriété, fondée sur 24 années d&apos;analyse du marché de prestige à Alger.
            </p>

            {/* Trust Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TRUST_STATS.map(({ value, label, icon: Icon }) => (
                <div key={label} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm">
                  <Icon className="w-5 h-5 text-gold-400" />
                  <span className="text-2xl font-serif text-white font-light">{value}</span>
                  <span className="text-xs text-warm-400 text-center leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── MAIN CONTENT ─── */}
      <section className="container mx-auto px-6 md:px-12 pb-32">
        <div className="max-w-5xl mx-auto">

          {submitted ? (
            /* ── SUCCESS STATE ── */
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-charcoal-900 to-charcoal-950 border border-white/10 p-12 md:p-20 text-center shadow-2xl">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.08),transparent_70%)]" />
              <div className="relative z-10 space-y-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gold-400/20 to-gold-600/20 border border-gold-400/30 flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(201,162,39,0.2)]">
                  <CheckCircle2 className="w-12 h-12 text-gold-400" />
                </div>
                <div>
                  <h3 className="text-3xl md:text-4xl font-serif text-white font-light mb-4">
                    Demande d&apos;Estimation Enregistrée
                  </h3>
                  <p className="text-warm-300 font-light text-lg leading-relaxed max-w-lg mx-auto">
                    Votre demande a été transmise au pôle d&apos;expertise de l&apos;Agence La Forêt. Un expert dédié vous contactera en toute discrétion dans les <strong className="text-gold-400 font-semibold">48 heures</strong>.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <Link href="/">
                    <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-b from-[#E3CD86] to-[#C9A227] text-charcoal-950 font-bold rounded-full shadow-[0_0_30px_rgba(201,162,39,0.3)] hover:shadow-[0_0_40px_rgba(201,162,39,0.5)] transition-all duration-300 hover:scale-105">
                      <Home size={18} />
                      <span>Retour à l&apos;accueil</span>
                    </button>
                  </Link>
                  <Link href="/properties">
                    <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full font-medium transition-all duration-300">
                      <span>Voir nos biens</span>
                      <ArrowRight size={18} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* ── FORM ── */
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start">

                {/* ── LEFT COLUMN: Steps indicator ── */}
                <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-28 order-2 lg:order-1">
                  <div className="rounded-3xl bg-charcoal-900/60 backdrop-blur-xl border border-white/10 p-6 shadow-xl">
                    <p className="text-xs text-warm-400 uppercase tracking-widest font-mono mb-5">Étapes</p>
                    {[
                      { n: 1, label: 'Votre bien', sub: 'Type, surface, localisation' },
                      { n: 2, label: 'Vos coordonnées', sub: 'Pour recevoir votre rapport' },
                    ].map(({ n, label, sub }) => (
                      <div key={n} className={`flex items-center gap-4 p-4 rounded-2xl mb-2 transition-all duration-300 ${step === n ? 'bg-gold-500/10 border border-gold-500/25' : step > n ? 'opacity-60' : 'opacity-40'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${step === n ? 'bg-gradient-to-b from-[#E3CD86] to-[#C9A227] text-charcoal-950' : step > n ? 'bg-forest-500/20 text-forest-400 border border-forest-500/30' : 'bg-white/5 text-warm-500 border border-white/10'}`}>
                          {step > n ? <CheckCircle2 size={18} /> : n}
                        </div>
                        <div>
                          <p className={`font-semibold text-sm ${step === n ? 'text-gold-400' : 'text-warm-300'}`}>{label}</p>
                          <p className="text-xs text-warm-500">{sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Selected property type preview */}
                  {formData.surface && (
                    <div className="rounded-3xl bg-charcoal-900/40 backdrop-blur-xl border border-white/8 p-6 shadow-xl animate-fadeIn">
                      <p className="text-xs text-warm-400 uppercase tracking-widest font-mono mb-4">Récapitulatif</p>
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-warm-400">Type</span>
                          <span className="text-white font-medium flex items-center gap-1.5">
                            <span>{PROPERTY_TYPE_ICONS[formData.propertyType] || '🏠'}</span>
                            <span>{PROPERTY_CATEGORIES.find(c => c.value === formData.propertyType)?.label}</span>
                          </span>
                        </div>
                        {formData.commune && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-warm-400">Localisation</span>
                            <span className="text-white font-medium">{formData.commune}</span>
                          </div>
                        )}
                        {formData.surface && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-warm-400">Surface</span>
                            <span className="text-white font-medium">{formData.surface} m²</span>
                          </div>
                        )}
                        {formData.rooms && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-warm-400">Pièces</span>
                            <span className="text-white font-medium">{formData.rooms}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Confidentiality badge */}
                  <div className="rounded-2xl bg-forest-500/10 border border-forest-500/20 p-4 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-forest-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-forest-300">Confidentialité totale</p>
                      <p className="text-xs text-forest-400/80 mt-1 leading-relaxed">Vos informations sont strictement confidentielles et ne seront jamais partagées.</p>
                    </div>
                  </div>
                </div>

                {/* ── RIGHT COLUMN: Form panels ── */}
                <div className="lg:col-span-3 space-y-6 order-1 lg:order-2">

                  {/* STEP 1 */}
                  <div className={`rounded-3xl bg-charcoal-900/60 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 ${step !== 1 ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="px-5 py-5 sm:px-8 sm:py-6 border-b border-white/8 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#E3CD86] to-[#C9A227] flex items-center justify-center text-charcoal-950 font-bold text-sm">1</div>
                      <div>
                        <h3 className="font-bold text-white font-sans">Caractéristiques du bien</h3>
                        <p className="text-xs text-warm-400 mt-0.5">Informations principales sur la propriété à estimer</p>
                      </div>
                    </div>

                    <div className="p-5 sm:p-8 space-y-6">
                      {/* Property type selector */}
                      <div>
                        <label className="block text-xs font-semibold text-warm-300 uppercase tracking-wider mb-3">Type de Bien</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {PROPERTY_CATEGORIES.map(cat => (
                            <button
                              key={cat.value}
                              type="button"
                              onClick={() => updateForm('propertyType', cat.value)}
                              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all duration-200 ${formData.propertyType === cat.value
                                ? 'bg-gold-500/15 border-gold-500/40 text-gold-300'
                                : 'bg-white/3 border-white/8 text-warm-400 hover:border-white/20 hover:text-white'
                                }`}
                            >
                              <span className="text-xl">{PROPERTY_TYPE_ICONS[cat.value]}</span>
                              <span>{cat.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Commune */}
                      <div>
                        <label className="block text-xs font-semibold text-warm-300 uppercase tracking-wider mb-3">
                          <MapPin size={12} className="inline mr-1" />Commune (Alger)
                        </label>
                        <div className="relative">
                          <select
                            value={formData.commune}
                            onChange={(e) => updateForm('commune', e.target.value)}
                            className="w-full appearance-none bg-charcoal-950/70 border border-white/10 rounded-xl py-3.5 pl-4 pr-10 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all font-sans text-sm"
                          >
                            {communes.map(c => <option key={c} value={c} className="bg-charcoal-900">{c}</option>)}
                          </select>
                          <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-500 rotate-90 pointer-events-none" />
                        </div>
                      </div>

                      {/* Surface + Rooms */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-warm-300 uppercase tracking-wider mb-3">
                            <Ruler size={12} className="inline mr-1" />Surface (m²)
                          </label>
                          <input
                            required
                            type="number"
                            min="1"
                            placeholder="Ex: 450"
                            value={formData.surface}
                            onChange={(e) => updateForm('surface', e.target.value)}
                            className="w-full bg-charcoal-950/70 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-warm-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all font-sans text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-warm-300 uppercase tracking-wider mb-3">
                            <DoorOpen size={12} className="inline mr-1" />Nbre de Pièces
                          </label>
                          <input
                            type="number"
                            min="1"
                            placeholder="Ex: 8"
                            value={formData.rooms}
                            onChange={(e) => updateForm('rooms', e.target.value)}
                            className="w-full bg-charcoal-950/70 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-warm-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all font-sans text-sm"
                          />
                        </div>
                      </div>

                      {/* Condition */}
                      <div>
                        <label className="block text-xs font-semibold text-warm-300 uppercase tracking-wider mb-3">
                          <TrendingUp size={12} className="inline mr-1" />État général du bien
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {CONDITIONS.map(c => (
                            <button
                              key={c.value}
                              type="button"
                              onClick={() => updateForm('condition', c.value)}
                              className={`text-left p-4 rounded-xl border transition-all duration-200 ${formData.condition === c.value
                                ? 'bg-gold-500/15 border-gold-500/40'
                                : 'bg-white/3 border-white/8 hover:border-white/20'
                                }`}
                            >
                              <p className={`text-sm font-semibold mb-1 ${formData.condition === c.value ? 'text-gold-300' : 'text-white'}`}>{c.label}</p>
                              <p className="text-xs text-warm-500 leading-tight">{c.desc}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={!canProceedStep1}
                        onClick={() => setStep(2)}
                        className="w-full py-4 bg-gradient-to-b from-[#E3CD86] to-[#C9A227] text-charcoal-950 font-bold rounded-xl shadow-[0_4px_20px_rgba(201,162,39,0.3)] hover:shadow-[0_4px_30px_rgba(201,162,39,0.5)] transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
                      >
                        <span>Continuer vers mes coordonnées</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>

                  {/* STEP 2 */}
                  <div className={`rounded-3xl bg-charcoal-900/60 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 ${step !== 2 ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div className="px-5 py-5 sm:px-8 sm:py-6 border-b border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-b from-[#E3CD86] to-[#C9A227] flex items-center justify-center text-charcoal-950 font-bold text-sm">2</div>
                        <div>
                          <h3 className="font-bold text-white font-sans">Vos coordonnées confidentielles</h3>
                          <p className="text-xs text-warm-400 mt-0.5">Pour recevoir votre étude patrimoniale personnalisée</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs text-warm-400 hover:text-gold-400 transition-colors flex items-center gap-1"
                      >
                        <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                        Modifier
                      </button>
                    </div>

                    <div className="p-5 sm:p-8 space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {/* Name */}
                        <div>
                          <label className="block text-xs font-semibold text-warm-300 uppercase tracking-wider mb-2">
                            <User size={12} className="inline mr-1" />Nom & Prénom
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="Ex: M. Sofiane L."
                            value={formData.name}
                            onChange={(e) => updateForm('name', e.target.value)}
                            className="w-full bg-charcoal-950/70 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-warm-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all font-sans text-sm"
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-xs font-semibold text-warm-300 uppercase tracking-wider mb-2">
                            <Mail size={12} className="inline mr-1" />Adresse Email
                          </label>
                          <input
                            required
                            type="email"
                            placeholder="email@domaine.com"
                            value={formData.email}
                            onChange={(e) => updateForm('email', e.target.value)}
                            className="w-full bg-charcoal-950/70 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-warm-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all font-sans text-sm"
                          />
                        </div>

                        {/* Phone */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-warm-300 uppercase tracking-wider mb-2">
                            <Phone size={12} className="inline mr-1" />Numéro de Téléphone
                          </label>
                          <input
                            required
                            type="tel"
                            placeholder="+213 (0) 555..."
                            value={formData.phone}
                            onChange={(e) => updateForm('phone', e.target.value)}
                            className="w-full bg-charcoal-950/70 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-warm-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all font-sans text-sm"
                          />
                        </div>

                        {/* Comments */}
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-warm-300 uppercase tracking-wider mb-2">
                            <MessageSquare size={12} className="inline mr-1" />Précisions complémentaires
                          </label>
                          <textarea
                            rows={4}
                            placeholder="Piscine, jardin, vue mer, standing particulier, travaux récents..."
                            value={formData.comments}
                            onChange={(e) => updateForm('comments', e.target.value)}
                            className="w-full bg-charcoal-950/70 border border-white/10 rounded-xl py-3.5 px-4 text-white placeholder-warm-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/30 transition-all font-sans text-sm resize-none"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-b from-[#E3CD86] to-[#C9A227] text-charcoal-950 font-bold rounded-xl shadow-[0_4px_20px_rgba(201,162,39,0.3)] hover:shadow-[0_4px_30px_rgba(201,162,39,0.5)] transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 text-base"
                      >
                        {isLoading ? (
                          <>
                            <span className="w-5 h-5 border-2 border-charcoal-950 border-t-transparent rounded-full animate-spin"></span>
                            <span>Envoi en cours...</span>
                          </>
                        ) : (
                          <>
                            <span>Demander mon estimation confidentielle</span>
                            <ArrowRight size={18} />
                          </>
                        )}
                      </button>

                      <p className="text-center text-xs text-warm-500 flex items-center justify-center gap-1.5">
                        <Lock size={10} />
                        Vos données sont strictement confidentielles et protégées.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
