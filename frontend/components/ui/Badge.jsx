import React from 'react';

export function Badge({ children, variant = 'sale', className = '' }) {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold';
  
  const variants = {
    sale: 'bg-forest-100 text-forest-800',
    rent: 'bg-gold-100 text-gold-600',
    sold: 'bg-charcoal-800 text-white',
    reserved: 'bg-warm-200 text-charcoal-800',
    featured: 'bg-gold-400 text-charcoal-900 shadow-sm',
    draft: 'bg-warm-100 text-warm-400',
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
