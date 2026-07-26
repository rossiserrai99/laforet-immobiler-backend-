import React from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = React.forwardRef(({ label, error, className = '', options = [], id, ...props }, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-charcoal-800">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={inputId}
          ref={ref}
          className={`h-11 w-full appearance-none rounded-xl border bg-white pl-4 pr-10 text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-500/20 focus:border-forest-500 transition-colors ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-warm-200'
          }`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-warm-400">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});
Select.displayName = 'Select';
