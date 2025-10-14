export type Role = "student" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  details?: any;
}

export interface CV {
  id: string;
  userId: string;
  title?: string;
  summary?: string;
  educations?: any[];
  experiences?: any[];
  skills?: string[];
  public?: boolean;
  createdAt?: string;
  updatedAt?: string;
}