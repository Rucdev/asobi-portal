import type { Child } from 'hono/jsx';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  id?: string;
  name?: string;
  label?: string;
  helperText?: string;
  error?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  onChange?: (event: Event) => void;
  children?: Child;
}

export const Select = ({
  id,
  name,
  label,
  helperText,
  error,
  options,
  value,
  defaultValue,
  required,
  disabled,
  className,
  onChange,
  children,
}: SelectProps) => {
  const selectClasses = `shadow appearance-none border border-gray-300 dark:border-gray-600 rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-background-dark leading-tight focus:outline-none focus:shadow-outline focus:border-primary ${className || ''}`;

  if (label) {
    return (
      <label class="flex flex-col flex-1">
        <p class="text-text-light dark:text-text-dark text-base font-medium leading-normal pb-2">
          {label}{required && '*'}
        </p>
        <select
          id={id}
          class={selectClasses}
          name={name}
          value={value}
          required={required}
          disabled={disabled}
          onChange={onChange}
        >
          {defaultValue && (
            <option value="">{defaultValue}</option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
          {children}
        </select>
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
      <select
        id={id}
        class={selectClasses}
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        onChange={onChange}
      >
        {defaultValue && (
          <option value="">{defaultValue}</option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
        {children}
      </select>
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
