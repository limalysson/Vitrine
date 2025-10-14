import api from "./api";
import type { RequestCodeResponse, VerifyCodeResponse } from "../types/auth";

export async function requestLoginCode(email: string): Promise<RequestCodeResponse> {
  return api.post<RequestCodeResponse>("/auth/request-code", { email }).then((r) => r.data);
}

export async function verifyLoginCode(email: string, code: string): Promise<VerifyCodeResponse> {
  return api.post<VerifyCodeResponse>("/auth/verify-code", { email, code }).then((r) => r.data);
}