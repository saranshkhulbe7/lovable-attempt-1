import { api } from "@/lib/api";

export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
};

type AuthResponse = {
  message: string;
};

type MeResponse = {
  user: AuthUser;
};

export async function signup(credentials: AuthCredentials) {
  const { data } = await api.post<AuthResponse>(
    "/public/auth/signup",
    credentials,
  );

  return data;
}

export async function login(credentials: AuthCredentials) {
  const { data } = await api.post<AuthResponse>(
    "/public/auth/login",
    credentials,
  );

  return data;
}

export async function getMe() {
  const { data } = await api.get<MeResponse>("/external/auth/me");

  return data.user;
}

export async function logout() {
  const { data } = await api.post<AuthResponse>("/external/auth/logout");

  return data;
}
