import { useState } from 'hono/jsx';
import { apiPost } from '../lib/api';

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);

    const result = await apiPost('/api/auth/logout', {});

    if (result.ok) {
      window.location.href = '/login';
    } else {
      console.error('Logout failed:', result.error);
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      class="text-gray-400 hover:text-white text-sm transition disabled:opacity-50"
    >
      {isLoading ? 'ログアウト中...' : 'ログアウト'}
    </button>
  );
}
