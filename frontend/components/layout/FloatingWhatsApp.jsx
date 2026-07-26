"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function FloatingWhatsApp() {
  const [isHovered, setIsHovered] = useState(false);
  const whatsappUrl = "https://wa.me/213550593707";

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex items-center gap-3">
      {/* Sleek Dark Glassmorphism Tooltip on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, x: 15, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-charcoal-900/90 backdrop-blur-xl border border-white/15 shadow-2xl text-white pointer-events-none"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
            <div className="text-left">
              <span className="block text-[10px] font-mono uppercase tracking-wider text-white/60">
                Direction La Forêt
              </span>
              <span className="block text-xs font-sans font-bold text-white">
                Discuter sur WhatsApp
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Premium Glowing Official WhatsApp Button */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contacter La Forêt sur WhatsApp"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ opacity: 0, scale: 0.5, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="relative group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-[#1EBE5D] via-[#25D366] to-[#2BF071] text-white shadow-[0_8px_30px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_35px_rgba(37,211,102,0.65)] transition-shadow duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
      >
        {/* Subtle animated halo glow */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25 duration-1000 pointer-events-none"></span>

        {/* Official WhatsApp Vector Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>

        {/* Online Status Dot */}
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#25D366] border-2 border-white shadow-xs"></span>
      </motion.a>
    </div>
  );
}
