"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Logo } from '@/components/ui';
import { Phone, Mail, X } from 'lucide-react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

export function MobileMenu({ isOpen, onClose }) {
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
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
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] bg-charcoal-950/80 backdrop-blur-2xl"
          >
            {/* Top Bar with Close Button */}
            <div className="flex items-center justify-between p-6 md:p-8">
              <Logo variant="light" className="h-10 w-auto" />
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/10 transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Main Navigation Links */}
            <div className="flex flex-col h-[calc(100vh-100px)] overflow-y-auto px-6 pb-12">
              <nav className="flex flex-col gap-6 py-10">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={link.href}
                      className="text-4xl sm:text-5xl font-serif text-white hover:text-gold-400 transition-colors tracking-tight"
                      onClick={onClose}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-auto space-y-8 pt-8 border-t border-white/10"
              >
                <Link href="/estimation" onClick={onClose} className="block w-full">
                  <Button variant="gold" className="w-full py-4 text-lg font-semibold rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                    Estimer mon bien
                  </Button>
                </Link>

                <div className="flex flex-col gap-5">
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
                    <span className="text-lg">contact@laforet.dz</span>
                  </a>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold-500 hover:text-charcoal-900 border border-white/10 transition-all">
                    <FaFacebook size={20} />
                  </a>
                  <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-gold-500 hover:text-charcoal-900 border border-white/10 transition-all">
                    <FaInstagram size={20} />
                  </a>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
