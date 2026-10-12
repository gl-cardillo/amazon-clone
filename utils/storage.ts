const TOKEN_KEY = "token_amazon_lc";
// the user used to be cached here too, remove it when we touch the token
const LEGACY_USER_KEY = "user_amazon_lc";

const listeners = new Set<() => void>();

// lets useSyncExternalStore react to login and logout, also across tabs
export function subscribeToken(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// raw string so the snapshot stays referentially stable
export const getTokenSnapshot = () => localStorage.getItem(TOKEN_KEY);

export function readToken(): string | null {
  const raw = getTokenSnapshot();
  return raw ? (JSON.parse(raw) as string) : null;
}

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
  localStorage.removeItem(LEGACY_USER_KEY);
  listeners.forEach((listener) => listener());
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LEGACY_USER_KEY);
  listeners.forEach((listener) => listener());
}
