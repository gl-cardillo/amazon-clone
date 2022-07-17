import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { BsSearch, BsCart2 } from "react-icons/bs";
import { AiOutlineUser } from "react-icons/ai";

export default function Navbar() {
  const [search, setSearch] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const inputRef = useRef(null);
  const router = useRouter();

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
    const getData = async () => {
      const res = await axios.get(`http://localhost:3000/api/product`);
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
      <div className="flex h-auto   " onBlur={() => blur(inputRef, setSearch)}>
        <input
          type="text"
          className="rounded-l w-[130px] sm:w-[150px] md:w-[200px] lg:w-[300px]  focus:outline-none p-1"
          ref={inputRef}
          onChange={(e) => handleSearch(e)}
          onFocus={() => setShowSearch(true)}
        />
        {search.length > 0 ? (
          <p
            onClick={() =>
              router.push({
                pathname: "/search",
                query: { search: JSON.stringify(search) },
              })
            }
          >
            <BsSearch className="rounded-r bg-orange-300 h-6 px-1.5 w-7 text-xl  " />
          </p>
        ) : (
          <BsSearch className="rounded-r bg-orange-300 h-6 px-1.5 w-7 text-xl  " />
        )}

        {showSearch ? (
          // show users result from research and like to account
          <div className="z-10 absolute  mt-6 rounded-md z-1 w-[130px] md:w-[200px] lg:w-[300px]  ">
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
                      <p className=" whitespace-nowrap overflow-hidden text-xs ">
                        {product.name}
                      </p>
                    </div>
                  </a>
                </Link>
              );
            })}
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex  gap-3 md:gap-5">
        <AiOutlineUser className="text-white text-xl md:text-3xl " />
        <BsCart2 className="text-white text-xl md:text-3xl " />
      </div>
    </div>
  );
}
