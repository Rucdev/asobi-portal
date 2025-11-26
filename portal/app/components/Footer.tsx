interface FooterProps {
  copyrightText?: string
  year?: number
  links?: Array<{ href: string; label: string }>
}

export default function Footer({
  copyrightText = 'GAMEPORTAL',
  year = new Date().getFullYear(),
  links = [{ href: '/privacy', label: 'プライバシーポリシー' }]
}: FooterProps) {
  return (
    <footer class="bg-gray-900 mt-12 py-6 text-center text-gray-500 text-sm">
      <p>
        &copy; {year} {copyrightText}. All rights reserved.
        {links.map((link, index) => (
          <>
            {' | '}
            <a href={link.href} class="text-blue-400 hover:underline">
              {link.label}
            </a>
          </>
        ))}
      </p>
    </footer>
  )
}
