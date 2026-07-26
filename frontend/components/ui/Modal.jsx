"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-charcoal-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className={`relative w-full ${maxWidth} rounded-3xl bg-white shadow-xl transition-all`}>
        <div className="flex items-center justify-between border-b border-warm-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-charcoal-900">{title}</h3>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 text-warm-400 hover:bg-warm-50 hover:text-charcoal-900 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
