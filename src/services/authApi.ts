import APIS from '@/constants/apiRoutes';
import api from '@/services/api';

import type { LoginPayload, LoginResponse } from '@/types/auth';

/* =========================================================
   LOGIN
========================================================= */

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(APIS.AUTH.LOGIN, payload);

  return response.data;
};
