// app/lib/api.ts

/** APIエラーレスポンスの型 */
export type ApiError = {
  error: string;
};

/** APIレスポンスの型ガード */
export function isApiError(data: unknown): data is ApiError {
  return (
    typeof data === 'object' &&
    data !== null &&
    'error' in data &&
    typeof (data as ApiError).error === 'string'
  );
}

/** 成功レスポンスかエラーレスポンスかを判定して返す */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

/** fetchのラッパー関数 */
export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    const data: unknown = await response.json();

    if (!response.ok) {
      if (isApiError(data)) {
        return { ok: false, error: data.error };
      }
      return { ok: false, error: `エラーが発生しました (${response.status})` };
    }

    return { ok: true, data: data as T };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : '通信エラーが発生しました',
    };
  }
}

/** POST用の便利関数 */
export function apiPost<T>(url: string, body: unknown): Promise<ApiResult<T>> {
  return apiFetch<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/** PUT用の便利関数 */
export function apiPut<T>(url: string, body: unknown): Promise<ApiResult<T>> {
  return apiFetch<T>(url, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/** DELETE用の便利関数 */
export function apiDelete<T>(url: string): Promise<ApiResult<T>> {
  return apiFetch<T>(url, {
    method: 'DELETE',
  });
}
