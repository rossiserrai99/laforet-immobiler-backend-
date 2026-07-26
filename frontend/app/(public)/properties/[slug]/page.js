"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Share2,
  Heart,
  Award,
  Building2,
  Calendar,
  ShieldCheck,
  Phone,
  Mail,
  ArrowUpRight,
  FileText,
  Sparkles,
  Tag,
  Eye,
  Check,
  Clock,
  Home,
  Compass,
  LayoutGrid
} from 'lucide-react';
import { Button, Input, Badge, Separator } from '@/components/ui';
import propertyService from '@/services/property.service';
import leadService from '@/services/lead.service';

// Official WhatsApp icon SVG component
const WhatsAppIcon = ({ size = 18, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Helper to ensure Cloudinary or external image URLs are loaded in high resolution
function getHighResUrl(url) {
  if (!url) return '';
  if (typeof url !== 'string') return '';
  if (url.includes('cloudinary.com') && url.includes('/upload/')) {
    return url.replace(/\/upload\/(?:w_\d+,?|h_\d+,?|c_[a-z]+,?|q_[a-z0-9]+,?)*\//i, '/upload/q_auto:best/');
  }
  return url;
}

// Helper to format official Algerian price cleanly
function formatAlgerianPrice(price, priceHidden) {
  if (priceHidden || !price || typeof price !== 'number') {
    return { main: 'Prix sur demande', sub: null };
  }
  const main = `${price.toLocaleString('fr-DZ')} DZD`;
  return { main, sub: null };
}

export default function PropertyDetailPage() {
  const params = useParams();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Gallery & Lightbox state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Reference for scrolling to contact form
  const contactSectionRef = useRef(null);
  const specsSectionRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: "Bonjour, je souhaite obtenir plus d'informations concernant ce bien d'exception.",
  });
  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProperty = useCallback(async (slug) => {
    try {
      const res = await propertyService.getBySlug(slug);
      if (res.data?.property) {
        setProperty(res.data.property);
      }
    } catch (err) {
      console.warn("Failed to fetch property:", err?.message || "Error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (params.slug) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProperty(params.slug);
    }
  }, [params.slug, fetchProperty]);

  const images = property?.media?.images || [];
  const hasImages = images.length > 0;
  
  const nextImage = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % (images.length || 1));
  }, [images.length]);

  const prevImage = useCallback((e) => {
    if (e) e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? (images.length || 1) - 1 : prev - 1));
  }, [images.length]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, nextImage, prevImage]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitContact = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    try {
      await leadService.create({
        ...formData,
        type: 'Property Inquiry',
        propertyId: property._id
      });
      setFormStatus({
        type: 'success',
        message: 'Votre message a été envoyé avec succès ! Un conseiller dédié vous contactera rapidement.'
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: "Bonjour, je souhaite obtenir plus d'informations concernant ce bien d'exception."
      });
    } catch (err) {
      setFormStatus({ 
        type: 'error', 
        message: err.response?.data?.message || "Une erreur est survenue lors de l'envoi du message." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50/80">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-600 border-t-transparent"></div>
          <p className="text-xs font-mono uppercase tracking-widest text-charcoal-500">Chargement de la propriété...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-warm-50/80 p-6">
        <div className="bg-white/80 backdrop-blur-2xl border border-charcoal-900/10 rounded-3xl p-10 max-w-md text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <h1 className="font-sans text-3xl font-extrabold text-charcoal-950 mb-3">Bien Introuvable</h1>
          <p className="text-charcoal-600 font-sans text-sm leading-relaxed mb-8">
            La propriété que vous recherchez n&apos;est plus disponible ou l&apos;adresse est incorrecte.
          </p>
          <Button variant="gold" className="w-full rounded-xl py-3 font-semibold" onClick={() => window.history.back()}>
            Retour au catalogue
          </Button>
        </div>
      </div>
    );
  }

  const { main: priceMain, sub: priceSub } = formatAlgerianPrice(property.price, property.priceHidden);

  return (
    <div className="bg-warm-50/70 min-h-screen pt-28 pb-24 text-charcoal-900">
      
      {/* ═══════════════════════════════════════════════════════════════
          FULLSCREEN HIGH-RESOLUTION LIGHTBOX MODAL (On Picture Click)
      ═══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isLightboxOpen && hasImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-charcoal-950/95 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Control Bar */}
            <div className="flex items-center justify-between z-10" onClick={(e) => e.stopPropagation()}>
              <div className="text-white">
                <span className="text-xs font-mono uppercase tracking-widest text-gold-400 block">Vue Plein Écran Haute Résolution</span>
                <h4 className="font-sans text-lg font-bold text-white/90 truncate max-w-lg">{property.title}</h4>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/15">
                  {currentImageIndex + 1} / {images.length}
                </span>
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/15 transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Center High-Quality Uncropped Photo */}
            <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="relative w-full h-full max-h-[75vh] flex items-center justify-center">
                <Image
                  src={getHighResUrl(images[currentImageIndex].url)}
                  alt={`${property.title} - Plein écran`}
                  fill
                  quality={100}
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-charcoal-900/60 hover:bg-charcoal-900/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all shadow-xl"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-charcoal-900/60 hover:bg-charcoal-900/90 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all shadow-xl"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Thumbnail Selector Strip */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-2 z-10" onClick={(e) => e.stopPropagation()}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      currentImageIndex === idx
                        ? 'border-gold-400 scale-105 shadow-md'
                        : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={getHighResUrl(img.url)}
                      alt={`Vignette ${idx + 1}`}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════════════
          MAIN PAGE CONTENT CONTAINER
      ═══════════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        
        {/* Breadcrumb & Quick Action Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-2 text-xs font-medium text-charcoal-500">
            <span>Catalogue</span>
            <span>•</span>
            <span className="text-charcoal-900 font-semibold">{property.location?.commune || 'Alger'}</span>
            <span>•</span>
            <span className="text-gold-700 font-mono">Réf. {property.reference}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/70 hover:bg-white/90 backdrop-blur-xl border border-charcoal-900/10 text-xs font-semibold text-charcoal-800 shadow-sm transition-all"
            >
              {isCopied ? <Check size={15} className="text-emerald-600" /> : <Share2 size={15} />}
              <span>{isCopied ? 'Lien copié !' : 'Partager le bien'}</span>
            </button>
          </div>
        </motion.div>

        {/* ═══════════════════════════════════════════════════════════════
            1. BESSA-INSPIRED TOP SECTION: SIDE-BY-SIDE HERO + GLASSMORPH BOARD
        ═══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch mb-14">
          
          {/* LEFT: HERO IMAGE CAROUSEL (7 cols on large screens) */}
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 flex flex-col justify-between rounded-[28px] overflow-hidden bg-white/70 backdrop-blur-2xl border border-charcoal-900/10 shadow-[0_12px_40px_rgba(0,0,0,0.06)] group"
          >
            {/* Main Hero Photo */}
            <div 
              onClick={() => hasImages && setIsLightboxOpen(true)}
              className="relative h-[45vh] min-h-[380px] lg:h-[500px] w-full cursor-pointer overflow-hidden bg-charcoal-900/5"
            >
              {hasImages ? (
                <>
                  <Image 
                    src={getHighResUrl(images[currentImageIndex].url)}
                    alt={property.title}
                    fill
                    quality={95}
                    sizes="100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    priority
                  />
                  
                  {/* Gradient bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/50 via-transparent to-charcoal-950/20 pointer-events-none"></div>

                  {/* Top Badge: Verified property */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-xl border border-charcoal-900/10 text-charcoal-950 font-mono text-xs font-bold shadow-md">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>BIEN VÉRIFIÉ</span>
                  </div>

                  {/* Click to Fullscreen / High-Res Zoom Badge */}
                  <div className="absolute top-4 right-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 hover:bg-white text-charcoal-950 font-sans font-semibold text-xs backdrop-blur-xl border border-charcoal-900/10 shadow-lg transition-all transform group-hover:scale-105">
                    <ZoomIn size={15} className="text-gold-600" />
                    <span className="hidden sm:inline">Plein Écran HD</span>
                  </div>

                  {/* Gallery Navigation Buttons */}
                  {images.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-charcoal-900 flex items-center justify-center backdrop-blur-xl border border-charcoal-900/10 shadow-md transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft size={22} />
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-charcoal-900 flex items-center justify-center backdrop-blur-xl border border-charcoal-900/10 shadow-md transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight size={22} />
                      </button>

                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xl text-charcoal-900 border border-charcoal-900/10 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold shadow-md flex items-center gap-2">
                        <Eye size={14} className="text-gold-600" />
                        <span>{currentImageIndex + 1} / {images.length}</span>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-charcoal-400 font-sans text-sm">
                  Aucune image disponible
                </div>
              )}
            </div>

            {/* Thumbnail Carousel Strip (Bessa Inspiration) */}
            {images.length > 1 && (
              <div className="p-3.5 bg-white/80 border-t border-charcoal-900/10 flex items-center gap-2.5 overflow-x-auto snap-x scrollbar-width-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-[72px] h-[48px] rounded-xl overflow-hidden border-2 transition-all shrink-0 snap-start ${
                      currentImageIndex === idx
                        ? 'border-gold-600 scale-105 shadow-sm ring-2 ring-gold-400/30'
                        : 'border-charcoal-900/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={getHighResUrl(img.url)}
                      alt={`Vignette ${idx + 1}`}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* RIGHT: SIGNATURE LA FORÊT COMMUNE MAP GLASSMORPHISM BOARD (5 cols on large screens) */}
          <motion.div 
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-5 relative rounded-[32px] md:rounded-[36px] bg-charcoal-900/80 backdrop-blur-3xl border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_25px_80px_-15px_rgba(0,0,0,0.85)] p-6 md:p-8 lg:p-9 text-white flex flex-col justify-between overflow-hidden"
          >
            {/* Subtle upper reflection highlight */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>

            {/* Subtle luxury glow accents */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold-500/15 rounded-full blur-[90px] pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none"></div>

            <div className="relative z-10 space-y-5">
              
              {/* Reference & Mandat Badge */}
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 font-mono text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={13} className="text-gold-400" />
                  <span>Mandat Exclusif</span>
                </span>
                <span className="text-xs font-mono font-medium text-white/60">
                  Réf. {property.reference}
                </span>
              </div>

              {/* Title & Location (Clear Readable Premium Fonts) */}
              <div>
                <h1 className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                  {property.title}
                </h1>
                <div className="flex items-center text-warm-200 text-sm md:text-base font-medium">
                  <MapPin className="text-gold-400 mr-2 shrink-0" size={17} />
                  <span>
                    {property.location?.commune}, Alger, Algérie
                  </span>
                </div>
              </div>

              {/* Verified Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-white/90 text-xs font-semibold">
                <CheckCircle2 size={15} className="text-gold-400" />
                <span>Bien officiel livré & vérifié par La Forêt</span>
              </div>

              <Separator className="bg-white/15" />

              {/* LUXURY GOLD PRICE DISPLAY (Algerian Valuation) */}
              <div className="py-1">
                <span className="text-xs font-mono uppercase tracking-widest text-gold-300 block mb-1">
                  Valorisation officielle
                </span>
                <div className="font-mono font-black text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-400 tracking-tight">
                  {priceMain}
                </div>
                {priceSub && (
                  <div className="mt-2 inline-block px-3 py-1 rounded-lg bg-white/10 border border-gold-400/30 text-gold-200 font-sans font-bold text-xs">
                    {priceSub}
                  </div>
                )}
              </div>

              {/* TWO PROMINENT BESSA-INSPIRED CTA BUTTONS */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => scrollToSection(specsSectionRef)}
                  className="w-full py-3.5 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-sans font-bold text-sm tracking-wide border border-white/25 transition-all text-center flex items-center justify-center gap-2"
                >
                  <FileText size={16} className="text-gold-400" />
                  <span>Voir les caractéristiques & prestations</span>
                </button>

                <button
                  onClick={() => scrollToSection(contactSectionRef)}
                  className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-charcoal-950 font-sans font-extrabold text-sm tracking-wide shadow-[0_10px_25px_rgba(217,119,6,0.3)] transition-all transform hover:scale-[1.01] text-center flex items-center justify-center gap-2"
                >
                  <Phone size={16} />
                  <span>Demander un entretien privé maintenant</span>
                </button>
              </div>

              {/* Direct mobile, whatsapp & email link row */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/80 pt-3 border-t border-white/10">
                <a href="tel:+213550198833" className="hover:text-gold-300 transition-colors flex items-center gap-1.5">
                  <Phone size={13} className="text-gold-400 shrink-0" />
                  <span>+213 550 19 88 33</span>
                </a>
                <span>•</span>
                <a 
                  href="https://wa.me/213550593707" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-medium"
                >
                  <WhatsAppIcon size={14} className="text-emerald-400 shrink-0" />
                  <span>WhatsApp</span>
                </a>
                <span>•</span>
                <a href="mailto:Belaid.laforet@gmail.com" className="hover:text-gold-300 transition-colors flex items-center gap-1.5">
                  <Mail size={13} className="text-gold-400 shrink-0" />
                  <span>Belaid.laforet@gmail.com</span>
                </a>
              </div>

            </div>
          </motion.div>

        </div>

        {/* ═══════════════════════════════════════════════════════════════
            2. CARACTÉRISTIQUES & PRESTATIONS (Bessa Simplex Cards + Checkmark Grid)
        ═══════════════════════════════════════════════════════════════ */}
        <div ref={specsSectionRef} className="mb-14 scroll-mt-32">
          
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-600 block mb-2">
              Spécifications Architecturales
            </span>
            <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-charcoal-950">
              Caractéristiques du bien :
            </h2>
          </div>

          {/* 4 Clean Simplex-Style Metric Cards (inspired by F3/F4/F5 Simplex cards in Bessa screenshot 2) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
            
            {/* Card 1: Surface */}
            <div className="bg-white/80 hover:bg-white backdrop-blur-2xl border border-charcoal-900/10 rounded-2xl p-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
              <span className="text-xs font-mono font-semibold uppercase text-charcoal-500 block mb-2">
                Surface Habitable
              </span>
              <div className="font-mono font-extrabold text-2xl md:text-3xl text-gold-700">
                {property.area} m²
              </div>
              <span className="text-[11px] font-medium text-charcoal-400 block mt-2">
                Mesure certifiée
              </span>
            </div>

            {/* Card 2: Chambres */}
            <div className="bg-white/80 hover:bg-white backdrop-blur-2xl border border-charcoal-900/10 rounded-2xl p-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
              <span className="text-xs font-mono font-semibold uppercase text-charcoal-500 block mb-2">
                Chambres
              </span>
              <div className="font-sans font-extrabold text-2xl md:text-3xl text-charcoal-950">
                {property.bedrooms || '-'}
              </div>
              <span className="text-[11px] font-medium text-charcoal-400 block mt-2">
                Suites & pièces
              </span>
            </div>

            {/* Card 3: Salles de bain */}
            <div className="bg-white/80 hover:bg-white backdrop-blur-2xl border border-charcoal-900/10 rounded-2xl p-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
              <span className="text-xs font-mono font-semibold uppercase text-charcoal-500 block mb-2">
                Salles de bain
              </span>
              <div className="font-sans font-extrabold text-2xl md:text-3xl text-charcoal-950">
                {property.bathrooms || '-'}
              </div>
              <span className="text-[11px] font-medium text-charcoal-400 block mt-2">
                Équipées & modernes
              </span>
            </div>

            {/* Card 4: Type & Statut */}
            <div className="bg-white/80 hover:bg-white backdrop-blur-2xl border border-charcoal-900/10 rounded-2xl p-6 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all">
              <span className="text-xs font-mono font-semibold uppercase text-charcoal-500 block mb-2">
                Catégorie
              </span>
              <div className="font-sans font-extrabold text-2xl md:text-3xl text-charcoal-950">
                {property.category}
              </div>
              <span className="text-[11px] font-bold text-emerald-600 block mt-2">
                ✔ Disponible
              </span>
            </div>

          </div>

          {/* Bessa-Inspired Clean Checkmark Grid for Features */}
          {property.features && property.features.length > 0 && (
            <div className="bg-white/70 backdrop-blur-2xl border border-charcoal-900/10 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
              <h3 className="font-sans text-lg font-bold text-charcoal-950 mb-6 pb-3 border-b border-charcoal-900/10 flex items-center gap-2">
                <CheckCircle2 className="text-gold-600" size={19} />
                <span>Prestations incluses & équipements du bien :</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                {property.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-charcoal-900 font-sans text-sm md:text-base font-semibold">
                    <span className="text-gold-600 font-bold">✔</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ═══════════════════════════════════════════════════════════════
            3. A PROPOS DU BIEN (Clear Readable Premium Typography)
        ═══════════════════════════════════════════════════════════════ */}
        <div className="bg-white/70 hover:bg-white/85 backdrop-blur-2xl border border-charcoal-900/10 rounded-3xl p-6 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] mb-14">
          <h2 className="font-sans text-2xl font-extrabold text-charcoal-950 mb-6 flex items-center gap-2.5">
            <Award className="text-gold-600" size={22} />
            <span>À propos du bien</span>
          </h2>
          <div className="prose prose-warm max-w-none text-charcoal-800 font-sans text-base md:text-lg leading-relaxed whitespace-pre-line">
            {property.description}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            4. GALERIE PHOTOS COMPLÈTE (inspired by 'Avancement des travaux')
        ═══════════════════════════════════════════════════════════════ */}
        {images.length > 1 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-gold-600 block mb-1">
                  Visite Visuelle
                </span>
                <h2 className="font-sans text-2xl md:text-3xl font-extrabold text-charcoal-950">
                  Galerie photos ({images.length})
                </h2>
              </div>
              <span className="text-xs font-mono text-charcoal-500 hidden sm:block">
                Cliquer sur une photo pour zoom HD
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setCurrentImageIndex(idx);
                    setIsLightboxOpen(true);
                  }}
                  className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer bg-charcoal-900/10 border border-charcoal-900/10 shadow-sm hover:shadow-xl transition-all"
                >
                  <Image
                    src={getHighResUrl(img.url)}
                    alt={`Photo ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-charcoal-950/0 group-hover:bg-charcoal-950/20 transition-colors flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-white/90 text-charcoal-950 flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                      <ZoomIn size={18} className="text-gold-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            5. SOLLICITER UN ENTRETIEN & VISITE PRIVÉE (Contact Section)
        ═══════════════════════════════════════════════════════════════ */}
        <div ref={contactSectionRef} className="scroll-mt-24">
          <div className="relative rounded-[32px] md:rounded-[36px] bg-charcoal-900/80 backdrop-blur-3xl border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_25px_80px_-15px_rgba(0,0,0,0.85)] p-6 md:p-12 text-white overflow-hidden">
            
            {/* Upper highlight line */}
            <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-gold-300 font-mono text-xs font-bold uppercase tracking-wider">
                  <Sparkles size={13} className="text-gold-400" />
                  <span>Entretien Confidentiel</span>
                </span>
                <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  Intéressé par <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-amber-400">ce bien d&apos;exception ?</span>
                </h2>
                <p className="text-warm-200 text-sm md:text-base font-light leading-relaxed">
                  Sollicitez un entretien personnalisé ou organisez une visite privée avec notre direction. Notre équipe vous accompagne à chaque étape en toute confidentialité.
                </p>

                <div className="pt-4 space-y-3.5 text-sm">
                  <a href="tel:+213550198833" className="flex items-center gap-3 text-white/90 hover:text-gold-400 transition-colors">
                    <Phone size={17} className="text-gold-400 shrink-0" />
                    <span className="font-bold">+213 550 19 88 33</span>
                  </a>
                  <a 
                    href="https://wa.me/213550593707" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 text-white/90 hover:text-emerald-400 transition-colors"
                  >
                    <WhatsAppIcon size={18} className="text-emerald-400 shrink-0" />
                    <span className="font-bold">WhatsApp : +213 550 59 37 07</span>
                  </a>
                  <a href="mailto:Belaid.laforet@gmail.com" className="flex items-center gap-3 text-white/90 hover:text-gold-400 transition-colors">
                    <Mail size={17} className="text-gold-400 shrink-0" />
                    <span>Belaid.laforet@gmail.com</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white/10 backdrop-blur-2xl border border-white/15 rounded-2xl p-6 md:p-8">
                {formStatus.message && (
                  <div className={`p-4 rounded-xl mb-6 text-xs font-medium ${
                    formStatus.type === 'success'
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/40' 
                      : 'bg-red-500/20 text-red-200 border border-red-400/40'
                  }`}>
                    {formStatus.message}
                  </div>
                )}

                <form onSubmit={handleSubmitContact} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase font-semibold text-white/70 mb-1.5">
                        Nom & Prénom
                      </label>
                      <Input 
                        type="text" 
                        name="name" 
                        placeholder="Votre nom complet" 
                        required 
                        value={formData.name} 
                        onChange={handleFormChange}
                        className="w-full bg-white/15 border-white/20 focus:border-gold-400 text-white placeholder-white/50 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase font-semibold text-white/70 mb-1.5">
                        Téléphone mobile
                      </label>
                      <Input 
                        type="tel" 
                        name="phone" 
                        placeholder="+213 ..." 
                        required 
                        value={formData.phone} 
                        onChange={handleFormChange}
                        className="w-full bg-white/15 border-white/20 focus:border-gold-400 text-white placeholder-white/50 rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase font-semibold text-white/70 mb-1.5">
                      Email professionnel
                    </label>
                    <Input 
                      type="email" 
                      name="email" 
                      placeholder="votre.email@domaine.com" 
                      required 
                      value={formData.email} 
                      onChange={handleFormChange}
                      className="w-full bg-white/15 border-white/20 focus:border-gold-400 text-white placeholder-white/50 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase font-semibold text-white/70 mb-1.5">
                      Votre Message
                    </label>
                    <textarea 
                      name="message" 
                      value={formData.message} 
                      onChange={handleFormChange} 
                      required 
                      rows={3} 
                      className="w-full px-4 py-3 border border-white/20 rounded-xl shadow-sm focus:ring-gold-400 focus:border-gold-400 bg-white/15 text-white placeholder-white/50 text-sm" 
                      placeholder="Précisez votre demande..."
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 hover:from-gold-400 hover:to-amber-400 text-charcoal-950 font-sans font-extrabold text-sm tracking-wide shadow-lg transition-all transform hover:scale-[1.01]" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi confidentiel...' : "Transmettre ma demande"}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


