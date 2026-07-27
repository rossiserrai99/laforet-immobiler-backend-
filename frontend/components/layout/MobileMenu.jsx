"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Logo } from '@/components/ui';
import { Phone, Mail, X, Shield } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

export function MobileMenu({ isOpen, onClose }) {
  // Safe iOS/Android scroll lock that preserves scroll position without jump
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
      }
    }
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const links = [
    { href: '/', label: 'Accueil' },
    { href: '/properties', label: 'Propriétés' },
    { href: '/#services', label: 'Nos Services' },
    { href: '/#agence', label: "L'Agence" },
    { href: '/#contact', label: 'Contact' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-charcoal-950/95 backdrop-blur-xl flex flex-col overflow-hidden"
        >
          {/* Top Bar matching Header padding for seamless visual transition */}
          <div className="flex items-center justify-between pt-6 px-7 sm:px-10 pb-4 border-b border-white/10">
            <Link href="/" onClick={onClose} className="flex items-center">
              <Logo variant="light" className="h-9 sm:h-11 w-auto" />
            </Link>
            <button
              onClick={onClose}
              className="p-2.5 -mr-1 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 transition-all duration-200 active:scale-95"
              aria-label="Fermer le menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Main Navigation Links with smooth staggered slide-in */}
          <div className="flex flex-col flex-1 overflow-y-auto px-7 sm:px-10 pb-10">
            <nav className="flex flex-col gap-6 py-8">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.35, delay: 0.05 + i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    className="text-4xl sm:text-5xl font-serif text-white hover:text-gold-400 transition-colors tracking-tight block"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-auto space-y-6 pt-6 border-t border-white/10"
            >
              <Link href="/admin/login" onClick={onClose} className="block w-full">
                <button className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#1B4D2E]/90 hover:bg-[#133E26] text-white text-base font-medium rounded-2xl border border-[#2D5A43]/60 shadow-md transition-all duration-300">
                  <Shield size={18} className="text-white/90" />
                  <span>Espace administrateur</span>
                </button>
              </Link>

              <div className="flex flex-col gap-4">
                <a href="tel:+213550593707" className="flex items-center gap-4 text-warm-200 hover:text-white transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <Phone size={18} className="text-gold-400" />
                  </div>
                  <span className="text-lg tracking-wide">+213 550 59 37 07</span>
                </a>
                <a href="mailto:contact@laforet.dz" className="flex items-center gap-4 text-warm-200 hover:text-white transition-colors">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                    <Mail size={18} className="text-gold-400" />
                  </div>
                  <span className="text-base sm:text-lg tracking-wide">contact@laforet.dz</span>
                </a>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/5 hover:bg-gold-500 hover:text-charcoal-950 text-white flex items-center justify-center border border-white/10 transition-all duration-300"
                  aria-label="Facebook"
                >
                  <FaFacebook size={20} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/5 hover:bg-gold-500 hover:text-charcoal-950 text-white flex items-center justify-center border border-white/10 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <FaInstagram size={20} />
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
