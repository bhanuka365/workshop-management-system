import axios, { AxiosError } from 'axios';

const STORAGE_KEY = 'workshop_auth';
export const AUTH_ERROR_KEY = 'workshop_auth_error';

// Set to false once the problem is fixed
const DEBUG = true;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8085/api/v1',
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    const { token } = JSON.parse(raw);
    const cleanToken = String(token).replace(/^Bearer\s+/i, '').trim();
    config.headers.Authorization = `Bearer ${cleanToken}`;
  }

  if (DEBUG) {
    console.log(
      '[API REQUEST]',
      config.method?.toUpperCase(),
      `${config.baseURL}${config.url}`,
      '| Authorization:',
      String(config.headers.Authorization ?? 'MISSING').slice(0, 30) + '...',
      '| body:',
      config.data
    );
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<{ message?: string }>) => {
    if (DEBUG) {
      console.error(
        '[API ERROR]',
        error.config?.method?.toUpperCase(),
        error.config?.url,
        '| status:',
        error.response?.status,
        '| response:',
        error.response?.data
      );
    }

    const isLogin = error.config?.url?.includes('/login');
    if (error.response?.status === 401 && !isLogin && !DEBUG) {
      const reason = error.response.data?.message ?? 'Your session is no longer valid.';
      sessionStorage.setItem(AUTH_ERROR_KEY, reason);
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(err: unknown, fallback = 'Something went wrong'): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data;

    if (!err.response) return 'Cannot reach the server.';
    if (typeof data === 'string' && data) return `[${status}] ${data}`;
    if (data?.message) return `[${status}] ${data.message}`;
    if (status === 401) return '[401] Not authenticated. Log out and log in again.';
    if (status === 403) return '[403] You do not have permission to do that.';
    if (status === 400) return '[400] The server rejected the data you entered.';
    if (status && status >= 500) return `[${status}] Server error. Check the backend console.`;
  }
  return fallback;
}

export { STORAGE_KEY };