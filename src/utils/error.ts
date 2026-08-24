import type { AppError } from '@/types/api';

export const getErrorMessage = (
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string => {
  if (typeof error === 'object' && error !== null && 'message' in error) {
    const appError = error as AppError;

    if (typeof appError.message === 'string' && appError.message.length > 0) {
      return appError.message;
    }
  }

  return fallback;
};
