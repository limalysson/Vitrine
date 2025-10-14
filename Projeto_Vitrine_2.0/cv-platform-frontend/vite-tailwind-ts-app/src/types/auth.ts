import type { User } from "./index";

export interface RequestCodeResponse {
  success: boolean;
  message?: string;
  maskedEmail?: string;
}

export interface VerifyCodeResponse {
  token: string;
  user: User;
}