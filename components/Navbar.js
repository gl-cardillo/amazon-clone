import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../utils/context";
import { BsSearch, BsCart2 } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";

export default function Navbar() {
  // shared by the desktop and mobile inputs
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const router = useRouter();
  const { user } = useContext(UserContext);
  const cartQuantity = user
    ? user.cart.reduce((accum, cart) => accum + cart.quantity, 0)
    : 0;

  const trimmedQuery = query.toLowerCase().trim();
  const search =
    trimmedQuery === ""
      ? []
      : products.filter((product) =>
          product.name.toLowerCase().includes(trimmedQuery)
        );

  const clearSearch = () => {
    setQuery("");
    setShowSearch(false);
  };

  // delay so a suggestion click lands before the list closes
  const blur = () => {
    setTimeout(clearSearch, 200);
  };

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setShowSearch(e.target.value !== "");
  };

  const submitSearch = (e) => {
    e.preventDefault();
    if (trimmedQuery === "") return;
    router.push({ pathname: "/search", query: { q: query.trim() } });
    clearSearch();
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/api/product/all`);
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <div className="flex fixed flex-col w-full bg-[#131921] z-10">
      <div className="flex justify-between gap-3 px-3 md:px-5 pt-3 h-[50px] md:h-[60px]">
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
            className="hidden md:flex h-auto relative"
            onSubmit={submitSearch}
          >
            <input
              type="text"
              className="rounded-l h-[38px] p-1 focus:outline-none border-transparent focus:border-transparent focus:ring-0 md:w-[300px] lg:w-[350px]"
              value={query}
              onChange={handleSearch}
            />
            <button type="submit" aria-label="Search">
              <BsSearch className="rounded-r-md bg-orange-300 h-[38px] px-1.5 w-12 rounded-l-md p-2 font-bold absolute -right-1 top-0" />
            </button>
          </form>
          {showSearch && (
            <div className="z-10 absolute mt-[80px] -ml-[47%] w-[calc(95%-65px)] z-1 rounded-md  border-solid border-b-2 border-x-2 border-slate-200 sm:w-[calc(95%-55px)] sm:-ml-[48%] md:ml-[0%] md:-mt-[5px] md:w-[258px] lg:w-[308px]">
              {search.slice(0, 4).map((product, index) => {
                return (
                  <Link key={index} href={`/product/${product._id}`}>
                    <div
                      onClick={clearSearch}
                      className=" flex bg-white px-1 py-3 gap-2 items-center"
                    >
                      <img
                        src={product.picUrl}
                        className=" object-contain hidden sm:block min-w-[30px] h-[40px]"
                        alt="product"
                      />
                      <p className="whitespace-nowrap overflow-hidden text-xs font-semibold ">
                        {product.name}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex  gap-5 md:gap-5">
          <Link href={user ? "/profile" : "/signin"}>
            <AiOutlineUser className="text-white text-3xl" />
          </Link>
          <div>
            <Link href="/cart">
              <BsCart2 className="text-white text-3xl" />
            </Link>
            {cartQuantity > 0 && (
              <p className="text-bg-slate-900 bg-orange-300 h-[20px] w-[20px] flex items-center justify-center rounded-full absolute top-8 right-1.5 md:right-2.5">
                {cartQuantity}
              </p>
            )}
          </div>
        </div>
      </div>
      <form
        className="flex h-auto  py-1  self-center md:hidden w-full  px-5 relative"
        onBlur={blur}
        onSubmit={submitSearch}
      >
        <input
          type="text"
          className="rounded-lg h-[44px] w-full p-1 border-transparent focus:border-transparent focus:ring-0 "
          value={query}
          onChange={handleSearch}
        />
        <button type="submit" aria-label="Search">
          <BsSearch className="rounded-r-md bg-orange-300 h-[44px] px-1.5 w-12 rounded-l-md p-2 font-bold absolute right-4 top-[4px]" />
        </button>
      </form>
    </div>
  );
}
