import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { BsSearch, BsCart2 } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { useMe } from "../hooks/useAuth";
import { useProductSearch } from "../hooks/useProductSearch";

export default function Navbar() {
  // shared by the desktop and mobile inputs
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const router = useRouter();
  const { user } = useMe();
  const { data: results = [] } = useProductSearch(query);
  const cartQuantity = user
    ? user.cart.reduce((accum, cart) => accum + cart.quantity, 0)
    : 0;

  const trimmedQuery = query.trim();
  const search = trimmedQuery === "" ? [] : results;

  const clearSearch = () => {
    setQuery("");
    setShowSearch(false);
  };

  // delay so a suggestion click lands before the list closes
  const blur = () => {
    setTimeout(clearSearch, 200);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setShowSearch(e.target.value !== "");
  };

  const submitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (trimmedQuery === "") return;
    router.push({ pathname: "/search", query: { q: query.trim() } });
    clearSearch();
  };

  return (
    <div className="fixed z-10 flex w-full flex-col bg-[#131921]">
      <div className="flex h-[50px] justify-between gap-3 px-3 pt-3 md:h-[60px] md:px-5">
        <Link href="/" className="py-1">
          <Image
            src="/images/logo.svg"
            width={100}
            height={35}
            alt="logo"
            unoptimized
          />
        </Link>
        <div onBlur={blur}>
          <form
            className="relative hidden h-auto md:flex"
            onSubmit={submitSearch}
          >
            <input
              type="text"
              className="h-[38px] rounded-l border-transparent p-1 focus:border-transparent focus:outline-none focus:ring-0 md:w-[300px] lg:w-[350px]"
              value={query}
              onChange={handleSearch}
            />
            <button type="submit" aria-label="Search">
              <BsSearch className="absolute -right-1 top-0 h-[38px] w-12 rounded-l-md rounded-r-md bg-orange-300 p-2 px-1.5 font-bold" />
            </button>
          </form>
          {showSearch && (
            <div className="z-1 absolute z-10 -ml-[47%] mt-[80px] w-[calc(95%-65px)] rounded-md border-x-2 border-b-2 border-solid border-slate-200 sm:-ml-[48%] sm:w-[calc(95%-55px)] md:-mt-[5px] md:ml-[0%] md:w-[258px] lg:w-[308px]">
              {search.slice(0, 4).map(({ product }) => {
                return (
                  <Link key={product._id} href={`/product/${product._id}`}>
                    <div
                      onClick={clearSearch}
                      className="flex items-center gap-2 bg-white px-1 py-3"
                    >
                      <Image
                        src={product.picUrl}
                        width={30}
                        height={40}
                        className="hidden h-[40px] min-w-[30px] object-contain sm:block"
                        alt={product.name}
                      />
                      <p className="overflow-hidden whitespace-nowrap text-xs font-semibold">
                        {product.name}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex gap-5 md:gap-5">
          <Link href={user ? "/profile" : "/signin"}>
            <AiOutlineUser className="text-3xl text-white" />
          </Link>
          <div>
            <Link href="/cart">
              <BsCart2 className="text-3xl text-white" />
            </Link>
            {cartQuantity > 0 && (
              <p className="text-bg-slate-900 absolute right-1.5 top-8 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-orange-300 md:right-2.5">
                {cartQuantity}
              </p>
            )}
          </div>
        </div>
      </div>
      <form
        className="relative flex h-auto w-full self-center px-5 py-1 md:hidden"
        onBlur={blur}
        onSubmit={submitSearch}
      >
        <input
          type="text"
          className="h-[44px] w-full rounded-lg border-transparent p-1 focus:border-transparent focus:ring-0"
          value={query}
          onChange={handleSearch}
        />
        <button type="submit" aria-label="Search">
          <BsSearch className="absolute right-4 top-[4px] h-[44px] w-12 rounded-l-md rounded-r-md bg-orange-300 p-2 px-1.5 font-bold" />
        </button>
      </form>
    </div>
  );
}
