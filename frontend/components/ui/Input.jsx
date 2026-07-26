import React from 'react';

export const Input = React.forwardRef(({ label, error, className = '', id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-charcoal-800">
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`h-11 rounded-xl border bg-white px-4 text-charcoal-900 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-colors ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-warm-200'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});
Input.displayName = 'Input';
