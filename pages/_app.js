import "../styles/globals.css";
import Layout from "../components/Layout";
import { UserContext } from "../utils/userContext";
import { useState, useEffect } from "react";
import { SkeletonTheme } from "react-loading-skeleton";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user_amazon_lc")));
    //   localStorage.clear();
    //    setUser(null)
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <SkeletonTheme highlightColor="#979797">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SkeletonTheme>
    </UserContext.Provider>
  );
}

export default MyApp;
