'use client';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
}) {
  const baseStyles = `
    inline-flex items-center justify-center
    font-medium rounded-button
    transition-all duration-base
    focus-visible:outline-primary
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-primary text-white
      hover:bg-primary/90 active:bg-primary/80
      shadow-button
    `,
    secondary: `
      bg-surface text-text border border-border
      hover:bg-surface/80 active:bg-surface/60
    `,
    ghost: `
      text-muted
      hover:text-text hover:bg-surface/50
    `,
  };

  const sizes = {
    small: 'px-4 py-2 text-sm min-h-[36px]',
    medium: 'px-6 py-3 min-h-[44px]',
    large: 'px-8 py-4 text-lg min-h-[52px]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}
