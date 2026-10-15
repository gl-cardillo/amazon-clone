import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CurrencyContext, type CurrencySymbol } from "../utils/context";
import { clearToken, readToken } from "../utils/storage";
import { useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

// attach the saved token to every request
if (typeof window !== "undefined") {
  axios.interceptors.request.use((config) => {
    const token = readToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  // an expired or old token logs the user out
  axios.interceptors.response.use(undefined, (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      readToken()
    ) {
      clearToken();
      // full reload so no logged-in state survives
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/signin");
    }
    return Promise.reject(error);
  });
}

// client errors won't succeed on a retry, server errors might
const shouldRetry = (failureCount: number, error: unknown) =>
  failureCount < 2 &&
  !(axios.isAxiosError(error) && (error.response?.status ?? 500) < 500);

export default function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({ defaultOptions: { queries: { retry: shouldRetry } } }),
  );
  const [currencySymbol, setCurrencySymbol] = useState<CurrencySymbol>("£");
  const [currencyRate, setCurrencyRate] = useState(1);

  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyContext.Provider
        value={{
          currencySymbol,
          setCurrencySymbol,
          currencyRate,
          setCurrencyRate,
        }}
      >
        <SkeletonTheme highlightColor="#979797">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </SkeletonTheme>
      </CurrencyContext.Provider>
    </QueryClientProvider>
  );
}
