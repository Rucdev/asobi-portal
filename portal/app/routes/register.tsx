// app/routes/register.tsx
import { createRoute } from 'honox/factory';
import RegisterForm from '../islands/RegisterForm';

export default createRoute((c) => {
  return c.render(
    <div class="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <title>新規登録</title>
      <div class="max-w-md w-full space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold text-white">
            新規登録
          </h2>
          <p class="mt-2 text-center text-sm text-gray-400">
            既にアカウントをお持ちの方は{' '}
            <a href="/login" class="font-medium text-blue-500 hover:text-blue-400">
              ログイン
            </a>
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
});
