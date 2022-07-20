import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../utils/userContext";
import { BsSearch, BsCart2 } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";

export default function Navbar() {
  const [search, setSearch] = useState([]);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const inputRef = useRef(null);
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  function blur(input) {
    input.current.value = "";
    setTimeout(() => {
      setSearch([]);
    }, 200);
  }

  function handleSearch(e) {
    if (e.target.value === "") {
      setSearch([]);
    } else {
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
    <div className="flex justify-between gap-3 bg-slate-900 p-2 h-10 md:h-11 ">
      <Link href="/">
        <a className="py-1">
          <Image
            src={"/images/amazon_logo_navbar.png"}
            width={"80px"}
            height={"25px"}
            alt="logo"
          />
        </a>
      </Link>
      <div className="flex h-auto" onBlur={() => blur(inputRef, setSearch)}>
        <input
          type="text"
          className="rounded-l h-7 focus:outline-none p-1 w-[130px] sm:w-[150px] md:w-[200px] lg:w-[300px]"
          ref={inputRef}
          onChange={(e) => handleSearch(e)}
          onFocus={() => setShowSearch(true)}
        />
        {search.length > 0 ? (
          <BsSearch
            onClick={() =>
              router.push({
                pathname: "/search",
                query: { search: JSON.stringify(search) },
              })
            }
            className="rounded-r bg-orange-300 h-7 px-1.5 w-7 text-xl  "
          />
        ) : (
          <BsSearch className="rounded-r bg-orange-300 h-7 px-1.5 w-7 text-xl  " />
        )}
        {showSearch && (
          <div className="z-10 absolute  mt-6 rounded-md z-1 w-[130px] sm:w-[150px] md:w-[200px] lg:w-[300px]  ">
            {search.slice(0, 4).map((product, index) => {
              return (
                <Link key={index} href={`/product/${product._id}`}>
                  <a>
                    <div
                      onClick={() => {
                        inputRef.current.value = "";
                        setSearch([]);
                      }}
                      className=" flex bg-white px-1 py-3"
                    >
                      <img
                        src={product.picUrl}
                        className=" hidden sm:block w-[40px] h-[40px]"
                        alt="product"
                      />
                      <p className="whitespace-nowrap overflow-hidden text-xs ">
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
      <div className="flex  gap-3 md:gap-5">
        <Link href="/profile">
          <a>
            <AiOutlineUser className="text-white text-2xl md:text-3xl " />
          </a>
        </Link>
        <div>
          <BsCart2 className="text-white text-2xl md:text-3xl " />
          <p className="text-bg-slate-900 bg-orange-300 h-[20px] w-[20px] flex items-center justify-center rounded-full absolute top-6 right-1">
            {cartQuantity}
          </p>
        </div>
      </div>
    </div>
  );
}
