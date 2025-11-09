import type { Child } from 'hono/jsx';

interface LabelProps {
  text?: string;
  required?: boolean;
  helperText?: string;
  children?: Child;
  className?: string;
}

export const Label = ({ text, required, helperText, children, className, ...props }: LabelProps) => {
  return (
    <label class={`flex flex-col flex-1 ${className || ''}`} {...props}>
      {text && (
        <p class="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
          {text}{required && '*'}
        </p>
      )}
      {children}
      {helperText && (
        <p class="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal pt-2">
          {helperText}
        </p>
      )}
    </label>
  );
};
