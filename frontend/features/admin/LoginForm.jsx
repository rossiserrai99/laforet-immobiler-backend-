"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Input, Button } from '@/components/ui';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAdminAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);
    
    if (result.success) {
      router.push('/admin/dashboard');
      router.refresh();
    } else {
      setError(result.message);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 text-red-300 text-sm border border-red-500/20">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-warm-300 mb-1.5" htmlFor="email">
            Email professionnel
          </label>
          <Input 
            id="email"
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-charcoal-950 border-white/20 text-white focus:ring-gold-400"
          />
        </div>

        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-warm-300 mb-1.5" htmlFor="password">
            Mot de passe
          </label>
          <Input 
            id="password"
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-charcoal-950 border-white/20 text-white focus:ring-gold-400"
          />
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full justify-center inline-flex items-center px-6 py-3.5 rounded-xl bg-gradient-to-b from-[#E3CD86] to-[#C9A227] hover:from-[#F3E6BF] hover:to-[#D4AF37] text-[#090B10] font-bold text-sm shadow-[0_4px_20px_rgba(201,162,39,0.3)] hover:shadow-[0_4px_25px_rgba(201,162,39,0.5)] border border-[#F3E6BF]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
      >
        {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
      </button>
    </form>
  );
}
