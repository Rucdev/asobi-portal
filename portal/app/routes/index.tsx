import { createRoute } from 'honox/factory'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default createRoute((c) => {
  const user = c.get('user')
  return c.render(
    <div class="min-h-screen bg-gray-900 text-gray-100">
      <title>ゲームポータル</title>
      <Header user={user} />
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="text-center py-12">
          <h1 class="text-4xl font-bold text-white mb-4">ゲームポータルへようこそ</h1>
          <p class="text-gray-400 mb-8">お気に入りのゲームを見つけましょう</p>
          <a
            href="/games"
            class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            ゲーム一覧を見る
          </a>
        </div>
      </main>
      <Footer copyrightText="GAMEPORTAL デモ" year={2025} />
    </div>
  )
})
