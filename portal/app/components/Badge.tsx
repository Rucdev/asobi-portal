import type { JSX } from 'hono/jsx'

type BadgeVariant = 'sale' | 'new' | 'free'

interface BadgeProps {
  variant: BadgeVariant
  text?: string
  class?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  sale: 'bg-red-600',
  new: 'bg-green-600',
  free: 'bg-blue-600'
}

const defaultText: Record<BadgeVariant, string> = {
  sale: 'SALE',
  new: '新作',
  free: '無料'
}

export default function Badge({ variant, text, class: className = '' }: BadgeProps) {
  const baseClasses = 'text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-md'
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`.trim()

  return (
    <span class={classes}>
      {text || defaultText[variant]}
    </span>
  )
}
