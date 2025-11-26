// app/routes/users/index.tsx
import { createRoute } from 'honox/factory';
import { usersService } from '@/lib/services/users';
import { Header, Footer, Button, Badge } from '@/app/components';

export default createRoute(async (c) => {
  const page = Number(c.req.query('page') || 1);
  const search = c.req.query('search') || '';
  const userType = c.req.query('userType') as 'admin' | 'user' | undefined;

  const { users, total, totalPages } = await usersService.list({
    page,
    limit: 20,
    search,
    userType,
  });

  return c.render(
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>ユーザー管理 - Portal</title>
        <link rel="stylesheet" href="/app/style.css" />
      </head>
      <body class="bg-gray-900 text-white min-h-screen">
        <Header />

        <main class="container mx-auto px-4 py-8">
          {/* ヘッダーセクション */}
          <div class="flex justify-between items-center mb-8">
            <div>
              <h1 class="text-4xl font-bold mb-2">ユーザー管理</h1>
              <p class="text-gray-400">
                合計 {total} 人のユーザー
              </p>
            </div>
            <a href="/users/new">
              <Button variant="primary" size="md">
                新規ユーザー作成
              </Button>
            </a>
          </div>

          {/* 検索・フィルターセクション */}
          <div class="bg-gray-800 rounded-lg p-6 mb-6">
            <form method="GET" action="/users" class="flex gap-4 items-end">
              <div class="flex-1">
                <label for="search" class="block text-sm font-medium mb-2">
                  検索
                </label>
                <input
                  id="search"
                  name="search"
                  type="text"
                  value={search}
                  placeholder="名前またはメールアドレスで検索..."
                  class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div class="w-48">
                <label for="userType" class="block text-sm font-medium mb-2">
                  ユーザータイプ
                </label>
                <select
                  id="userType"
                  name="userType"
                  class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">全て</option>
                  <option value="admin" selected={userType === 'admin'}>
                    管理者
                  </option>
                  <option value="user" selected={userType === 'user'}>
                    一般ユーザー
                  </option>
                </select>
              </div>
              <button
                type="submit"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
              >
                検索
              </button>
              {(search || userType) && (
                <a
                  href="/users"
                  class="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded-lg transition"
                >
                  リセット
                </a>
              )}
            </form>
          </div>

          {/* ユーザー一覧テーブル */}
          {users.length === 0 ? (
            <div class="bg-gray-800 rounded-lg p-12 text-center">
              <p class="text-gray-400 text-lg">ユーザーが見つかりませんでした</p>
            </div>
          ) : (
            <div class="bg-gray-800 rounded-lg overflow-hidden">
              <table class="w-full">
                <thead class="bg-gray-700">
                  <tr>
                    <th class="px-6 py-4 text-left text-sm font-semibold">名前</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold">メールアドレス</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold">ユーザータイプ</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold">作成日</th>
                    <th class="px-6 py-4 text-right text-sm font-semibold">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                  {users.map((user, index) => (
                    <tr
                      key={user.id}
                      class={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}
                    >
                      <td class="px-6 py-4">
                        <div class="font-medium">{user.name}</div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-gray-300">{user.email}</div>
                      </td>
                      <td class="px-6 py-4">
                        {user.userType === 'admin' ? (
                          <span class="inline-block bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            管理者
                          </span>
                        ) : (
                          <span class="inline-block bg-gray-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                            一般
                          </span>
                        )}
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-gray-400 text-sm">
                          {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                        </div>
                      </td>
                      <td class="px-6 py-4 text-right">
                        <div class="flex gap-2 justify-end">
                          <a
                            href={`/users/${user.id}/edit`}
                            class="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded transition"
                          >
                            編集
                          </a>
                          <button
                            onclick={`if(confirm('本当に削除しますか?')) fetch('/api/users/${user.id}', {method: 'DELETE'}).then(() => window.location.reload())`}
                            class="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-1.5 rounded transition"
                          >
                            削除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ページネーション */}
          {totalPages > 1 && (
            <div class="flex justify-center gap-2 mt-8">
              {page > 1 && (
                <a
                  href={`/users?page=${page - 1}${search ? `&search=${search}` : ''}${userType ? `&userType=${userType}` : ''}`}
                  class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                >
                  ← 前へ
                </a>
              )}
              <div class="bg-gray-800 text-white px-4 py-2 rounded">
                {page} / {totalPages}
              </div>
              {page < totalPages && (
                <a
                  href={`/users?page=${page + 1}${search ? `&search=${search}` : ''}${userType ? `&userType=${userType}` : ''}`}
                  class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
                >
                  次へ →
                </a>
              )}
            </div>
          )}
        </main>

        <Footer />
      </body>
    </html>
  );
});
