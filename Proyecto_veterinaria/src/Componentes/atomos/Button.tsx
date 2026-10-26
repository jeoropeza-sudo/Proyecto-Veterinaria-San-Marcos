import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: string;
  size?: string;
  className?: string;
}

function Button({ children, variant = 'primary', size = 'md', className = '' }: ButtonProps) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  return (
    <button className={`btn btn-${variant} ${sizeClass} ${className}`}>
      {children}
    </button>
  );
}

export default Button;