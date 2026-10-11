import "../styles/globals.css";
import Layout from "../components/Layout";
import axios from "axios";
import { UserContext, CurrencyContext } from "../utils/context";
import { useState, useEffect } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

// attach the saved token to every request
if (typeof window !== "undefined") {
  axios.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem("token_amazon_lc"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
}

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  // false until the user has been restored from localStorage
  const [authReady, setAuthReady] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState("£");
  const [currencyRate, setCurrencyRate] = useState(1);

  // localStorage is only readable after hydration
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_amazon_lc"));
    const token = JSON.parse(localStorage.getItem("token_amazon_lc"));
    if (user && token) {
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

export default MyApp;
