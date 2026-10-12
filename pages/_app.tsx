import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import axios from "axios";
import {
  UserContext,
  CurrencyContext,
  type CurrencySymbol,
} from "../utils/context";
import { clearSession, readToken, readUser } from "../utils/storage";
import { useState, useEffect } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import type { User } from "@/types";

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
      clearSession();
      // full reload so no logged-in state survives
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/signin");
    }
    return Promise.reject(error);
  });
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState<CurrencySymbol>("£");
  const [currencyRate, setCurrencyRate] = useState(1);

  // localStorage is only readable after hydration
  useEffect(() => {
    const user = readUser();
    if (user && readToken()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(user);
    }
    setAuthReady(true);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, authReady }}>
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
    </UserContext.Provider>
  );
}
