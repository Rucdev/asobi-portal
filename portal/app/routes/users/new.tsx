// app/routes/users/new.tsx
import { createRoute } from 'honox/factory';
import { Header, Footer, Button, BackButton } from '@/app/components';

export default createRoute((c) => {
  return c.render(
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>新規ユーザー作成 - Portal</title>
        <link rel="stylesheet" href="/app/style.css" />
      </head>
      <body class="bg-gray-900 text-white min-h-screen">
        <Header />

        <main class="container mx-auto px-4 py-8 max-w-2xl">
          {/* ヘッダーセクション */}
          <div class="mb-8">
            <BackButton href="/users" />
            <h1 class="text-4xl font-bold mb-2">新規ユーザー作成</h1>
            <p class="text-gray-400">新しいユーザーを作成します</p>
          </div>

          {/* エラーメッセージ表示エリア */}
          <div id="error-message" class="hidden mb-6 bg-red-900/50 border border-red-600 text-red-200 rounded-lg p-4">
          </div>

          {/* フォーム */}
          <div class="bg-gray-800 rounded-lg p-6">
            <form id="user-form">
              {/* 名前 */}
              <div class="mb-6">
                <label for="name" class="block text-sm font-medium mb-2">
                  名前 <span class="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  maxlength="100"
                  placeholder="山田太郎"
                  class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* メールアドレス */}
              <div class="mb-6">
                <label for="email" class="block text-sm font-medium mb-2">
                  メールアドレス <span class="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  maxlength="255"
                  placeholder="user@example.com"
                  class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* パスワード */}
              <div class="mb-6">
                <label for="password" class="block text-sm font-medium mb-2">
                  パスワード <span class="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minlength="8"
                  maxlength="100"
                  placeholder="8文字以上"
                  class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p class="text-gray-400 text-xs mt-1">
                  8文字以上で入力してください
                </p>
              </div>

              {/* パスワード確認 */}
              <div class="mb-6">
                <label for="password-confirm" class="block text-sm font-medium mb-2">
                  パスワード確認 <span class="text-red-500">*</span>
                </label>
                <input
                  id="password-confirm"
                  name="password-confirm"
                  type="password"
                  required
                  minlength="8"
                  maxlength="100"
                  placeholder="パスワードを再入力"
                  class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* ユーザータイプ */}
              <div class="mb-6">
                <label for="userType" class="block text-sm font-medium mb-2">
                  ユーザータイプ <span class="text-red-500">*</span>
                </label>
                <select
                  id="userType"
                  name="userType"
                  required
                  class="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">一般ユーザー</option>
                  <option value="admin">管理者</option>
                </select>
              </div>

              {/* ボタン */}
              <div class="flex gap-4">
                <button
                  type="submit"
                  id="submit-button"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  作成する
                </button>
                <a
                  href="/users"
                  class="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  キャンセル
                </a>
              </div>
            </form>
          </div>
        </main>

        <Footer />

        {/* フォーム送信処理のスクリプト */}
        <script dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('user-form').addEventListener('submit', async (e) => {
              e.preventDefault();

              const errorDiv = document.getElementById('error-message');
              const submitButton = document.getElementById('submit-button');

              // パスワード確認
              const password = document.getElementById('password').value;
              const passwordConfirm = document.getElementById('password-confirm').value;

              if (password !== passwordConfirm) {
                errorDiv.textContent = 'パスワードが一致しません';
                errorDiv.classList.remove('hidden');
                return;
              }

              // フォームデータ取得
              const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: password,
                userType: document.getElementById('userType').value
              };

              // 送信ボタンを無効化
              submitButton.disabled = true;
              submitButton.textContent = '作成中...';
              errorDiv.classList.add('hidden');

              try {
                const response = await fetch('/api/users', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(formData),
                });

                if (response.ok) {
                  window.location.href = '/users';
                } else {
                  const error = await response.json();
                  errorDiv.textContent = error.error || 'ユーザー作成に失敗しました';
                  errorDiv.classList.remove('hidden');
                  submitButton.disabled = false;
                  submitButton.textContent = '作成する';
                }
              } catch (error) {
                errorDiv.textContent = 'ネットワークエラーが発生しました';
                errorDiv.classList.remove('hidden');
                submitButton.disabled = false;
                submitButton.textContent = '作成する';
              }
            });
          `
        }} />
      </body>
    </html>
  );
});
