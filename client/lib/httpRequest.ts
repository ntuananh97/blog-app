import Cookies from 'js-cookie';
import { ACCESS_TOKEN_KEY, API_BASE_URL, REFRESH_TOKEN_KEY } from './constants';
import { logout, saveTokenToCookie } from './utils';

const BASE_URL = API_BASE_URL;

// Các endpoint auth không được kích hoạt cơ chế refresh token
// (vd: login sai mật khẩu cũng trả 401 nhưng không phải do token hết hạn)
const AUTH_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/refresh-token'];

export class HttpError extends Error {
  status: number;
  data: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

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

// Promise refresh dùng chung: nhiều request 401 đồng thời chỉ gọi refresh 1 lần,
// tất cả cùng chờ kết quả (thành công -> token mới, thất bại -> cùng bị reject).
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: Cookies.get(REFRESH_TOKEN_KEY) }),
  });

  if (!res.ok) {
    throw new HttpError(res.status, 'Phiên đăng nhập đã hết hạn');
  }

  const data = await res.json();
  const newToken: string = data.accessToken;
  saveTokenToCookie(newToken);
  return newToken;
}

function getRefreshedToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken()
      .catch((error) => {
        // Refresh thất bại: xóa phiên và đưa về trang login
        logout();
        window.location.href = '/login';
        throw error;
      })
      .finally(() => {
        refreshPromise = null; // luôn reset, tránh kẹt trạng thái
      });
  }
  return refreshPromise;
}

async function parseBody<T>(response: Response): Promise<T> {
  // 204 No Content hoặc body rỗng (vd: DELETE)
  if (response.status === 204) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
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
    // FormData cần để trình duyệt tự set Content-Type (kèm boundary)
    const isFormData = typeof FormData !== 'undefined' && restOptions.body instanceof FormData;
    if (!reqHeaders.has('Content-Type') && !isFormData) {
      reqHeaders.set('Content-Type', 'application/json');
    }
    if (token) {
      reqHeaders.set('authorization', `Bearer ${token}`);
    }

    // Chuẩn hóa URL
    const url = baseUrl + endpoint;

    // 3. Thực hiện request
    const makeRequest = () => fetch(url, {
      ...restOptions,
      headers: reqHeaders,
    });
    let response = await makeRequest();

    // 4. Token hết hạn (chỉ refresh được ở Client): refresh rồi gọi lại request
    const canRefresh =
      response.status === 401 &&
      typeof window !== 'undefined' &&
      !AUTH_ENDPOINTS.some((path) => endpoint.startsWith(path));

    if (canRefresh) {
      // Nếu request khác đã refresh xong trong lúc request này đang bay, dùng luôn token mới
      const currentToken = Cookies.get(ACCESS_TOKEN_KEY);
      const newToken =
        currentToken && currentToken !== token
          ? currentToken
          : await getRefreshedToken();

      reqHeaders.set('authorization', `Bearer ${newToken}`);
      response = await makeRequest();
    }

    // 5. Xử lý lỗi tập trung
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = Array.isArray(errorData.message)
        ? errorData.message.join(', ') // NestJS validation trả về mảng
        : errorData.message;
      throw new HttpError(
        response.status,
        message || `Lỗi HTTP: ${response.status}`,
        errorData
      );
    }

    return parseBody<T>(response);
  },

  get<T>(endpoint: string, options?: CustomOptions) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T, B=unknown>(endpoint: string, body: B, options?: CustomOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  put<T, B=unknown>(endpoint: string, body: B, options?: CustomOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  patch<T, B=unknown>(endpoint: string, body: B, options?: CustomOptions) {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string, options?: CustomOptions) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
