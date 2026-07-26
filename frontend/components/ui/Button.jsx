import React from 'react';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  isLoading = false,
  disabled,
  asChild = false,
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    primary: 'bg-forest-500 text-white hover:bg-forest-600',
    secondary: 'bg-transparent border border-forest-500 text-forest-500 hover:bg-forest-50',
    ghost: 'bg-transparent text-forest-500 hover:bg-forest-50',
    gold: 'bg-gold-400 text-charcoal-900 hover:bg-gold-500',
    icon: 'p-2 rounded-full text-forest-500 hover:bg-forest-50',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg',
    icon: 'h-10 w-10',
  };

  const combinedClassName = `${baseClasses} ${variants[variant]} ${variant === 'icon' ? sizes.icon : sizes[size]} ${className}`;

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      className: `${combinedClassName} ${children.props.className || ''}`,
      ...props
    });
  }

  return (
    <button 
      className={combinedClassName}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
}
