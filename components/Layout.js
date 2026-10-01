import Head from "next/head";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Shop clone</title>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Navbar className='pb-[100px]' />
      <main className='pt-[60px]'>{children}</main>
    </>
  );
}
