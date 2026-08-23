/* =========================================================
   LOGIN REQUEST
========================================================= */

export interface LoginPayload {
  userId: string;
  password: string;
}

/* =========================================================
   LOGIN FORM DATA
========================================================= */

export interface LoginFormData {
  userId: string;
  password: string;
}

/* =========================================================
   LOGIN USER
========================================================= */

export interface LoginUser {
  id?: string | number;
  userId?: string;
  name?: string;
  email?: string;
  [key: string]: unknown;
}

/* =========================================================
   LOGIN RESPONSE DATA
========================================================= */

export interface LoginResponseData {
  token: string;
  user: LoginUser;
}

/* =========================================================
   LOGIN API RESPONSE
========================================================= */

export interface LoginResponse {
  success?: boolean;
  status?: string;
  data: LoginResponseData;
  message: string;
}
