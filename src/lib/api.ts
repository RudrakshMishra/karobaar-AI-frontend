import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  withCredentials: true,
});

let globalToken = "";
let tokenResolver: ((token: string) => void) | null = null;
let tokenPromise: Promise<string> | null = new Promise(resolve => {
  tokenResolver = resolve;
});

export const setGlobalToken = (token: string) => {
  globalToken = token;
  if (tokenResolver) {
    tokenResolver(token);
    tokenResolver = null; // Only resolve once
  }
};

// Attach Clerk JWT to every request
api.interceptors.request.use(async (config) => {
  let token = globalToken;
  if (!token && tokenPromise) {
    // Wait for the initial token fetch
    // Timeout after 2 seconds to prevent hanging if clerk fails
    token = await Promise.race([
      tokenPromise,
      new Promise<string>(r => setTimeout(() => r(""), 2000))
    ]);
  }
  
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== 'undefined') {
        // Clerk handles redirect via component or middleware usually
        // But as a fallback we can reload or redirect
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
