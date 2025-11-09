import type { Child } from 'hono/jsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  children?: Child;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) => {
  const baseClasses = 'flex cursor-pointer items-center justify-center overflow-hidden rounded-lg font-bold leading-normal tracking-[0.015em] transition-colors';

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-gray-200 dark:bg-[#232348] text-text-light dark:text-white hover:bg-gray-300 dark:hover:bg-[#2a2a5a]',
    ghost: 'bg-transparent text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary',
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-sm min-w-[64px]',
    md: 'h-10 px-4 text-sm min-w-[84px]',
    lg: 'h-12 px-6 text-base min-w-[84px]',
  };

  const widthClass = fullWidth ? 'w-full' : 'max-w-[480px]';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className || ''}`;

  return (
    <button class={classes} {...props}>
      <span class="truncate">{children}</span>
    </button>
  );
};
