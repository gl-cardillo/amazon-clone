import { useSyncExternalStore } from "react";
import axios from "axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryClient,
} from "@tanstack/react-query";
import {
  clearToken,
  getTokenSnapshot,
  saveToken,
  subscribeToken,
} from "@/utils/storage";
import { TEST_ACCOUNT_EMAIL } from "@/utils/constants";
import type { LoginInput, ProfileInput, SignupInput } from "@/utils/schemas";
import type { User } from "@/types";

export const ME_KEY = ["me"];

interface AuthResponse {
  user: User;
  token: string;
}

// undefined until localStorage can be read, which is after hydration
export function useToken(): string | null | undefined {
  const raw = useSyncExternalStore(
    subscribeToken,
    getTokenSnapshot,
    () => undefined
  );
  if (raw === undefined) return undefined;
  return raw ? (JSON.parse(raw) as string) : null;
}

export function useMe() {
  const token = useToken();
  const query = useQuery({
    queryKey: ME_KEY,
    queryFn: async () => (await axios.get<User>("/api/user/me")).data,
    enabled: Boolean(token),
    staleTime: 60_000,
  });
  return {
    user: token ? (query.data ?? null) : null,
    // true while we can't tell yet whether someone is logged in
    isLoading: token === undefined || (Boolean(token) && query.isPending),
  };
}

function startSession(queryClient: QueryClient, { user, token }: AuthResponse) {
  saveToken(token);
  queryClient.setQueryData(ME_KEY, user);
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    // called without data by the test account button
    mutationFn: async (data?: LoginInput) =>
      (
        await axios.post<AuthResponse>(
          "/api/auth/login",
          data ?? { emailLogin: TEST_ACCOUNT_EMAIL }
        )
      ).data,
    onSuccess: (response) => startSession(queryClient, response),
  });
}

export function useSignup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SignupInput) =>
      (await axios.post<AuthResponse>("/api/auth/signup", data)).data,
    onSuccess: (response) => startSession(queryClient, response),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return () => {
    clearToken();
    // drop everything cached for this user
    queryClient.removeQueries();
  };
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ProfileInput) =>
      (await axios.put<User>("/api/user/updateProfile", data)).data,
    onSuccess: (user) => queryClient.setQueryData(ME_KEY, user),
  });
}

// the caller logs out after leaving any page that needs a user
export function useDeleteAccount() {
  return useMutation({
    mutationFn: () => axios.delete("/api/user/deleteAccount"),
  });
}

// message from the api, or a generic one when it sent none
export function errorMessage(error: unknown) {
  return (
    (axios.isAxiosError(error) && error.response?.data?.message) ||
    "Sorry, try again later"
  );
}
