import React from 'react';
import { Sidebar } from '@/components/admin/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div 
      className="flex min-h-screen text-white relative overflow-x-hidden selection:bg-gold-400 selection:text-charcoal-950 font-sans"
      style={{ backgroundColor: '#090B10', color: '#FFFFFF' }}
    >
      {/* Subtle Futuristic Architectural Grid & Dark Ambient Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(#1E2434_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-[700px] h-[400px] bg-gradient-to-bl from-[#141B2E]/40 via-transparent to-transparent rounded-full blur-3xl pointer-events-none"></div>
      
      <Sidebar />
      <main className="flex-1 ml-64 p-8 lg:p-12 relative z-10 max-w-7xl">
        {children}
      </main>
    </div>
  );
}
