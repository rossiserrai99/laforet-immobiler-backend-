"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, Search, Shield } from 'lucide-react';
import { MobileMenu } from './MobileMenu';
import { Button, Logo } from '@/components/ui';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isDarkHeroPage = pathname === '/';
  const showLightNavbar = isScrolled || !isDarkHeroPage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* iOS Liquid Glass Wrapper */}
      <div className={`fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${showLightNavbar ? 'pt-4 px-4' : 'pt-0 px-0'}`}>
        <header 
          className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top ${
            showLightNavbar 
              ? 'w-full max-w-6xl bg-white/85 backdrop-blur-2xl border border-white/60 shadow-[0_12px_40px_0_rgba(0,0,0,0.08)] rounded-[2rem] py-2 px-6' 
              : 'w-full max-w-full bg-transparent rounded-none border-transparent shadow-none py-5 px-6 md:py-6 md:px-12'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center flex-shrink-0">
              <Logo 
                variant={showLightNavbar ? 'default' : 'light'}
                className={`w-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  showLightNavbar ? 'h-10' : 'h-14 sm:h-16 scale-105 sm:scale-110 origin-left drop-shadow-sm'
                }`}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 mx-auto">
              <Link href="/properties" className={`text-sm font-medium transition-colors ${showLightNavbar ? 'text-charcoal-800 hover:text-gold-600' : 'text-white hover:text-gold-400 drop-shadow-sm'}`}>Propriétés</Link>
              <Link href="/#services" className={`text-sm font-medium transition-colors ${showLightNavbar ? 'text-charcoal-800 hover:text-gold-600' : 'text-white hover:text-gold-400 drop-shadow-sm'}`}>Services</Link>
              <Link href="/#agence" className={`text-sm font-medium transition-colors ${showLightNavbar ? 'text-charcoal-800 hover:text-gold-600' : 'text-white hover:text-gold-400 drop-shadow-sm'}`}>L&apos;Agence</Link>
              <Link href="/#contact" className={`text-sm font-medium transition-colors ${showLightNavbar ? 'text-charcoal-800 hover:text-gold-600' : 'text-white hover:text-gold-400 drop-shadow-sm'}`}>Contact</Link>
            </nav>

            {/* Desktop Actions with Premium Search */}
            <div className="hidden md:flex items-center gap-4 flex-shrink-0">
              <div className="group relative flex items-center">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search size={16} className={`transition-colors ${showLightNavbar ? 'text-charcoal-400 group-focus-within:text-gold-600' : 'text-white/70 group-focus-within:text-white'}`} />
                </div>
                <input 
                  type="text" 
                  placeholder="Recherche..." 
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      window.location.href = `/properties?search=${encodeURIComponent(e.target.value.trim())}`;
                    }
                  }}
                  className={`pl-11 pr-5 py-2.5 rounded-full text-sm font-medium transition-all duration-500 outline-none
                    ${showLightNavbar 
                      ? 'bg-white/70 border border-charcoal-200/60 text-charcoal-900 placeholder:text-charcoal-500 w-40 focus:w-64 focus:bg-white focus:shadow-md focus:border-gold-400' 
                      : 'bg-white/10 border border-white/20 text-white placeholder:text-white/70 w-40 focus:w-64 focus:bg-white/20 focus:backdrop-blur-md backdrop-blur-sm'
                    }
                  `}
                />
              </div>
              <Link href="/admin/login" className="hidden lg:flex">
                <button className="flex items-center gap-2 rounded-full px-5 py-2.5 bg-[#1B4D2E]/90 hover:bg-[#133E26] text-white text-sm font-medium border border-[#2D5A43]/60 shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-md">
                  <Shield size={15} className="text-white/90" />
                  <span>Espace administrateur</span>
                </button>
              </Link>
            </div>

            {/* Mobile Menu Trigger */}
            <button 
              className={`md:hidden p-2 -mr-2 cursor-pointer transition-colors ${showLightNavbar ? 'text-charcoal-900' : 'text-white'}`}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </header>
      </div>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
}


