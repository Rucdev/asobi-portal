import SearchInput from './SearchInput'
import Button from './Button'
import LogoutButton from '../islands/LogoutButton'

interface NavItem {
  href: string
  label: string
}

interface User {
  id: string
  name: string
  userType: 'admin' | 'user'
}

interface HeaderProps {
  navItems?: NavItem[]
  user?: User
}

const defaultNavItems: NavItem[] = [
  { href: '/games', label: 'ゲーム' },
  { href: '/users', label: 'ユーザー' },
]

export default function Header({ navItems = defaultNavItems, user }: HeaderProps) {
  return (
    <header class="bg-gray-800 shadow-lg sticky top-0 z-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          {/* ロゴ/サイト名 */}
          <div class="flex-shrink-0">
            <a href="/">
              <span class="text-3xl font-extrabold text-blue-400">
                GAME<span class="text-white">PORTAL</span>
              </span>
            </a>
          </div>

          {/* メインナビゲーション */}
          <nav class="hidden md:flex space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <a
                href={item.href}
                class="text-gray-300 hover:text-blue-400 transition duration-150 p-2 rounded-lg"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* 検索とユーザー */}
          <div class="flex items-center space-x-4">
            <div class="hidden sm:block">
              <SearchInput />
            </div>
            {user ? (
              <div class="flex items-center space-x-3">
                <span class="text-gray-300 text-sm">
                  {user.name}
                  {user.userType === 'admin' && (
                    <span class="ml-1 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded">
                      管理者
                    </span>
                  )}
                </span>
                <LogoutButton />
              </div>
            ) : (
              <a href="/login">
                <Button variant="accent" size="sm">
                  ログイン
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
