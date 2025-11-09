import type { Child } from 'hono/jsx';

interface UserInfo {
  userId: number;
  userName: string;
  userType: string;
}

interface NavLink {
  href: string;
  label: string;
  active?: boolean;
}

interface HeaderProps {
  userInfo?: UserInfo | null;
  navLinks?: NavLink[];
  className?: string;
  children?: Child;
}

export const Header = ({ userInfo, navLinks, className, children }: HeaderProps) => {
  const defaultNavLinks: NavLink[] = [
    { href: '/', label: 'Home' },
    { href: '/games', label: 'All Games' },
    { href: '/games', label: 'My Library' },
  ];

  const links = navLinks || defaultNavLinks;

  return (
    <header class={`flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 dark:border-card-dark px-6 sm:px-10 md:px-20 lg:px-40 py-4 ${className || ''}`}>
      <div class="flex items-center gap-8">
        <div class="flex items-center gap-3 text-text-dark dark:text-white">
          <span class="material-symbols-outlined text-primary" style="font-size: 24px;">
            stadia_controller
          </span>
          <h2 class="text-xl font-bold leading-tight tracking-[-0.015em]">Game Portal</h2>
        </div>
        <div class="hidden sm:flex items-center gap-9">
          {links.map((link) => (
            <a
              key={link.href + link.label}
              class={`text-sm font-medium leading-normal ${link.active ? 'text-primary' : 'hover:text-primary'}`}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      <div class="flex flex-1 justify-end items-center gap-4">
        {userInfo ? (
          <div class="flex items-center gap-3">
            <span class="text-sm hidden md:inline">{userInfo.userName}</span>
            <div
              class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 bg-gradient-to-br from-primary to-purple-600"
              data-alt="User avatar"
            />
          </div>
        ) : (
          <a href="/login" class="text-sm font-medium hover:text-primary">
            Login
          </a>
        )}
        {children}
      </div>
    </header>
  );
};
