import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../utils/context";
import { BsSearch, BsCart2 } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";

export default function Navbar() {
  const [search, setSearch] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const inputRef = useRef(null);
  const router = useRouter();
  const { user } = useContext(UserContext);

  function blur(input) {
    input.current.value = "";
    setTimeout(() => {
      setSearch([]);
      setShowSearch(false);
    }, 200);
  }

  function handleSearch(e) {
    if (e.target.value === "") {
      setSearch([]);
    } else {
      setShowSearch(true);
      const newSearch = products.filter((product) => {
        return product.name
          .toLowerCase()
          .trim()
          .includes(e.target.value.toLowerCase().trim());
      });
      setSearch(newSearch);
    }
  }
  useEffect(() => {
    if (user) {
      setCartQuantity(
        user.cart.reduce((accum, cart) => accum + cart.quantity, 0)
      );
    }
  }, [user]);

  useEffect(() => {
    const getData = async () => {
      const res = await axios.get(`http://localhost:3000/api/product/all`);
      setProducts(res.data);
    };
    getData();
  }, []);


  return (
    <div className="flex flex-col bg-[#131921]">
      <div className="flex justify-between gap-3 px-2 pt-3 h-[50px] md:h-[60px] ">
        <Link href="/">
          <a className="py-1">
            <Image
              src={"/images/amazon_logo_navbar.png"}
              width={"100px"}
              height={"35px"}
              alt="logo"
            />
          </a>
        </Link>
        <div onBlur={() => blur(inputRef, setSearch)}>
          <div className=" hidden md:flex h-auto relative">
            <input
              type="text"
              className="rounded-l h-[38px] p-1 focus:outline-none border-transparent focus:border-transparent focus:ring-0 md:w-[300px] lg:w-[350px]"
              ref={inputRef}
              onChange={(e) => handleSearch(e)}
            />
            {search.length > 0 ? (
              <BsSearch
                onClick={() =>
                  router.push({
                    pathname: "/search",
                    query: { search: JSON.stringify(search) },
                  })
                }
                className="rounded-r-md bg-orange-300 h-[38px] px-1.5 w-12 rounded-l-md p-2 font-bold absolute -right-1 top-0"
              />
            ) : (
              <BsSearch className="rounded-r-md bg-orange-300 h-[38px] px-1.5 w-12 rounded-l-md p-2 font-bold absolute -right-1 top-0" />
            )}
          </div>
          {showSearch && (
            <div className="z-10 absolute mt-[80px] -ml-[47%] w-[calc(95%-65px)] z-1 rounded-md  border-solid border-b-2 border-x-2 border-slate-200 sm:w-[calc(95%-55px)] sm:-ml-[48%] md:ml-[0%] md:-mt-[5px] md:w-[258px] lg:w-[308px]">
              {search.slice(0, 4).map((product, index) => {
                return (
                  <Link key={index} href={`/product/${product._id}`}>
                    <a>
                      <div
                        onClick={() => {
                          inputRef.current.value = "";
                          setSearch([]);
                        }}
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
                    </a>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        <div className="flex  gap-5 md:gap-5">
          <Link href="/profile">
            <a>
              <AiOutlineUser className="text-white text-3xl md:text-4xl " />
            </a>
          </Link>
          <div>
            <Link href="/cart">
              <a>
                <BsCart2 className="text-white text-3xl md:text-4xl " />
              </a>
            </Link>
            {cartQuantity > 0 && (
              <p className=" text-bg-slate-900 bg-orange-300 h-[20px] w-[20px] flex items-center justify-center rounded-full absolute top-7 right-0.5">
                {cartQuantity}
              </p>
            )}
          </div>
        </div>
      </div>
      <div
        className="flex h-auto  py-1  self-center md:hidden w-full  px-5 relative"
        onBlur={() => blur(inputRef, setSearch)}
      >
        <input
          type="text"
          className="rounded-lg h-[44px] w-full p-1 border-transparent focus:border-transparent focus:ring-0 "
          ref={inputRef}
          onChange={(e) => handleSearch(e)}
        />
        {search.length > 0 ? (
          <BsSearch
            onClick={() =>
              router.push({
                pathname: "/search",
                query: { search: JSON.stringify(search) },
              })
            }
            className="rounded-r-md bg-orange-300 h-[44px] px-1.5 w-12 rounded-l-md p-2 font-bold absolute right-4 top-[4px]"
          />
        ) : (
          <BsSearch className="rounded-r-md bg-orange-300 h-[44px] px-1.5 w-12 rounded-l-md p-2 font-bold absolute right-4 top-[4px]" />
        )}
      </div>
    </div>
  );
}
