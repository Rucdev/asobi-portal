import SearchInput from './SearchInput'
import Button from './Button'

interface NavItem {
  href: string
  label: string
}

interface HeaderProps {
  navItems?: NavItem[]
}

const defaultNavItems: NavItem[] = [
  { href: '/games', label: 'ゲーム' },
  { href: '/users', label: 'ユーザー' },
]

export default function Header({ navItems = defaultNavItems }: HeaderProps) {
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
            <Button variant="accent" size="sm">
              アカウント
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
