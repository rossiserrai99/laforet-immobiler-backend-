import React from 'react';
import Image from 'next/image';
import { LoginForm } from '@/features/admin/LoginForm';
import { Logo } from '@/components/ui';

export const metadata = {
  title: "Connexion Administrateur | LA FORÊT IMMOBILIER",
  description: "Espace de gestion et d'administration réservé à la direction La Forêt Immobilier.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative bg-[#0B150F] overflow-hidden selection:bg-[#2D5A43] selection:text-white">
      {/* LEFT COLUMN: Professional Forest Villa Image & Quote (60% width on Desktop) */}
      <div className="lg:w-7/12 xl:w-8/12 relative min-h-[220px] sm:min-h-[280px] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-16 overflow-hidden">
        {/* Background photo inspired by La Forêt Logo & Luxury Forest Aesthetics */}
        <Image 
          src="/admin-login-bg.png" 
          alt="La Forêt Immobilier — Villa de prestige en forêt" 
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover object-center scale-105 duration-1000 pointer-events-none" 
        />
        
        {/* Forest Green & Emerald Dark Gradients for perfect text legibility */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#071209]/95 via-[#0D2115]/75 to-[#132A1E]/30 pointer-events-none" />
        <div className="absolute inset-0 bg-black/25 pointer-events-none" />

        {/* Top Header Logo in a Glass Morph White Pill Container */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="inline-flex items-center gap-3 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white/95 dark:bg-white/95 backdrop-blur-2xl border border-white/80 shadow-[0_15px_35px_rgba(7,18,9,0.35)] transition-all duration-300">
            <Logo 
              variant="default"
              className="h-8 sm:h-11 w-auto" 
            />
            <div className="h-6 w-[1px] bg-[#2D5A43]/20 hidden sm:block"></div>
            <span className="text-xs font-serif font-bold tracking-widest text-[#2D5A43] uppercase hidden sm:block">
              Direction Algérie
            </span>
          </div>
        </div>

        {/* Inspirational Real Estate Quote (Compact on mobile so login form is immediately visible above fold) */}
        <div className="relative z-10 max-w-xl mt-6 lg:mt-auto pt-4 lg:pt-12">
          <blockquote className="text-lg sm:text-2xl lg:text-4xl font-serif font-normal text-white leading-snug mb-3 sm:mb-6 tracking-tight drop-shadow-sm">
            “L&apos;excellence de l&apos;immobilier algérien, sublimée par une administration moderne, intuitive et sécurisée.”
          </blockquote>
          <div className="hidden sm:flex items-center gap-4">
            <div className="w-12 h-[2px] bg-gradient-to-r from-gold-400 to-gold-600"></div>
            <div>
              <p className="text-sm font-bold text-white tracking-wide">Direction Générale</p>
              <p className="text-xs text-[#9EBFAD] font-medium">La Forêt Immobilier & Prestige — Alger</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Slate/Forest Dark Canvas with Overlapping White Glassmorphic Card (40% width) */}
      <div className="lg:w-5/12 xl:w-4/12 relative flex items-center justify-center p-4 sm:p-8 lg:p-12 bg-gradient-to-br from-[#0B150F] via-[#102218] to-[#0A140E] min-h-[500px] lg:min-h-screen">
        {/* Subtle geometric luxury grid in background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1A352715_1px,transparent_1px),linear-gradient(to_bottom,#1A352715_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        {/* Overlapping White Glassmorphism Card (0 margin on mobile, overlapping on desktop) */}
        <div className="w-full max-w-[440px] ml-0 lg:-ml-20 xl:-ml-28 bg-white/95 dark:bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-[32px] border border-white shadow-[0_25px_80px_rgba(6,16,10,0.65)] p-6 sm:p-10 relative z-30 transition-all duration-500">
          {/* Card Top Title / Welcome */}
          <div className="mb-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F2ED] text-[#2D5A43] text-[11px] font-bold uppercase tracking-wider mb-4 border border-[#2D5A43]/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A43] animate-pulse"></span>
              Espace Personnel
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#132A1E] tracking-tight">
              Bienvenue
            </h1>
            <p className="text-sm text-[#5D806D] mt-1 font-medium">
              Connectez-vous à votre tableau de bord de gestion.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  );
}
