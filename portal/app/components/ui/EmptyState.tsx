import type { Child } from 'hono/jsx';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  children?: Child;
}

export const EmptyState = ({
  icon = 'info',
  title,
  description,
  actionLabel,
  actionHref,
  className,
  children,
}: EmptyStateProps) => {
  return (
    <div class={`flex flex-col items-center justify-center text-center py-20 bg-white dark:bg-card-dark rounded-xl ${className || ''}`}>
      <span class="material-symbols-outlined text-6xl text-gray-400 mb-4">
        {icon}
      </span>
      <h2 class="text-2xl font-bold mb-2 text-text-dark dark:text-text-light">{title}</h2>
      {description && (
        <p class="text-gray-400 mb-6">{description}</p>
      )}
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          class="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary/80 transition-colors"
        >
          {actionLabel}
        </a>
      )}
      {children}
    </div>
  );
};
