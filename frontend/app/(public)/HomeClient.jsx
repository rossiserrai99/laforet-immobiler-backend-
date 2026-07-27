"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Input, Textarea, Logo } from '@/components/ui';
import { PropertyCard } from '@/components/property/PropertyCard';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Star, Shield, Award, Diamond, Key, Landmark, Building2, BadgeCheck, Gem, Phone, Mail, MessageSquare, Send, CheckCircle2, MapPin, ExternalLink } from 'lucide-react';
import leadService from '@/services/lead.service';
import { InteractiveAlgiersMap } from '@/components/map/InteractiveAlgiersMap';
import { AgencyLocationMap } from '@/components/map/AgencyLocationMap';

gsap.registerPlugin(ScrollTrigger);

// Prevent Android address bar resize jank & ensure native hardware GPU scroll momentum
if (typeof window !== 'undefined') {
  ScrollTrigger.config({
    ignoreMobileResize: true,
  });
}

export function HomeClient({ featuredProperties, featuredApartments = [], allProperties = [] }) {
  const container = useRef();
  
  useGSAP(() => {
    // Hero Animations
    const tl = gsap.timeline();
    tl.from('.hero-text-anim', {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power4.out',
      delay: 0.2,
      clearProps: 'transform'
    })
    .from('.hero-btn-anim', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      clearProps: 'transform'
    }, "-=0.4");

    // Scroll Reveal for Sections
    const sections = gsap.utils.toArray('.reveal-section');
    sections.forEach(section => {
      gsap.fromTo(section,
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: section,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          clearProps: 'transform'
        }
      );
    });

    // Stagger Property Cards
    gsap.fromTo('.property-card-anim',
      { y: 40, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '.properties-grid',
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'transform'
      }
    );

    // Stagger Service Cards quickly without delays so they are always visible
    gsap.fromTo('.service-card-anim',
      { y: 25, opacity: 0 },
      {
        scrollTrigger: {
          trigger: '#services',
          start: 'top 98%',
          toggleActions: 'play none none none',
        },
        y: 0,
        opacity: 1,
        duration: 0.45,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'opacity,transform'
      }
    );
  }, { scope: container });

  return (
    <div ref={container}>
      {/* HERO SECTION */}
      <section className="relative h-[65vh] sm:h-[75vh] md:h-[85vh] min-h-[420px] sm:min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 bg-charcoal-900 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="https://res.cloudinary.com/zt28qj9l/video/upload/v1784947742/Video_Project_5_nkmuyt.jpg"
            suppressHydrationWarning
            className="absolute inset-0 w-full h-full object-cover scale-105"
          >
            <source src="https://res.cloudinary.com/zt28qj9l/video/upload/v1784947742/Video_Project_5_nkmuyt.mp4" type="video/mp4" />
          </video>
          {/* Lighter Overlays for Text Pop without darkening the entire video */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(24,24,27,0.3)_0%,_transparent_60%)] z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/30 via-transparent to-charcoal-900/80 z-10"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-3 sm:px-4 max-w-5xl mx-auto mt-10 sm:mt-16 pb-10 sm:pb-16">
          <div className="hero-text-anim overflow-hidden px-2 sm:px-4 py-4 sm:py-6">
            <h1 className="font-serif font-semibold text-white mb-6 sm:mb-8 drop-shadow-2xl flex flex-col items-center">
              <span className="text-[26px] xs:text-[28px] sm:text-5xl md:text-6xl lg:text-7xl tracking-tight whitespace-nowrap text-white/95 leading-tight">
                L&apos;Excellence <span className="text-gold-400 font-serif italic font-bold drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]">Immobilière</span>
              </span>
              <span className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-serif text-white/90 mt-1 sm:mt-2 text-center tracking-wide font-normal">
                en Algérie
              </span>
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="hero-btn-anim">
              <Button variant="gold" size="lg" className="shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-shadow" asChild>
                <Link href="/properties">Explorer les biens</Link>
              </Button>
            </div>
            <div className="hero-btn-anim hidden sm:block">
              <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-md text-white border-white/50 hover:bg-white hover:text-charcoal-900 transition-all" asChild>
                <Link href="/estimation">Estimer mon bien</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* GLASS MORPH TRUST PANEL (Scrolling Marquee) */}
        <div className="absolute bottom-0 left-0 w-full bg-charcoal-900/30 backdrop-blur-md border-t border-white/20 overflow-hidden py-4 flex items-center z-30">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 30s linear infinite;
              display: flex;
              width: max-content;
            }
          `}} />
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-charcoal-900/50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-charcoal-900/50 to-transparent z-10 pointer-events-none"></div>
          
          <div className="animate-marquee gap-16 md:gap-32 px-8 items-center text-white/90 font-sans tracking-[0.2em] uppercase text-xs md:text-sm whitespace-nowrap font-medium">
            {/* First set */}
            <div className="flex items-center gap-3"><BadgeCheck size={16} className="text-gold-400" /> Discrétion Absolue</div>
            <div className="flex items-center gap-3"><Diamond size={16} className="text-gold-400" /> Propriétés Exclusives</div>
            <div className="flex items-center gap-3"><Key size={16} className="text-gold-400" /> Service Sur-Mesure</div>
            <div className="flex items-center gap-3"><Landmark size={16} className="text-gold-400" /> Réseau International</div>
            <div className="flex items-center gap-3"><Building2 size={16} className="text-gold-400" /> Expertise Locale</div>
            <div className="flex items-center gap-3"><Gem size={16} className="text-gold-400" /> Accompagnement Premium</div>
            {/* Duplicate set for infinite scroll */}
            <div className="flex items-center gap-3"><BadgeCheck size={16} className="text-gold-400" /> Discrétion Absolue</div>
            <div className="flex items-center gap-3"><Diamond size={16} className="text-gold-400" /> Propriétés Exclusives</div>
            <div className="flex items-center gap-3"><Key size={16} className="text-gold-400" /> Service Sur-Mesure</div>
            <div className="flex items-center gap-3"><Landmark size={16} className="text-gold-400" /> Réseau International</div>
            <div className="flex items-center gap-3"><Building2 size={16} className="text-gold-400" /> Expertise Locale</div>
            <div className="flex items-center gap-3"><Gem size={16} className="text-gold-400" /> Accompagnement Premium</div>
          </div>
        </div>
      </section>

      {/* QUICK LINKS GRID (2x2 on Mobile, Flex on Desktop) */}
      <section className="w-full grid grid-cols-2 md:flex md:flex-row h-auto md:h-[500px] lg:h-[600px]">
        {/* Acheter */}
        <Link href="/properties?type=Vente" className="relative flex-1 group overflow-hidden aspect-square md:aspect-auto md:min-h-0">
          <Image 
            src="/luxury_house_buy.png" 
            alt="Acheter un bien"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-white/30 group-hover:bg-white/10 transition-colors duration-500"></div>
          <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 z-10 drop-shadow-md">
            <h3 className="text-white font-sans text-2xl sm:text-3xl md:text-4xl font-bold leading-none mb-1 group-hover:-translate-y-2 transition-transform duration-500">Acheter</h3>
            <p className="text-white/90 font-sans text-lg sm:text-xl md:text-2xl font-light group-hover:-translate-y-2 transition-transform duration-500 delay-75">un bien</p>
          </div>
        </Link>
        
        {/* Louer */}
        <Link href="/properties?type=Location" className="relative flex-1 group overflow-hidden aspect-square md:aspect-auto md:min-h-0">
          <Image 
            src="https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
            alt="Louer un bien"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-white/30 group-hover:bg-white/10 transition-colors duration-500"></div>
          <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 z-10 drop-shadow-md">
            <h3 className="text-white font-sans text-2xl sm:text-3xl md:text-4xl font-bold leading-none mb-1 group-hover:-translate-y-2 transition-transform duration-500">Louer</h3>
            <p className="text-white/90 font-sans text-lg sm:text-xl md:text-2xl font-light group-hover:-translate-y-2 transition-transform duration-500 delay-75">un bien</p>
          </div>
        </Link>

        {/* Vendre */}
        <Link href="/estimation" className="relative flex-1 group overflow-hidden aspect-square md:aspect-auto md:min-h-0">
          <Image 
            src="https://res.cloudinary.com/zt28qj9l/image/upload/v1784965315/stock-photo-real-estate-agent-insurance-sales-representative-young-asian-businessman-handing_qyjsni.webp" 
            alt="Vendre avec nous"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-white/30 group-hover:bg-white/10 transition-colors duration-500"></div>
          <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 z-10 drop-shadow-md">
            <h3 className="text-white font-sans text-2xl sm:text-3xl md:text-4xl font-bold leading-none mb-1 group-hover:-translate-y-2 transition-transform duration-500">Vendre</h3>
            <p className="text-white/90 font-sans text-lg sm:text-xl md:text-2xl font-light group-hover:-translate-y-2 transition-transform duration-500 delay-75">avec nous</p>
          </div>
        </Link>

        {/* Mettre en location */}
        <Link href="/#contact" className="relative flex-1 group overflow-hidden aspect-square md:aspect-auto md:min-h-0">
          <Image 
            src="https://res.cloudinary.com/zt28qj9l/image/upload/v1784965809/make_picture_high_definition_res__202607250849_msbqp4.jpg" 
            alt="Mettre en location"
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-white/30 group-hover:bg-white/10 transition-colors duration-500"></div>
          <div className="absolute bottom-4 left-4 md:bottom-10 md:left-10 z-10 drop-shadow-md">
            <h3 className="text-white font-sans text-2xl sm:text-3xl md:text-4xl font-bold leading-none mb-1 group-hover:-translate-y-2 transition-transform duration-500">Mettre</h3>
            <p className="text-white/90 font-sans text-lg sm:text-xl md:text-2xl font-light group-hover:-translate-y-2 transition-transform duration-500 delay-75">en location</p>
          </div>
        </Link>
      </section>

      {/* INTERACTIVE ALGIERS MAP SECTION */}
      <InteractiveAlgiersMap allProperties={allProperties} />

      {/* FEATURED PROPERTIES SECTION */}
      <section className="py-24 relative overflow-hidden bg-white">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-warm-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 reveal-section">
            <div className="max-w-2xl">
              <p className="text-gold-600 font-medium tracking-wider text-sm uppercase mb-3">Sélection Exclusive</p>
              <h2 className="font-sans text-5xl md:text-6xl font-extrabold tracking-tight text-charcoal-900 mb-4">Propriétés d&apos;Exception</h2>
              <p className="text-charcoal-600 text-lg">Parcourez notre dernière collection de résidences prestigieuses, disponibles à la vente et à la location.</p>
            </div>
            <Link href="/properties" className="hidden md:inline-flex relative group items-center justify-center px-8 py-4 bg-gold-400 text-charcoal-900 font-bold rounded-full overflow-hidden shadow-lg shadow-gold-900/20 hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.6)] hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="relative flex items-center z-10">
                Voir le catalogue complet <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
            </Link>
          </div>

          <div className="properties-grid grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {featuredProperties.length > 0 ? (
              featuredProperties.map(prop => (
                <div key={prop._id} className="property-card-anim">
                  <PropertyCard property={prop} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-warm-50/50 backdrop-blur-lg rounded-2xl border border-warm-200">
                <p className="text-charcoal-500 font-medium">Aucune propriété disponible pour le moment.</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center reveal-section flex justify-center">
            <Link href="/properties" className="flex relative group items-center justify-center w-full md:w-auto md:px-12 py-4 bg-gold-400 text-charcoal-900 font-bold rounded-full overflow-hidden shadow-lg shadow-gold-900/20 hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.6)] hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="relative flex items-center z-10">
                Voir tout le catalogue <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED APARTMENTS SECTION */}
      <section className="py-24 relative overflow-hidden bg-white">
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 reveal-section">
            <div className="max-w-2xl">
              <p className="text-forest-600 font-medium tracking-wider text-sm uppercase mb-3">Vie Citadine</p>
              <h2 className="font-sans text-5xl md:text-6xl font-extrabold tracking-tight text-charcoal-900 mb-4">Appartements sur Alger</h2>
              <p className="text-charcoal-600 text-lg">Découvrez nos plus beaux appartements, alliant design contemporain, vues imprenables et finitions haut de gamme au cœur de la ville.</p>
            </div>
            <Link href="/properties?type=Appartement" className="hidden md:inline-flex relative group items-center justify-center px-8 py-4 bg-gold-400 text-charcoal-900 font-bold rounded-full overflow-hidden shadow-lg shadow-gold-900/20 hover:shadow-[0_0_30px_-5px_rgba(212,175,55,0.6)] hover:-translate-y-1 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <span className="relative flex items-center z-10">
                Voir tous les appartements <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </span>
            </Link>
          </div>

          <div className="properties-grid grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {featuredApartments.length > 0 ? (
              featuredApartments.map(prop => (
                <div key={prop._id} className="property-card-anim">
                  {/* We use a wrapper here to ensure the PropertyCard looks good on dark backgrounds if it wasn't designed for it, but PropertyCard is usually robust. We can just render it. */}
                  <PropertyCard property={prop} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-warm-50 rounded-2xl border border-warm-200">
                <p className="text-charcoal-600 font-medium">Aucun appartement disponible pour le moment.</p>
              </div>
            )}
          </div>

          <div className="mt-12 text-center md:hidden reveal-section">
            <Button variant="gold" className="w-full shadow-lg shadow-gold-900/20" asChild>
              <Link href="/properties?type=Appartement">Voir tous les appartements</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ABOUT / PHILOSOPHY SECTION (Liquid Glass & Interactive Headquarters Map) */}
      <section id="agence" className="relative py-24 md:py-32 overflow-hidden bg-warm-50 border-t border-warm-200">
        <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20 relative z-10">
          
          {/* Left Side: Professional Interactive Agency Location Map (Boulevard 5, Alger) */}
          <div className="w-full lg:w-[55%] reveal-section px-4 lg:px-0 lg:pl-6">
            <AgencyLocationMap />
          </div>
          
          {/* Right Side: Philosophy & 24 Years of Experience Copy */}
          <div className="w-full lg:w-[45%] reveal-section px-6 lg:px-0 lg:pr-12 xl:pr-24">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 text-gold-700 font-mono text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-gold-300/80 bg-gold-50 mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"></span>
                <span>Notre Philosophie • Depuis 2002</span>
              </div>
              
              {/* Premium Framed Logo Showcase replacing title */}
              <div className="mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-warm-50 via-white to-warm-100/70 border border-warm-200/80 shadow-[0_10px_35px_rgba(0,0,0,0.05)] flex items-center justify-start relative overflow-hidden group hover:border-gold-400/80 transition-all duration-500">
                <div className="absolute top-0 right-0 w-36 h-36 bg-gold-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-gold-400/15 transition-all"></div>
                <Logo variant="default" className="w-full max-w-[340px] sm:max-w-[400px] h-auto object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-[1.02]" />
              </div>

              {/* High-Contrast Editorial Typography for Professional Appeal & Readability */}
              <div className="space-y-6 text-charcoal-900 font-sans mb-8">
                <p className="text-lg sm:text-xl font-medium leading-relaxed text-charcoal-900 border-l-4 border-gold-500 pl-5 py-1">
                  Fondée en <strong className="font-bold text-forest-700">2002</strong>, l&apos;Agence <strong className="font-bold text-charcoal-950">LA FORÊT</strong> célèbre <strong className="font-bold text-forest-700">24 années d&apos;expérience et d&apos;excellence</strong> sur le marché immobilier de prestige algérois. Depuis près d&apos;un quart de siècle, nous concevons notre métier comme une alliance de rigueur technique et de discrétion absolue.
                </p>
                <p className="text-base sm:text-lg font-normal leading-relaxed text-charcoal-700">
                  Notre ancrage au cœur d&apos;Alger nous confère une connaissance intime des adresses les plus cotées de la capitale (<strong className="font-semibold text-charcoal-900">Hydra, El Biar, Ben Aknoun</strong> et le littoral ouest), pour vous offrir un accompagnement sur-mesure digne de vos ambitions.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-warm-200/80 shadow-sm hover:border-gold-400 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="text-gold-500 shrink-0" size={26} />
                    <h4 className="font-serif font-bold text-charcoal-900 text-xl">24 Ans</h4>
                  </div>
                  <p className="text-xs text-charcoal-600 font-medium leading-relaxed">D&apos;expertise ininterrompue sur le marché algérois depuis 2002.</p>
                </div>
                <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-warm-200/80 shadow-sm hover:border-gold-400 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="text-gold-500 shrink-0" size={26} />
                    <h4 className="font-serif font-bold text-charcoal-900 text-xl">Discrétion</h4>
                  </div>
                  <p className="text-xs text-charcoal-600 font-medium leading-relaxed">Confidentialité irréprochable pour chaque acquisition de prestige.</p>
                </div>
              </div>
              
              <Button variant="outline" className="group rounded-full px-8 py-6 border-charcoal-300 hover:border-gold-500 font-semibold text-charcoal-900" asChild>
                <Link href="/#agence">
                  Découvrir l&apos;agence 
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform text-gold-600" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-16 md:py-28 relative bg-charcoal-950 text-white overflow-hidden">
        {/* High-Quality Fixed Parallax Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-fixed bg-cover bg-center"
          style={{ backgroundImage: `url('https://res.cloudinary.com/zt28qj9l/image/upload/v1785037176/recreate_picture_high_quality_de__202607260438_tmgxak.jpg')` }}
        >
          {/* Professional multi-stop luxury dark overlay to showcase the high-quality picture while ensuring crisp typography */}
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-950/85 via-charcoal-950/60 to-charcoal-950/90"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold-500/15 via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-20 reveal-section">
            <p className="text-gold-400 font-medium tracking-wider text-xs sm:text-sm uppercase mb-2 sm:mb-3">Notre Expertise</p>
            <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 drop-shadow-md">Un accompagnement sur-mesure</h2>
            <div className="w-16 sm:w-20 h-1 bg-gold-500 mx-auto mb-4 sm:mb-6"></div>
            <p className="text-warm-300 text-sm sm:text-lg">
              LA FORÊT met à votre disposition son savoir-faire et son réseau exclusif pour concrétiser vos projets immobiliers avec discrétion et professionnalisme.
            </p>
          </div>

          {/* 2 cards in one horizontal line on mobile (grid-cols-2), 3rd card right under them (col-span-2 on mobile, col-span-1 on desktop) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {/* Card 1: Achat & Vente */}
            <div className="service-card-anim bg-charcoal-950/80 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:bg-charcoal-950/90 hover:border-gold-400/40 transition-all duration-500 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-4 sm:mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-serif text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4">Achat & Vente</h3>
              <p className="text-warm-200 leading-relaxed font-light text-xs sm:text-sm md:text-base">
                Des biens d&apos;exception rigoureusement sélectionnés. Nous vous accompagnons de la recherche jusqu&apos;à la signature finale avec un service conciergerie.
              </p>
            </div>

            {/* Card 2: Estimation Offerte */}
            <div className="service-card-anim bg-charcoal-950/80 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:bg-charcoal-950/90 hover:border-gold-400/40 transition-all duration-500 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-forest-400 to-forest-600 flex items-center justify-center mb-4 sm:mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4">Estimation Offerte</h3>
              <p className="text-warm-200 leading-relaxed font-light text-xs sm:text-sm md:text-base">
                Une évaluation précise, confidentielle et gratuite de votre bien, basée sur notre parfaite connaissance du marché immobilier premium.
              </p>
            </div>

            {/* Card 3: Location Prestige (col-span-2 on mobile so it sits right under Cards 1 and 2, col-span-1 on desktop) */}
            <div className="service-card-anim col-span-2 md:col-span-1 bg-charcoal-950/80 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.6)] hover:bg-charcoal-950/90 hover:border-gold-400/40 transition-all duration-500 group">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-warm-400 to-warm-600 flex items-center justify-center mb-4 sm:mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <h3 className="font-serif text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4">Location Prestige</h3>
              <p className="text-warm-200 leading-relaxed font-light text-xs sm:text-sm md:text-base">
                Un service dédié aux locataires exigeants et aux propriétaires souhaitant louer leur bien exceptionnel en toute sérénité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT US / DIRECT TO ADMIN SECTION */}
      <ContactUsSection />
    </div>
  );
}

function ContactUsSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await leadService.create({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        type: 'Contact',
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Lead submission error:', err);
      alert("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative bg-warm-50 overflow-hidden">
      {/* Decorative subtle background glows */}
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -left-32 w-96 h-96 bg-forest-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Title above the section */}
        <div className="text-center max-w-3xl mx-auto mb-12 reveal-section">
          <span className="inline-block text-gold-700 font-mono text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border border-gold-300/80 bg-gold-100/60 mb-4 shadow-sm">
            Restons en Contact
          </span>
          <h2 className="font-sans text-3xl md:text-5xl font-extrabold tracking-tight text-charcoal-950 mb-4">
            Une Direction à Votre <span className="text-gold-600 font-bold">Écoute</span>
          </h2>
          <p className="text-charcoal-600 font-sans text-base md:text-lg leading-relaxed font-normal">
            Nos conseillers et la direction générale vous reçoivent à notre agence ou répondent directement à vos requêtes confidentielles.
          </p>
        </div>

        {/* Light Dark Tinted Glassmorph Board (Exactly like the Map Section) */}
        <div className="relative rounded-[24px] sm:rounded-[32px] md:rounded-[36px] bg-charcoal-900/70 backdrop-blur-3xl border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_25px_80px_-15px_rgba(0,0,0,0.85)] p-4 sm:p-8 md:p-14 text-white reveal-section transition-all duration-500">
          
          {/* Subtle upper reflection highlight */}
          <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start relative z-10">
            
            {/* Left Column: Direct VIP Channels & Address (2 in one horizontal line on mobile) */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-6">
              <div>
                <h3 className="font-sans text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white mb-1.5 sm:mb-2">
                  Coordonnées Directes
                </h3>
                <p className="text-warm-300 font-sans text-xs sm:text-sm md:text-base leading-relaxed">
                  Des canaux de contact officiels pour un échange rapide et discret.
                </p>
              </div>

              {/* 2 contact icons in one horizontal line on mobile (grid-cols-2) */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 pt-1 sm:pt-2">
                {/* Official WhatsApp VIP Card */}
                <a
                  href="https://wa.me/213550593707"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-5 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-lg hover:bg-white/10 hover:border-[#25D366]/50 transition-all duration-300 group gap-2 sm:gap-0"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#25D366]/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      {/* Official WhatsApp SVG Logo (Bubble + Handset) */}
                      <svg className="w-5 h-5 sm:w-7 sm:h-7 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-xs uppercase tracking-wider text-warm-300 font-semibold">WhatsApp</div>
                      <div className="font-sans font-bold text-white text-xs sm:text-base md:text-lg mt-0.5">+213 550 59 37 07</div>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#25D366] group-hover:translate-x-1 transition-transform hidden sm:block" />
                </a>

                {/* Official Phone Card */}
                <a
                  href="tel:+213550198833"
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-5 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-lg hover:bg-white/10 hover:border-[#0A84FF]/50 transition-all duration-300 group gap-2 sm:gap-0"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0A84FF]/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      {/* Official Phone Handset SVG Icon */}
                      <svg className="w-5 h-5 sm:w-7 sm:h-7 text-[#0A84FF]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-xs uppercase tracking-wider text-warm-300 font-semibold">Téléphone</div>
                      <div className="font-sans font-bold text-white text-xs sm:text-base md:text-lg mt-0.5">+213 550 19 88 33</div>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#0A84FF] group-hover:translate-x-1 transition-transform hidden sm:block" />
                </a>

                {/* Official Gmail Card */}
                <a
                  href="mailto:Belaid.laforet@gmail.com"
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-5 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-lg hover:bg-white/10 hover:border-[#EA4335]/50 transition-all duration-300 group gap-2 sm:gap-0"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#EA4335]/20 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                      {/* Official Gmail SVG Icon */}
                      <svg className="w-5 h-5 sm:w-7 sm:h-7 text-[#EA4335]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-xs uppercase tracking-wider text-warm-300 font-semibold">Gmail</div>
                      <div className="font-sans font-medium text-white text-[11px] sm:text-base mt-0.5 break-all sm:break-normal">Belaid.laforet@gmail.com</div>
                    </div>
                  </div>
                  <ArrowRight size={18} className="text-[#EA4335] group-hover:translate-x-1 transition-transform hidden sm:block" />
                </a>

                {/* Official Address / Siege Card */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 sm:p-5 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-lg gap-2 sm:gap-0">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#D93025]/20 flex items-center justify-center shrink-0">
                      {/* Official Location Pin SVG Icon */}
                      <svg className="w-5 h-5 sm:w-7 sm:h-7 text-[#D93025]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-xs uppercase tracking-wider text-warm-300 font-semibold">Siège & Réception</div>
                      <div className="font-sans font-medium text-white text-xs sm:text-base mt-0.5">Boulevard 5, Alger</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Private Admin Dashboard Form (Wider inputs & spacious textarea on mobile) */}
            <div className="lg:col-span-7 w-full">
              <div className="bg-white/5 backdrop-blur-2xl rounded-2xl sm:rounded-[2rem] p-4 sm:p-8 md:p-10 border border-white/10 shadow-2xl text-white w-full">
                <h3 className="text-xl sm:text-2xl font-sans font-extrabold tracking-tight text-white mb-1.5 sm:mb-2">
                  Envoyer un Message Confidentiel
                </h3>
                <p className="text-warm-300 font-sans text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
                  Votre message est transmis instantanément au tableau de bord de la direction générale.
                </p>

                {submitted ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 size={32} />
                    </div>
                    <h4 className="text-2xl font-sans font-extrabold tracking-tight text-white">Message Transmis avec Succès</h4>
                    <p className="text-warm-300 font-sans text-sm max-w-md mx-auto leading-relaxed">
                      La direction a bien reçu votre demande et étudiera votre dossier avec la plus grande attention.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 rounded-full border-white/20 text-white hover:bg-white/10 font-semibold"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', phone: '', message: '' });
                      }}
                    >
                      Envoyer un autre message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full">
                      <div className="w-full">
                        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-warm-300 mb-1.5 sm:mb-2">Nom & Prénom</label>
                        <Input
                          required
                          placeholder="M. Karim Benali"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white/5 border-white/15 text-white placeholder:text-white/40 rounded-xl focus:border-gold-400 focus:bg-white/10 font-sans"
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-warm-300 mb-1.5 sm:mb-2">Email Professionnel</label>
                        <Input
                          required
                          type="email"
                          placeholder="karim@domaine.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white/5 border-white/15 text-white placeholder:text-white/40 rounded-xl focus:border-gold-400 focus:bg-white/10 font-sans"
                        />
                      </div>
                    </div>

                    <div className="w-full">
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-warm-300 mb-1.5 sm:mb-2">Téléphone / WhatsApp</label>
                      <Input
                        required
                        placeholder="+213 (0) 555..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/5 border-white/15 text-white placeholder:text-white/40 rounded-xl focus:border-gold-400 focus:bg-white/10 font-sans"
                      />
                    </div>

                    <div className="w-full">
                      <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-warm-300 mb-1.5 sm:mb-2">Votre Message Confidentiel</label>
                      <Textarea
                        required
                        rows={4}
                        placeholder="Décrivez votre projet d'acquisition, de vente ou vos critères de recherche..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full min-h-[140px] sm:min-h-[160px] bg-white/5 border-white/15 text-white placeholder:text-white/40 rounded-xl focus:border-gold-400 focus:bg-white/10 font-sans resize-none"
                      />
                    </div>

                    <div className="pt-2 w-full">
                      <Button
                        type="submit"
                        disabled={loading}
                        variant="gold"
                        className="w-full rounded-full py-4 text-base font-semibold shadow-lg flex items-center justify-center gap-2"
                      >
                        <span>{loading ? "Transmission en cours..." : "Transmettre à la Direction"}</span>
                        <Send size={18} />
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
