import type { Child } from 'hono/jsx';

interface TableColumn {
  key: string;
  label: string;
  className?: string;
}

interface TableProps {
  columns: TableColumn[];
  className?: string;
  children?: Child;
}

interface TableHeaderProps {
  className?: string;
  children?: Child;
}

interface TableBodyProps {
  className?: string;
  children?: Child;
}

interface TableRowProps {
  className?: string;
  children?: Child;
  onClick?: () => void;
}

interface TableCellProps {
  className?: string;
  children?: Child;
}

export const Table = ({ columns, className, children }: TableProps) => {
  return (
    <div class={`bg-white dark:bg-card-dark shadow-md rounded overflow-hidden ${className || ''}`}>
      <table class="min-w-full">
        <thead class="bg-gray-100 dark:bg-background-dark">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                class={`px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${column.className || ''}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody class="bg-white dark:bg-card-dark divide-y divide-gray-200 dark:divide-gray-600">
          {children}
        </tbody>
      </table>
    </div>
  );
};

export const TableHeader = ({ className, children }: TableHeaderProps) => {
  return (
    <thead class={`bg-gray-100 dark:bg-background-dark ${className || ''}`}>
      {children}
    </thead>
  );
};

export const TableBody = ({ className, children }: TableBodyProps) => {
  return (
    <tbody class={`bg-white dark:bg-card-dark divide-y divide-gray-200 dark:divide-gray-600 ${className || ''}`}>
      {children}
    </tbody>
  );
};

export const TableRow = ({ className, children, onClick }: TableRowProps) => {
  return (
    <tr
      class={`hover:bg-gray-50 dark:hover:bg-background-dark ${className || ''}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export const TableCell = ({ className, children }: TableCellProps) => {
  return (
    <td class={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300 ${className || ''}`}>
      {children}
    </td>
  );
};
