import React from 'react';
import Image from 'next/image';
import { LoginForm } from '@/features/admin/LoginForm';

export const metadata = {
  title: "Connexion | LA FORÊT",
};

export default function LoginPage() {
  return (
    <div className="flex-1 flex min-h-screen items-center justify-center p-6 bg-charcoal-950 relative overflow-hidden">
      {/* Decorative luxury background element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/20 via-charcoal-950 to-charcoal-950"></div>
      
      <div className="w-full max-w-md bg-[#1C2234]/60 backdrop-blur-xl rounded-3xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative z-10">
        <div className="p-10 text-center border-b border-white/10 bg-charcoal-950/40">
          <div className="flex justify-center mb-4">
            <Image src="/logo.svg" alt="La Forêt" width={180} height={60} className="h-12 w-auto object-contain" priority />
          </div>
          <p className="text-xs font-sans font-semibold uppercase tracking-wider text-gold-400">Espace Administration & Prestige</p>
        </div>
        
        <div className="p-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
