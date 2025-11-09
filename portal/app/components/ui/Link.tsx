import type { Child } from 'hono/jsx';

type LinkVariant = 'primary' | 'secondary' | 'ghost' | 'underline';
type LinkSize = 'sm' | 'md' | 'lg';

interface LinkProps {
  href: string;
  variant?: LinkVariant;
  size?: LinkSize;
  className?: string;
  children?: Child;
  target?: '_blank' | '_self' | '_parent' | '_top';
  rel?: string;
}

export const Link = ({
  href,
  variant = 'primary',
  size = 'md',
  className,
  children,
  target,
  rel,
}: LinkProps) => {
  const baseClasses = 'inline-flex items-center font-medium transition-colors';

  const variantClasses = {
    primary: 'text-primary hover:text-primary/80',
    secondary: 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary',
    ghost: 'text-gray-500 dark:text-gray-400 hover:text-text-dark dark:hover:text-text-light',
    underline: 'text-primary hover:text-primary/80 underline',
  };

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`;

  return (
    <a href={href} class={classes} target={target} rel={rel}>
      {children}
    </a>
  );
};
