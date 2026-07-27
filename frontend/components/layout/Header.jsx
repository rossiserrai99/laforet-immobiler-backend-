"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, Search } from 'lucide-react';
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
      setIsScrolled(window.scrollY > 15);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Fixed top wrapper with stable padding so no horizontal jump occurs */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-3 px-3 sm:pt-4 sm:px-6 pointer-events-none transition-all duration-500">
        <header 
          className={`w-full max-w-6xl pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            showLightNavbar 
              ? 'bg-white/90 backdrop-blur-xl border border-charcoal-200/60 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.08)] rounded-2xl sm:rounded-3xl py-2.5 px-4 sm:py-3.5 sm:px-8' 
              : 'bg-transparent border border-transparent shadow-none rounded-2xl sm:rounded-3xl py-3 px-4 sm:py-5 sm:px-8'
          }`}
        >
          <div className="flex items-center justify-between">
            {/* Logo with clean height transition (no CSS scale to avoid SVG mobile jank) */}
            <Link href="/" className="group flex items-center flex-shrink-0">
              <Logo 
                variant={showLightNavbar ? 'default' : 'light'}
                className={`w-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  showLightNavbar ? 'h-7 sm:h-9 md:h-10' : 'h-9 sm:h-11 md:h-12 drop-shadow-sm'
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
              <Link href="/estimation" className="hidden lg:flex">
                <Button variant={showLightNavbar ? 'primary' : 'gold'} className="rounded-full px-6 shadow-lg transition-all duration-300">
                  Estimer
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Trigger */}
            <button 
              className={`md:hidden p-2.5 -mr-1 rounded-full cursor-pointer transition-all duration-200 active:scale-95 ${
                showLightNavbar 
                  ? 'text-charcoal-900 hover:bg-charcoal-100/70' 
                  : 'text-white hover:bg-white/10'
              }`}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Ouvrir le menu"
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

