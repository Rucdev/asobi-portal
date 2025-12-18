// app/components/AdminOnly.tsx
import type { Child } from 'hono/jsx';

type User = {
  id: string;
  name: string;
  userType: 'admin' | 'user';
  createdAt: Date;
  updatedAt: Date;
};

type AdminOnlyProps = {
  user: User | undefined;
  children: Child;
  fallback?: Child;
};

/**
 * 管理者のみにコンテンツを表示するユーティリティコンポーネント
 *
 * @param user - 現在のユーザー情報
 * @param children - 管理者の場合に表示するコンテンツ
 * @param fallback - 管理者でない場合に表示するコンテンツ（オプション）
 */
export default function AdminOnly({ user, children, fallback }: AdminOnlyProps) {
  if (user?.userType === 'admin') {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
}
