import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY, API_BASE_URL, REFRESH_TOKEN_KEY } from './constants';
import { logout, saveTokenToCookie } from './utils';
import { redirect } from 'next/navigation';

const BASE_URL = API_BASE_URL;

// Helper lấy token tự động tùy theo môi trường Server hay Client
async function getToken(): Promise<string | undefined> {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    // Dynamic import để tránh lỗi bundling khi chạy ở Client Component
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    return cookieStore.get(ACCESS_TOKEN_KEY)?.value;
  }

  // Phía trình duyệt (Client)
  return Cookies.get(ACCESS_TOKEN_KEY);
}

type CustomOptions = RequestInit & {
  baseUrl?: string;
};

let refreshQueue: ((token: string) => void)[] = [];
let isRefreshing = false;

const onResolveRefreshQueue = (token: string) => {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

export const httpRequest = {
  async request<T>(
    endpoint: string,
    options: CustomOptions = {}
  ): Promise<T> {
    const { baseUrl = BASE_URL, headers, ...restOptions } = options;

    // 1. Tự động lấy token
    const token = await getToken();

    // 2. Chuẩn bị headers mặc định
    const reqHeaders = new Headers(headers);
    if (!reqHeaders.has('Content-Type')) {
  reqHeaders.set('Content-Type', 'application/json');
}

if (token) {
  reqHeaders.set('authorization', `Bearer ${token}`);
}
    // const defaultHeaders: HeadersInit = {
    //   'Content-Type': 'application/json',
    //   ...(token ? { authorization: `Bearer ${token}` } : {}),
    //   ...headers,
    // };

    // Chuẩn hóa URL
    const url = baseUrl + endpoint;

    // 3. Thực hiện request
    const makeRequest = () => fetch(url, {
      headers: reqHeaders,
      ...restOptions,
    });
    let response = await makeRequest();

    // 4. Xử lý lỗi tập trung
    if (!response.ok) {
      if (response.status === 401 && typeof window !== "undefined") {
        if (!isRefreshing) {
          isRefreshing = true;


          try {
            const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                refreshToken: Cookies.get(REFRESH_TOKEN_KEY),
              }),
            });
            const isClient = typeof window !== "undefined";

            if (!res.ok && res.status === 401) {
              // Nếu refresh token cũng hết hạn, redirect về trang login
                logout();
              window.location.href = '/login';

            } else if (res.ok) {
              isRefreshing = false;;
              const data = await res.json();
              const newToken = data.accessToken;
              if (isClient) {
                saveTokenToCookie(newToken);
              }

              // Call request again
              reqHeaders.set('authorization', `Bearer ${newToken}`);
              response = await fetch(url, { headers: reqHeaders, ...restOptions });
              onResolveRefreshQueue(newToken);
            }
          } catch {
          }
        }
        else {
          const newToken = await new Promise<string>((resolve) => {
            refreshQueue.push(resolve);
          });
          reqHeaders.set('authorization', `Bearer ${newToken}`);
          response = await fetch(url, { headers: reqHeaders, ...restOptions });
        }
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Lỗi HTTP: ${response.status}`);
    }

    return response.json();
  },

  get<T>(endpoint: string, options?: CustomOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T, B=unknown>(endpoint: string, body: B, options?: CustomOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  put<T, B=unknown>(endpoint: string, body: B, options?: CustomOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  patch<T, B=unknown>(endpoint: string, body: B, options?: CustomOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string, options?: CustomOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};