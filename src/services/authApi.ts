import api from './api';

import APIS from '@/constants/apiRoutes';
import type { LoginFormData, LoginResponse } from '@/types/auth';

export const login = async (credentials: LoginFormData): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(APIS.AUTH.LOGIN, credentials);

  return response.data;
};
