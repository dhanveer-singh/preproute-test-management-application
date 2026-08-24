import axios, { AxiosError } from 'axios';

import { getToken, removeToken } from '@/utils/storage';

import type { ApiErrorResponse, AppError } from '@/types/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',

  headers: {
    'Content-Type': 'application/json',
  },
});

/* =========================================================
   REQUEST INTERCEPTOR
========================================================= */

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error: AxiosError<ApiErrorResponse>) => {
    /* =====================================================
       NETWORK ERROR
    ===================================================== */

    if (!error.response) {
      const appError: AppError = {
        message: 'Unable to connect to the server. Please try again.',
      };

      return Promise.reject(appError);
    }

    const statusCode = error.response.status;
    const responseData = error.response.data;

    /* =====================================================
       401 - UNAUTHORIZED
    ===================================================== */

    if (statusCode === 401) {
      removeToken();
    }

    /* =====================================================
       DEFAULT BACKEND MESSAGE
    ===================================================== */

    let message = responseData?.message || 'Something went wrong. Please try again.';

    /* =====================================================
       VALIDATION ERROR

       Backend:

       {
         "status": "error",
         "message": "Validation failed",
         "errors": [
           {
             "msg": "A test with this name already exists..."
           }
         ]
       }
    ===================================================== */

    if (Array.isArray(responseData?.errors) && responseData.errors.length > 0) {
      const firstError = responseData.errors.find(
        (item) => typeof item?.msg === 'string' && item.msg.length > 0,
      );

      if (firstError?.msg) {
        message = firstError.msg;
      }
    }

    /* =====================================================
       NORMALIZED ERROR
    ===================================================== */

    const appError: AppError = {
      message,
      statusCode,
      errors: responseData?.errors,
    };

    return Promise.reject(appError);
  },
);

export default api;
