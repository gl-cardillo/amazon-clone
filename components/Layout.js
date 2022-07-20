import Head from "next/head";
import Navbar from "./Navbar";

export default function Layout({ children}) {
  return (
    <>
      <Head>
        <title>Amazon</title>
        <link rel="icon" href="amazon_icon.ico" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
