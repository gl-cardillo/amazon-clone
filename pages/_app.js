import "../styles/globals.css";
import Layout from "../components/Layout";
import { UserContext, CurrencyContext } from "../utils/context";
import { useState, useEffect } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const [currencySymbol, setCurrencySymbol] = useState("£");
  const [currencyRate, setCurrencyRate] = useState(1);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_amazon_lc"));
    const token = JSON.parse(localStorage.getItem("token_amazon_lc"));
    if (user && token) {
      setUser(user);
      axios.defaults.headers.Authorization = `Bearer ${token}`;
    }

    //   localStorage.clear();
    //    setUser(null)
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
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
