interface BadgeProps {
  text: string;
  variant?: string;
  className?: string;
}

function Badge({ text, variant = 'primary', className = '' }: BadgeProps) {
  return (
    <span className={`badge bg-${variant} ${className}`}>
      {text}
    </span>
  );
}

export default Badge;