import axios from "axios";
import { useState, useContext } from "react";
import { UserContext } from "../../utils/context";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useRouter } from "next/router";

export default function Product({ product }) {
  const [showDescription, setShowDescription] = useState(false);
  const [askLogin, setAskLogin] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const addToCart = async () => {
    if (!user) {
      setAskLogin(true);
      return;
    }
    axios
      .post(
        "http://localhost:3000/api/cart/addToCart",
        {
          productId: product._id,
          quantity,
          userId: user._id,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token_amazon_lc")
            )}`,
          },
        }
      )
      .then((res) => {
        setUser(res.data);
        localStorage.setItem("user_amazon_lc", JSON.stringify(res.data));
        setQuantity(1);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const increaseQuantity = () => {
    if (quantity === 9) return;
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity === 1) return;
    setQuantity(quantity - 1);
  };

  return (
    <div className="flex flex-col bg-slate-100 mx-2">
      <div className="flex flex-col gap-3 p-5 my-3 bg-white rounded-md  md:hidden ">
        <h3 className="font-bold text-xl">{product.name}</h3>
        <img src={product.picUrl} alt="category" />
        <p className="font-bold text-2xl self-center">£{product.price}</p>
      </div>
      <div className="hidden md:flex flex-col bg-white my-3 gap-5 p-5 items-center rounded-md  md:mx-24 lg:mx-52 xl:mx-[400px]">
        <div className="flex gap-5 items-center">
          <div className="p-2 w-1/3">
            <img src={product.picUrl} className="w-full h-1/3" alt="category" />
          </div>
          <div className="flex flex-col self-baseline pt-5 xl:pt-10 2xl:pt-16   ">
            <h3 className=" font-bold text-lg lg:text-xl xl:text-3xl ">
              {product.name}
            </h3>
            <p className="font-bold text-lg xl:text-xl py-5 2xl:py-16">
              £{product.price}
            </p>
            <p className="flex gap-2 items-center">
              Description
              <MdKeyboardArrowDown
                className={showDescription ? "rotate-180 text-xl" : "text-xl"}
                onClick={() => {
                  setShowDescription(!showDescription);
                }}
              />
            </p>
          </div>
        </div>
        {showDescription && (
          <div className="max-w-[350px] lg:max-w-[400px] xl:max-w-[450px] 2xl:max-w-[1100px] self-end">
            <p>&#8226;{product.description}</p>
            <p className="py-2">&#8226;{product.description2 && product.description2}</p>
            <p>&#8226;{product.description3}</p>
          </div>
        )}
      </div>
      <div className="bg-white py-5 flex flex-col gap-5 items-center rounded-md  md:mx-24 lg:mx-52 xl:mx-[400px]  ">
        <div className="flex gap-3 px-1.5 border-solid border-2  border-slate-400 rounded-2xl">
          <p onClick={() => decreaseQuantity()}>-</p>
          <p>{quantity}</p>
          <p onClick={() => increaseQuantity()}>+</p>
        </div>
        <button
          onClick={() => addToCart(product.id)}
          className=" bg-yellow-400 p-2 px-5 rounded-lg m-auto"
        >
          Add to Cart
        </button>
        {askLogin && (
          <div className=" fixed z-2 top-0 left-0 w-full h-full bg-black/50">
            <div className="absolute z-3 top-1/2 left-1/2 w-[300px] text-[18px] bg-white transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-md border-2 border-[#f0c14b]">
              <p className=" text-center font-semibold">
                Login for add a product to cart
              </p>
              <div className="flex justify-around">
                <button
                  className="mt-5 p-2 w-[120px] text-[14px] rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
                  onClick={() => setAskLogin(false)}
                >
                  Cancel
                </button>
                <button
                  className="mt-5 p-1 w-[120px] text-[14px] rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
                  onClick={() => router.push("/singin")}
                >
                  Go to login page
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="p-5 bg-white rounded-md my-3 md:hidden ">
        <p className="flex gap-2 items-center">
          Description
          <MdKeyboardArrowDown
            className={`${showDescription && "rotate-180 text-xl"} text-xl`}
            onClick={() => {
              setShowDescription(!showDescription);
            }}
          />
        </p>
        {showDescription && (
          <div className=" max-w-sm">
            <p>&#8226;{product.description}</p>
            <p>&#8226;{product.description2 && product.description2}</p>
            <p>&#8226;{product.description3}</p>
          </div>
        )}
      </div>
    </div>
  );
}
export const getStaticProps = async ({ params }) => {
  const res = await axios
    .get(`http://localhost:3000/api/product/${params.productId}`)
    .catch((err) => {
      console.log(err.message);
    });
  return { props: { product: res.data } };
};

export const getStaticPaths = async () => {
  const products = await axios
    .get(`http://localhost:3000/api/product/all`)
    .catch((err) => {
      console.log(err.message);
    });

  return {
    paths: products.data.map((product) => {
      return {
        params: {
          productId: product._id,
        },
      };
    }),
    fallback: false,
  };
};
