import type { Child } from 'hono/jsx';

interface CardProps {
  title?: string;
  imageUrl?: string | null;
  tags?: string[];
  rating?: number | null;
  reviewCount?: number;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  children?: Child;
  onClick?: () => void;
}

export const Card = ({
  title,
  imageUrl,
  tags,
  rating,
  reviewCount,
  actionLabel,
  actionHref,
  className,
  children,
  onClick,
}: CardProps) => {
  const backgroundStyle = imageUrl
    ? `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 60%), url("${imageUrl}")`
    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';

  return (
    <div
      class={`group relative bg-cover bg-center flex flex-col rounded-xl overflow-hidden shadow-lg hover:shadow-primary/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${className || ''}`}
      style={`background-image: ${backgroundStyle}; aspect-ratio: 4/5;`}
      onClick={onClick}
    >
      <div class="flex flex-col justify-end p-4 h-full">
        {title && (
          <p class="text-white text-lg font-bold leading-tight line-clamp-2 mb-1">
            {title}
          </p>
        )}
        {tags && tags.length > 0 && (
          <div class="flex gap-1 mb-2 flex-wrap">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                class="text-xs px-2 py-0.5 bg-white/20 rounded-full text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        {rating !== null && rating !== undefined && (
          <div class="flex items-center gap-1 mb-3">
            <span class="material-symbols-outlined text-yellow-400 text-sm">star</span>
            <span class="text-white text-sm">
              {rating.toFixed(1)} ({reviewCount || 0})
            </span>
          </div>
        )}
        {actionLabel && actionHref && (
          <a
            href={actionHref}
            target="_blank"
            rel="noopener noreferrer"
            class="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary/80 transition-colors text-center"
          >
            {actionLabel}
          </a>
        )}
        {children}
      </div>
    </div>
  );
};
