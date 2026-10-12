import type { User } from "@/types";

export const TOKEN_KEY = "token_amazon_lc";
export const USER_KEY = "user_amazon_lc";

function read<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  return value ? (JSON.parse(value) as T) : null;
}

export const readToken = () => read<string>(TOKEN_KEY);
export const readUser = () => read<User>(USER_KEY);

export function saveUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function saveSession(user: User, token: string) {
  saveUser(user);
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
