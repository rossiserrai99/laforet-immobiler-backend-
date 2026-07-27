"use client";

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Users, LogOut, ExternalLink, Sparkles, Settings, X } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import adminService from '@/services/admin.service';
import { Logo } from '@/components/ui';

export function Sidebar({ isOpen = false, onClose }) {
  const pathname = usePathname();
  const { logout, fetchMe, isAuthenticated, admin } = useAdminAuth();
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  const hasAttemptedAuth = useRef(false);

  useEffect(() => {
    if (!isAuthenticated && !hasAttemptedAuth.current) {
      hasAttemptedAuth.current = true;
      fetchMe();
    }
  }, [isAuthenticated, fetchMe]);

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
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      <aside 
        className={`w-64 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50 border-r border-white/10 backdrop-blur-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: '#132A1E', color: '#FFFFFF' }}
      >
        {/* Luxury Brand Header with Medium Opacity Glass Morph Container Pill & Mobile Close Button */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent flex items-center justify-between">
          <div>
            <Link href="/" target="_blank" className="block group">
              <div className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/90 dark:bg-white/90 backdrop-blur-xl border border-white/80 shadow-md group-hover:scale-[1.03] transition-all duration-300">
                <Logo 
                  variant="default" 
                  className="h-8 sm:h-9 w-auto" 
                />
              </div>
            </Link>
            <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2D5A43]/30 border border-[#2D5A43]/40 text-[#E8C97A] text-[10px] font-mono font-semibold tracking-wider">
              <Sparkles className="w-3 h-3 text-[#E8C97A]" />
              <span>DIRECTION ENTERPRISE</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
            title="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <div className="px-3 mb-3 text-[11px] font-mono uppercase tracking-wider text-[#8EA89A] font-bold">
            MENU PRINCIPAL
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(`${item.href}/`) && item.href !== '/admin');
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-[#2D5A43]/40 text-white font-bold rounded-xl shadow-sm border border-white/10' 
                    : 'text-[#8EA89A] hover:bg-white/[0.05] hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center">
                  <item.icon className={`mr-3.5 h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? 'text-[#E8C97A]' : 'text-[#8EA89A] group-hover:text-[#E8C97A]'
                  }`} />
                  <span>{item.name}</span>
                </div>
                {item.count > 0 && (
                  <span className="bg-[#E8C97A] text-[#0A160E] text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                    {item.count}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-8 px-3 mb-3 text-[10px] font-mono uppercase tracking-widest text-[#8EA89A] font-semibold">
            ACCÈS RAPIDE
          </div>
          <Link 
            href="/"
            target="_blank"
            onClick={onClose}
            className="flex items-center px-4 py-3 text-sm font-medium text-[#8EA89A] hover:bg-white/[0.05] hover:text-white rounded-xl transition-all duration-300 border border-transparent hover:border-white/10 group"
          >
          <ExternalLink className="mr-3.5 h-4 w-4 text-[#8EA89A] group-hover:text-[#E8C97A] transition-colors" />
          <span>Voir le site public</span>
        </Link>
      </nav>

      {/* Futuristic User Card / Logout Footer (Forest Green Glassmorphism) */}
      <div className="p-4 border-t border-white/10 bg-[#0F2218]">
        <div className="flex items-center justify-between px-3.5 py-3 rounded-2xl bg-white/[0.04] border border-white/10 mb-3 shadow-inner">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E8C97A] to-[#8A6A2A] flex items-center justify-center text-[#0F2218] font-bold text-xs shrink-0 shadow-md">
              LF
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{admin?.name || 'Direction La Forêt'}</p>
              <p className="text-[10px] text-[#8EA89A] truncate">{admin?.email || 'Administrateur Général'}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => logout()}
          className="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-400 hover:text-white rounded-xl hover:bg-red-500/20 border border-red-500/20 transition-all duration-300 shadow-sm"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
    </>
  );
}
