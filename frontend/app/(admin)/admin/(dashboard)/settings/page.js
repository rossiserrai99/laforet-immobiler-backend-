"use client";

import React, { useState, useEffect } from 'react';
import { Save, Lock, Mail, ShieldAlert, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import authService from '@/services/auth.service';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export default function SettingsPage() {
  const { user } = useAdminAuth();
  const [formData, setFormData] = useState({
    newEmail: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, newEmail: user.email }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas.' });
      return;
    }

    if (formData.newPassword && formData.newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' });
      return;
    }

    setIsLoading(true);

    try {
      const dataToSubmit = {
        currentPassword: formData.currentPassword
      };

      if (formData.newEmail && formData.newEmail !== user?.email) {
        dataToSubmit.newEmail = formData.newEmail;
      }

      if (formData.newPassword) {
        dataToSubmit.newPassword = formData.newPassword;
      }

      await authService.updateCredentials(dataToSubmit);
      
      setMessage({ type: 'success', text: 'Vos identifiants ont été mis à jour avec succès.' });
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-sans font-bold text-white mb-2 tracking-tight">Paramètres du Compte</h1>
          <p className="text-warm-400 font-sans">Gérez vos identifiants et sécurisez votre accès administrateur.</p>
        </div>
      </div>

      <div className="bg-charcoal-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/5">
          <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center border border-gold-500/30">
            <ShieldAlert className="w-6 h-6 text-gold-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white font-sans">Identifiants de Connexion</h2>
            <p className="text-sm text-warm-400 font-sans mt-1">Mettez à jour votre adresse email et/ou votre mot de passe.</p>
          </div>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 border ${
            message.type === 'success' 
              ? 'bg-forest-500/10 border-forest-500/20 text-forest-300' 
              : 'bg-red-500/10 border-red-500/20 text-red-300'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email Address */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-warm-300 uppercase tracking-wider">
                  Adresse Email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-warm-500" />
                  </div>
                  <input
                    type="email"
                    name="newEmail"
                    required
                    value={formData.newEmail}
                    onChange={handleChange}
                    className="w-full bg-charcoal-950/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all font-sans"
                    placeholder="admin@laforet.dz"
                  />
                </div>
              </div>

              {/* Current Password */}
              <div className="space-y-2 md:col-span-2 pt-4 border-t border-white/5">
                <label className="text-xs font-semibold text-warm-300 uppercase tracking-wider">
                  Mot de passe actuel <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-warm-500" />
                  </div>
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    name="currentPassword"
                    required
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full bg-charcoal-950/50 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all font-sans"
                    placeholder="Obligatoire pour sauvegarder"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-warm-500 hover:text-white transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs text-warm-500 mt-1">Nécessaire pour confirmer les modifications.</p>
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-warm-300 uppercase tracking-wider">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-warm-500" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="w-full bg-charcoal-950/50 border border-white/10 rounded-xl py-3 pl-11 pr-12 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all font-sans"
                    placeholder="Optionnel"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-warm-500 hover:text-white transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-warm-300 uppercase tracking-wider">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-warm-500" />
                  </div>
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-charcoal-950/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/50 transition-all font-sans"
                    placeholder="Répétez le nouveau mot de passe"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 flex justify-end">
            <button
              type="submit"
              disabled={isLoading || !formData.currentPassword}
              className="px-6 py-3 bg-gradient-to-r from-gold-400 to-gold-600 hover:from-gold-300 hover:to-gold-500 text-charcoal-950 font-bold rounded-xl shadow-[0_0_20px_rgba(201,162,39,0.3)] hover:shadow-[0_0_30px_rgba(201,162,39,0.5)] transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-charcoal-950 border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <Save className="w-5 h-5" />
              )}
              <span>{isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
