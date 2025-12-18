// app/routes/login.tsx
import { createRoute } from 'honox/factory';
import LoginForm from '../islands/LoginForm';

export default createRoute((c) => {
  return c.render(
    <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <title>ログイン</title>
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold text-white">
            ログイン
          </h2>
          <p class="mt-2 text-center text-sm text-gray-400">
            アカウントをお持ちでない方は{' '}
            <a href="/register" class="font-medium text-blue-500 hover:text-blue-400">
              新規登録
            </a>
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
});
