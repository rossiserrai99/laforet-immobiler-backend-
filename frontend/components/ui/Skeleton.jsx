import React from 'react';

export function Skeleton({ className = '', variant = 'text' }) {
  const variants = {
    text: 'h-4 w-full rounded',
    title: 'h-8 w-3/4 rounded-md',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-64 w-full rounded-3xl',
    image: 'h-full w-full rounded-2xl',
  };

  return (
    <div 
      className={`bg-warm-200 overflow-hidden relative ${variants[variant]} ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  );
}
