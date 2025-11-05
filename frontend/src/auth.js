import { FRONTEND_ADMIN } from './config/auth.config';

export const AUTH_KEY = 'admin_token';

export const auth = {
  loginLocal(email, password) {
    const ok =
      (email || '').trim().toLowerCase() === FRONTEND_ADMIN.email.toLowerCase() &&
      (password || '').trim() === FRONTEND_ADMIN.password;
    if (!ok) return false;
    localStorage.setItem(AUTH_KEY, FRONTEND_ADMIN.token);
    return true;
  },
  logout() {
    localStorage.removeItem(AUTH_KEY);
  },
  isLoggedIn() {
    return localStorage.getItem(AUTH_KEY) === FRONTEND_ADMIN.token;
  },
  getToken() {
    return localStorage.getItem(AUTH_KEY);
  },
};