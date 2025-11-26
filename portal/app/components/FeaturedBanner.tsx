import Button from './Button'

interface FeaturedBannerProps {
  title: string
  subtitle: string
  description: string
  price: number
  imageUrl: string
  onPurchase?: () => void
}

export default function FeaturedBanner({
  title,
  subtitle,
  description,
  price,
  imageUrl,
  onPurchase
}: FeaturedBannerProps) {
  return (
    <div class="bg-gray-700 rounded-xl shadow-2xl overflow-hidden hover:shadow-blue-500/50 transition duration-500">
      <div class="grid grid-cols-1 md:grid-cols-3">
        {/* イメージエリア */}
        <div class="md:col-span-2 relative">
          <img src={imageUrl} alt={title} class="w-full h-full object-cover" />
          <div class="absolute bottom-0 left-0 bg-gradient-to-t from-gray-900 to-transparent w-full h-1/2" />
        </div>

        {/* 詳細エリア */}
        <div class="p-6 md:p-8 md:col-span-1 flex flex-col justify-center">
          <h1 class="text-3xl font-extrabold mb-2 text-white">{title}</h1>
          <p class="text-blue-400 font-semibold mb-4">{subtitle}</p>
          <p class="text-gray-300 text-sm mb-6 line-clamp-3">{description}</p>
          <div class="flex items-center space-x-4">
            <span class="text-3xl font-bold text-green-400">¥ {price.toLocaleString()}</span>
            <Button variant="primary" size="lg" onClick={onPurchase}>
              購入
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
