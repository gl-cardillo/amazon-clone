import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { BsSearch, BsCart2 } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";
import { useMe } from "../hooks/useAuth";
import { useProductSearch } from "../hooks/useProductSearch";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

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

  // one form per layout, only the visible one is in the accessibility tree
  const searchForm = (className: string) => (
    <form
      className={`relative flex ${className}`}
      onBlur={blur}
      onSubmit={submitSearch}
    >
      <input
        type="text"
        aria-label="Search products"
        className="h-10 w-full rounded-l-md border-input bg-surface px-3 text-foreground focus:border-primary focus:ring-primary"
        value={query}
        onChange={handleSearch}
      />
      <button
        type="submit"
        aria-label="Search"
        className="flex h-10 items-center rounded-r-md bg-primary px-3 text-primary-foreground hover:bg-primary-hover"
      >
        <BsSearch />
      </button>
      {showSearch && (
        <div
          role="group"
          aria-label="Search suggestions"
          className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-md border border-border bg-surface shadow-lg"
        >
          {search.slice(0, 4).map(({ product }) => {
            return (
              <Link key={product._id} href={`/product/${product._id}`}>
                <div
                  onClick={clearSearch}
                  className="flex items-center gap-2 px-2 py-3 hover:bg-muted"
                >
                  <Image
                    src={product.picUrl}
                    width={30}
                    height={40}
                    className="hidden h-10 min-w-7.5 rounded-sm bg-white object-contain sm:block"
                    alt={product.name}
                  />
                  <p className="overflow-hidden text-xs font-semibold whitespace-nowrap">
                    {product.name}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </form>
  );

  return (
    <header className="fixed z-10 w-full border-b border-border bg-surface">
      <div className="flex h-14 items-center justify-between gap-3 px-4 md:h-16 md:px-5">
        <Link href="/">
          <Logo className="h-9 w-auto" />
        </Link>
        {searchForm("hidden md:flex md:w-90 lg:w-100")}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            href={user ? "/profile" : "/signin"}
            aria-label={user ? "Account" : "Sign in"}
          >
            <AiOutlineUser className="text-2xl text-foreground" />
          </Link>
          <div className="relative">
            <Link
              href="/cart"
              aria-label={
                cartQuantity > 0 ? `Cart, ${cartQuantity} items` : "Cart"
              }
            >
              <BsCart2 className="text-2xl text-foreground" />
            </Link>
            {cartQuantity > 0 && (
              <p
                aria-hidden="true"
                className="absolute -top-2 -right-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground"
              >
                {cartQuantity}
              </p>
            )}
          </div>
        </div>
      </div>
      {searchForm("mx-4 mb-3 md:hidden")}
    </header>
  );
}
