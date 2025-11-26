interface BackButtonProps {
  href: string
  label?: string
}

export default function BackButton({ href, label = '戻る' }: BackButtonProps) {
  return (
    <a
      href={href}
      class="text-blue-400 hover:text-blue-300 mb-6 flex items-center text-sm font-semibold transition duration-150 inline-flex"
    >
      <svg
        class="w-4 h-4 mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      {label}
    </a>
  )
}
