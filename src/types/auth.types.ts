export interface User {
  id: string;
  name: string | null;
  phone: string;
  createdAt?: string;
}

export interface AuthTokenPayload {
  token: string;
  user: User;
}

export interface LoginRequest {
  phone: string;
}

export interface VerifyOTPRequest {
  phone: string;
  otp: string;
}
