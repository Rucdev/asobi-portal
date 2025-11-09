import type { Child } from 'hono/jsx';

interface FormActionsProps {
  cancelLabel?: string;
  cancelHref?: string;
  submitLabel?: string;
  submitDisabled?: boolean;
  className?: string;
  children?: Child;
}

export const FormActions = ({
  cancelLabel = 'キャンセル',
  cancelHref,
  submitLabel = '送信',
  submitDisabled,
  className,
  children,
}: FormActionsProps) => {
  return (
    <div class={`flex justify-between items-center pt-4 ${className || ''}`}>
      {cancelHref ? (
        <a
          href={cancelHref}
          class="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary text-base font-medium"
        >
          {cancelLabel}
        </a>
      ) : (
        <div />
      )}
      {children || (
        <button
          type="submit"
          disabled={submitDisabled}
          class="flex items-center justify-center rounded-lg bg-primary text-white font-bold py-3 px-6 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-12 text-base min-w-[84px]"
        >
          <span class="truncate">{submitLabel}</span>
        </button>
      )}
    </div>
  );
};
