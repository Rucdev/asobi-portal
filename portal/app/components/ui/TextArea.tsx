interface TextAreaProps {
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  cols?: number;
  onChange?: (event: Event) => void;
  onInput?: (event: InputEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onFocus?: (event: FocusEvent) => void;
}

export const TextArea = ({ label, helperText, error, className, ...props }: TextAreaProps) => {
  const textareaClasses = `form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg bg-white dark:bg-[#191933] border-gray-300 dark:border-[#323267] focus:border-primary dark:focus:border-primary focus:ring-primary/50 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-[#9292c9] min-h-36 p-[15px] text-base font-normal leading-normal ${className || ''}`;

  if (label) {
    return (
      <label class="flex flex-col flex-1">
        <p class="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
          {label}
        </p>
        <textarea class={textareaClasses} {...props}></textarea>
        {helperText && (
          <p class="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal pt-2">
            {helperText}
          </p>
        )}
        {error && (
          <p class="text-red-600 dark:text-red-400 text-sm font-normal leading-normal pt-2">
            {error}
          </p>
        )}
      </label>
    );
  }

  return (
    <>
      <textarea class={textareaClasses} {...props}></textarea>
      {helperText && (
        <p class="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal pt-2">
          {helperText}
        </p>
      )}
      {error && (
        <p class="text-red-600 dark:text-red-400 text-sm font-normal leading-normal pt-2">
          {error}
        </p>
      )}
    </>
  );
};
