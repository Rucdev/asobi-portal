import type { Child } from 'hono/jsx';

interface ErrorMessageProps {
  title?: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  children?: Child;
}

export const ErrorMessage = ({
  title = 'エラー',
  message,
  actionLabel,
  actionHref,
  className,
  children,
}: ErrorMessageProps) => {
  return (
    <div class={`relative flex min-h-screen w-full flex-col overflow-x-hidden ${className || ''}`}>
      <div class="flex-grow">
        <div class="px-4 sm:px-10 md:px-20 lg:px-40 py-5">
          <div class="mx-auto flex max-w-[960px] flex-col">
            <div class="flex flex-wrap justify-between gap-3 p-4">
              <div class="flex min-w-72 flex-col gap-3">
                <p class="text-text-dark dark:text-text-light text-4xl font-black leading-tight tracking-[-0.033em]">
                  {title}
                </p>
                <p class="text-red-600 dark:text-red-400 text-base font-normal leading-normal">
                  {message}
                </p>
                {actionLabel && actionHref && (
                  <a href={actionHref} class="text-primary hover:underline">
                    {actionLabel}
                  </a>
                )}
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
