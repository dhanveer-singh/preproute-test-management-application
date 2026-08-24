export type ApiStatus = 'success' | 'error';

export interface ApiResponse<T> {
  status: ApiStatus;
  message: string;
  data: T;
}

export interface ApiErrorItem {
  type?: string;
  value?: unknown;
  msg?: string;
  path?: string;
  location?: string;
}

export interface ApiErrorResponse {
  status?: string;
  message?: string;
  errors?: ApiErrorItem[];
}

export interface AppError {
  message: string;
  statusCode?: number;
  errors?: ApiErrorItem[];
}
