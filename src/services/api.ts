import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import MESSAGES from '@/constants/messages';
import { getToken, removeToken } from '@/utils/storage';
import { showError } from '@/utils/toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,

  (error: AxiosError) => {
    if (!error.response) {
      showError(MESSAGES.API.NETWORK_ERROR);

      return Promise.reject(error);
    }

    const status = error.response.status;

    const responseData = error.response.data as {
      message?: string;
      errors?: {
        fieldErrors?: Record<string, string[]>;
      };
    };

    if (status === 401) {
      removeToken();

      showError(responseData.message || MESSAGES.AUTH.SESSION_EXPIRED);

      return Promise.reject(error);
    }

    if (status >= 500) {
      showError(responseData.message || MESSAGES.API.SERVER_ERROR);

      return Promise.reject(error);
    }

    if (status >= 400) {
      const hasFieldErrors =
        responseData.errors?.fieldErrors && Object.keys(responseData.errors.fieldErrors).length > 0;

      if (!hasFieldErrors) {
        showError(responseData.message || MESSAGES.API.GENERIC_ERROR);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
