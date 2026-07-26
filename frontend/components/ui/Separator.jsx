import React from 'react';

export function Separator({ className = '', orientation = 'horizontal' }) {
  return (
    <div
      role="separator"
      className={`bg-warm-200 ${
        orientation === 'horizontal' ? 'h-[1px] w-full' : 'h-full w-[1px]'
      } ${className}`}
    />
  );
}
