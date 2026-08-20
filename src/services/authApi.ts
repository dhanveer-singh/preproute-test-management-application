import api from './api';

import type { LoginFormData } from '@/types/auth';

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: Record<string, unknown>;
  };
}

export const login = async (credentials: LoginFormData): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', credentials);

  return response.data;
};
