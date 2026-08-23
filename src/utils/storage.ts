import type { LoginUser } from '@/types/auth';

const TOKEN_KEY = 'preproute_token';
const USER_KEY = 'preproute_user';

/* =========================================================
   TOKEN
========================================================= */

export const setToken = (token: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
};

/* =========================================================
   USER
========================================================= */

export const setUser = (user: LoginUser): void => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = (): LoginUser | null => {
  const storedUser = sessionStorage.getItem(USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as LoginUser;
  } catch (error) {
    console.error('Failed to parse stored user:', error);

    return null;
  }
};

export const removeUser = (): void => {
  sessionStorage.removeItem(USER_KEY);
};

/* =========================================================
   CLEAR STORAGE
========================================================= */

export const clearStorage = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);

  sessionStorage.removeItem(USER_KEY);
};
