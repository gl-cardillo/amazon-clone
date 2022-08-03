import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { UserContext, CurrencyContext } from "../../utils/context";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useRouter } from "next/router";
import { handleRating } from "../../utils/utils";
import { getAllProduct } from "../api/product/all";
import { getDataProductId } from "../api/product/[productId]";
import { getDataReview } from "../api/review/[productId]";
import dbConnect from "../../utils/dbConnect";
import ImageSelector from "../../components/ImageSelector";
import Reviews from "../../components/Reviews";

export default function Product({
  product,
  reviews,
  ratingArray,
  ratingAverage,
}) {
  const [showDescription, setShowDescription] = useState(false);
  const [askLogin, setAskLogin] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const { currencySymbol, currencyRate } = useContext(CurrencyContext);

  const addToCart = async () => {
    if (!user) {
      setAskLogin(true);
      return;
    }
    axios
      .post(
        "/api/cart/addToCart",
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
      <div className="flex flex-col items-center gap-5 p-5 my-3 bg-white rounded-md md:hidden">
        <h3 className="font-bold text-xl">{product.name}</h3>
        <div className="flex items-center ">
          {handleRating(ratingAverage)}{" "}
          <p className="text-sm pl-2">
            {(Math.round(ratingAverage * 100) / 100).toFixed(1)} out of 5
          </p>
        </div>
        <ImageSelector product={product} />
        <p className="font-bold text-xl self-center">£{product.price}</p>
        <div className="flex flex-col items-center">
          <p className="flex gap-1 items-center mb-2 font-semibold">
            About this item
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
      <div className="hidden md:flex flex-col bg-white my-3 p-5 items-center rounded-md md:mx-24 lg:mx-52 xl:mx-[400px]">
        <div className="flex gap-5 items-center">
          <div className="p-2 w-1/3">
            <ImageSelector product={product} />
          </div>
          <div className="flex flex-col self-baseline pt-5 xl:pt-10 2xl:pt-16">
            <h3 className="font-bold text-lg lg:text-xl xl:text-3xl ">
              {product.name}
            </h3>
            <div className="flex gap-2 mt-2">
              <p className="font-bold">
                {product.categoryName === "Books" ? "Author" : "Manufacturer"}:{" "}
              </p>
              <p>{product.manufacturer}</p>
            </div>
            <div className="flex gap-1 mt-4">
              {handleRating(ratingAverage)}{" "}
              <p className="text-lg pl-2">
                {(Math.round(ratingAverage * 100) / 100).toFixed(1)} out of 5
              </p>
            </div>
            <p className="font-bold text-lg xl:text-xl py-5 2xl:py-7">
              {currencySymbol}
              {(Math.round(product.price * currencyRate * 100) / 100).toFixed(
                2
              )}
            </p>
            <p className="flex gap-1 items-center">
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
            <p className="py-2">&#8226;{product.description2}</p>
            <p>&#8226;{product.description3}</p>
          </div>
        )}
      </div>
      <div className="bg-white py-5 gap-3 items-center flex flex-col rounded-md md:mx-24 lg:mx-52 xl:mx-[400px]">
        <p className="text-green-700 font-semibold">In Stock</p>
        <div className="flex w-[65px] gap-3 px-1.5 border-solid border-2  border-[#f0c14b] rounded-2xl">
          <p onClick={() => decreaseQuantity()}>-</p>
          <p>{quantity}</p>
          <p onClick={() => increaseQuantity()}>+</p>
        </div>

        <button
          onClick={() => addToCart(product.id)}
          className="p-2 w-[300px] h-12 text-[14px] rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
        >
          Add to Cart
        </button>
      </div>
      <Reviews
        reviews={reviews}
        ratingArray={ratingArray}
        product={product}
        setAskLogin={setAskLogin}
      />
      {askLogin && (
        <div className=" fixed z-2 top-0 left-0 w-full h-full bg-black/50">
          <div className="absolute z-3 top-1/2 left-1/2 w-[300px] text-[18px] bg-white transform -translate-x-1/2 -translate-y-1/2 p-4 rounded-md border-2 border-[#f0c14b]">
            <p className=" text-center font-semibold">
              You need to login first
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
  );
}

export async function getServerSideProps(context) {

  // if not called returns mongoose.models undefined
  await getAllProduct();
  
  let res = await getDataProductId(context.query.productId);
  res = JSON.parse(JSON.stringify(res));

  let resReview = await getDataReview(context.query.productId);
  resReview = JSON.parse(JSON.stringify(resReview));

  return {
    props: {
      product: res,
      reviews: resReview.reviews,
      ratingArray: resReview.ratingArray,
      ratingAverage: resReview.average,
    },
  };
}

// export const getStaticProps = async ({ params }) => {
//   let res = await getDataProductId(params.productId);
//   res = JSON.parse(JSON.stringify(res));

//   let resReview = await getDataReview(params.productId);
//   resReview = JSON.parse(JSON.stringify(resReview));

//   return {
//     props: {
//       product: res,
//       reviews: resReview.reviews,
//       ratingArray: resReview.ratingArray,
//       ratingAverage: resReview.average,
//     },
//   };
// };

// export const getStaticPaths = async () => {
//   let products = await getAllProduct();
//   products = JSON.parse(JSON.stringify(products));
//   return {
//     paths: products.map((product) => {
//       return {
//         params: {
//           productId: product._id,
//         },
//       };
//     }),
//     fallback: false,
//   };
// };
