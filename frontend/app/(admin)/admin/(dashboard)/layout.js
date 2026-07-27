"use client";

import React, { useState } from 'react';
import { Sidebar } from '@/components/admin/Sidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default function DashboardLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div 
      className="flex min-h-screen relative overflow-x-hidden selection:bg-[#2D5A43] selection:text-white font-sans"
      style={{ backgroundColor: '#F6F8F6', color: '#0B150F' }}
    >
      {/* Google Dashboard Style Smooth Alabaster/White Grid & Soft Mint Ambient Lighting */}
      <div className="fixed inset-0 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:28px_28px] opacity-35 pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-[800px] h-[500px] bg-gradient-to-bl from-[#DDF2E6]/50 via-[#EAF5EF]/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>
      
      <Sidebar isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 ml-0 lg:ml-64 flex flex-col min-h-screen relative z-10 w-full max-w-full overflow-x-hidden">
        <AdminHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
