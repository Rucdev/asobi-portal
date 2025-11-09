import type { Child } from 'hono/jsx';

interface FormCardProps {
  className?: string;
  children?: Child;
}

export const FormCard = ({ className, children }: FormCardProps) => {
  return (
    <div class={`bg-white dark:bg-card-dark shadow-md rounded-lg px-8 pt-6 pb-8 mb-4 ${className || ''}`}>
      {children}
    </div>
  );
};
