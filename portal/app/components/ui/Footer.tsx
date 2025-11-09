import type { Child } from 'hono/jsx';

interface FooterLink {
  href: string;
  label: string;
}

interface FooterProps {
  copyright?: string;
  links?: FooterLink[];
  className?: string;
  children?: Child;
}

export const Footer = ({
  copyright = '2024 Game Portal. All rights reserved.',
  links,
  className,
  children,
}: FooterProps) => {
  const defaultLinks: FooterLink[] = [
    { href: '#', label: 'Terms of Service' },
    { href: '#', label: 'Contact' },
  ];

  const footerLinks = links || defaultLinks;

  return (
    <footer class={`text-center py-6 border-t border-gray-200 dark:border-card-dark mt-auto ${className || ''}`}>
      <p class="text-sm text-gray-500 dark:text-gray-400">© {copyright}</p>
      {footerLinks.length > 0 && (
        <div class="flex justify-center gap-4 mt-2">
          {footerLinks.map((link) => (
            <a
              key={link.href + link.label}
              class="text-sm text-gray-500 dark:text-gray-400 hover:text-primary"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      {children}
    </footer>
  );
};
