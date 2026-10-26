interface BadgeProps {
  text: string;
  variant?: string;
}

function Badge({ text, variant = 'primary' }: BadgeProps) {
  return (
    <span className={`badge bg-${variant}`}>
      {text}
    </span>
  );
}

export default Badge;