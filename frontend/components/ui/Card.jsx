import React from 'react';

export function Card({ children, className = '', variant = 'default', hoverLift = false, ...props }) {
  const baseClasses = 'rounded-3xl overflow-hidden';
  const variants = {
    default: 'bg-white shadow-sm border border-warm-100',
    glass: 'backdrop-blur-md bg-white/80 border border-white/20 shadow-sm',
  };
  const hoverClasses = hoverLift ? 'transition-transform duration-300 hover:-translate-y-1 hover:shadow-md' : '';

  return (
    <div className={`${baseClasses} ${variants[variant]} ${hoverClasses} ${className}`} {...props}>
      {children}
    </div>
  );
}
