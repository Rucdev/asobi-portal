import type { Child } from 'hono/jsx';

interface PageHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: string;
  className?: string;
  children?: Child;
}

export const PageHeader = ({
  title,
  description,
  actionLabel,
  actionHref,
  actionIcon,
  className,
  children,
}: PageHeaderProps) => {
  return (
    <div class={`flex flex-wrap justify-between gap-3 mb-6 ${className || ''}`}>
      <div class="flex min-w-72 flex-col gap-3">
        <h1 class="text-3xl md:text-4xl font-bold md:font-black leading-tight tracking-[-0.033em] text-text-dark dark:text-text-light">
          {title}
        </h1>
        {description && (
          <p class="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
            {description}
          </p>
        )}
      </div>
      {actionLabel && actionHref && (
        <a
          href={actionHref}
          class="flex items-center gap-2 bg-primary hover:bg-primary/80 text-white font-bold py-2 px-4 rounded-lg transition-colors h-fit"
        >
          {actionIcon && (
            <span class="material-symbols-outlined text-sm">{actionIcon}</span>
          )}
          {actionLabel}
        </a>
      )}
      {children}
    </div>
  );
};
