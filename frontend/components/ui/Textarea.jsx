import React from 'react';

export const Textarea = React.forwardRef(({ label, error, className = '', id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`w-full flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-charcoal-800">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        ref={ref}
        className={`w-full min-h-[130px] sm:min-h-[150px] rounded-xl border bg-white px-4 py-3 text-charcoal-900 placeholder:text-warm-400 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-colors resize-y ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-warm-200'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});
Textarea.displayName = 'Textarea';
