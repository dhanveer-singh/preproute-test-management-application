import { z } from 'zod';

export const loginSchema = z.object({
  userId: z.string().trim().min(1, 'User ID is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export interface LoginUser {
  [key: string]: unknown;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: LoginUser;
  };
}
