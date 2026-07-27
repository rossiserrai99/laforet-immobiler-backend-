"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAdminAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    
    if (result.success) {
      if (rememberMe && typeof window !== 'undefined') {
        localStorage.setItem('laforet_admin_email_remembered', email);
      }
      router.push('/admin/dashboard');
      router.refresh();
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200 shadow-sm flex items-start gap-2.5">
          <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
          <span>{error}</span>
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D5A43] mb-2" htmlFor="email">
            Email professionnel*
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5D806D]">
              <Mail className="h-4 w-4" />
            </div>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@laforet-dz.com"
              required
              className="w-full pl-10 pr-4 py-3.5 bg-white/90 border border-[#D1E0D7] hover:border-[#2D5A43]/50 focus:border-[#2D5A43] focus:ring-4 focus:ring-[#2D5A43]/15 rounded-xl text-[#132A1E] placeholder-[#8EA89A] text-base sm:text-sm font-medium transition-all duration-300 shadow-sm outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D5A43] mb-2" htmlFor="password">
            Mot de passe*
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5D806D]">
              <Lock className="h-4 w-4" />
            </div>
            <input 
              id="password"
              type={showPassword ? "text" : "password"} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full pl-10 pr-11 py-3.5 bg-white/90 border border-[#D1E0D7] hover:border-[#2D5A43]/50 focus:border-[#2D5A43] focus:ring-4 focus:ring-[#2D5A43]/15 rounded-xl text-[#132A1E] placeholder-[#8EA89A] text-base sm:text-sm font-medium transition-all duration-300 shadow-sm outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6B8A7A] hover:text-[#2D5A43] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer group select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-[#B8CCC2] text-[#2D5A43] focus:ring-[#2D5A43] transition-colors cursor-pointer"
          />
          <span className="text-xs font-medium text-[#4A6B5B] group-hover:text-[#1F3E2E] transition-colors">
            Se souvenir de moi
          </span>
        </label>
        <a
          href="#forgot-password"
          onClick={(e) => {
            e.preventDefault();
            alert("Veuillez contacter l'administrateur système de La Forêt Immobilier pour réinitialiser votre accès.");
          }}
          className="text-xs font-semibold text-[#2D5A43] hover:text-[#132A1E] hover:underline transition-all"
        >
          Mot de passe oublié ?
        </a>
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full justify-center inline-flex items-center gap-2.5 px-6 py-4 rounded-xl bg-[#133E26] hover:bg-[#1B4F32] text-white font-bold text-sm shadow-sm border border-[#2D5A43]/60 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Connexion en cours...' : 'Se connecter'}</span>
          {!isSubmitting && <ArrowRight className="w-4 h-4 text-[#D4AF37]" />}
        </button>
      </div>

      <div className="pt-5 border-t border-[#E3EDE8] text-center">
        <p className="text-[11px] text-[#6B8A7A]">
          La Forêt Immobilier — Accès sécurisé au tableau de bord administrateur
        </p>
      </div>
    </form>
  );
}
