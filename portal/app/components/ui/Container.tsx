import type { Child } from 'hono/jsx';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ContainerProps {
  size?: ContainerSize;
  className?: string;
  children?: Child;
}

export const Container = ({ size = 'lg', className, children }: ContainerProps) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  const classes = `${sizeClasses[size]} mx-auto py-8 px-4 ${className || ''}`;

  return <div class={classes}>{children}</div>;
};
