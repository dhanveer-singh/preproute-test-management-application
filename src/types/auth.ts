import { z } from 'zod';

import type { ApiResponse } from './api';

export const loginSchema = z.object({
  userId: z.string().trim().min(1, 'User ID is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export interface LoginUser {
  id: string;
  userId: string;
  name: string;
  role: string;
  subrole: string;
  phone: string;
  joiningDate: string;
  endDate: string;
  lastActive: string;
  payment: boolean;
}

export interface LoginData {
  token: string;
  user: LoginUser;
}

export type LoginResponse = ApiResponse<LoginData>;
