"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Drawer({ isOpen, onClose, title, children, side = 'right' }) {
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

  const sideClasses = {
    right: 'right-0 border-l',
    left: 'left-0 border-r',
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div 
        className="absolute inset-0 bg-charcoal-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className={`absolute top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl transition-transform border-warm-100 flex flex-col ${sideClasses[side]}`}>
        <div className="flex items-center justify-between border-b border-warm-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-charcoal-900">{title}</h3>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 text-warm-400 hover:bg-warm-50 hover:text-charcoal-900 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
