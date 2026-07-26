"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users, LogOut, ExternalLink, Sparkles, Settings } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import adminService from '@/services/admin.service';

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminService.getStats();
        const stats = res.data?.stats || res.stats;
        if (stats?.newLeads) {
          setNewLeadsCount(stats.newLeads);
        }
      } catch (err) {
        // Silently ignore, maybe not logged in yet
      }
    };
    fetchStats();
    // Poll every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { name: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Biens Immobiliers', href: '/admin/properties', icon: Building2 },
    { name: 'Leads & Demandes', href: '/admin/leads', icon: Users, count: newLeadsCount },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside 
      className="w-64 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50 border-r border-white/10 shadow-[10px_0_40px_rgba(0,0,0,0.7)] backdrop-blur-2xl transition-all"
      style={{ backgroundColor: '#0B0E15', color: '#FFFFFF' }}
    >
      {/* Luxury Brand Header */}
      <div className="p-6 border-b border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent">
        <Link href="/" target="_blank" className="block group">
          <Image 
            src="/logo.svg" 
            alt="La Forêt" 
            width={160} 
            height={55} 
            className="h-10 w-auto object-contain brightness-0 invert opacity-95 group-hover:scale-105 transition-transform duration-300" 
          />
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-3 text-[11px] font-sans uppercase tracking-wider text-warm-400 font-bold">
          MENU PRINCIPAL
        </div>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== '/admin');
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-gold-400/20 via-gold-400/10 to-transparent text-gold-400 border-l-2 border-gold-400 font-bold shadow-md shadow-gold-500/10' 
                  : 'text-warm-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
              }`}
            >
              <div className="flex items-center">
                <item.icon className={`mr-3.5 h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-gold-400' : 'text-warm-400 group-hover:text-gold-400'
                }`} />
                <span>{item.name}</span>
              </div>
              {item.count > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-8 px-3 mb-3 text-[10px] font-mono uppercase tracking-widest text-warm-400 font-semibold">
          ACCÈS RAPIDE
        </div>
        <Link 
          href="/"
          target="_blank"
          className="flex items-center px-4 py-3 text-sm font-medium text-warm-300 hover:bg-white/5 hover:text-white rounded-xl transition-all duration-300 border border-transparent hover:border-white/10 group"
        >
          <ExternalLink className="mr-3.5 h-4 w-4 text-warm-400 group-hover:text-gold-400 transition-colors" />
          <span>Voir le site public</span>
        </Link>
      </nav>

      {/* Futuristic User Card / Logout Footer */}
      <div className="p-4 border-t border-white/10" style={{ backgroundColor: '#0D111A' }}>
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 mb-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-charcoal-950 font-bold text-xs shrink-0 shadow-sm">
              LF
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">Direction La Forêt</p>
              <p className="text-[10px] text-warm-400 truncate">Administrateur</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-400 hover:text-white rounded-xl hover:bg-red-500/20 border border-red-500/20 transition-all duration-300"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
