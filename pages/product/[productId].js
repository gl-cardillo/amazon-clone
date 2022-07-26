import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../utils/context";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BsStarFill, BsStar } from "react-icons/bs";
import { handleRating } from "../../utils/utils";
import { getAllProduct } from "../api/product/all";
import { getDataProductId } from "../api/product/[productId]";
import { getDataReview } from "../api/review/[productId]";

export default function Product({
  product,
  reviews,
  ratingArray,
  ratingAverage,
}) {
  const [showDescription, setShowDescription] = useState(false);
  const [askLogin, setAskLogin] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [ratingForm, setRatingForm] = useState(null);

  const [errorRating, setErrorRating] = useState("");

  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  //used for star rating
  const starsLoop = [0, 1, 2, 3, 4];

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

  const schema = yup.object().shape({
    text: yup.string().min(2),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const addReview = (data) => {
    if (!ratingForm) {
      setErrorRating("Select a star");
      return;
    }
    axios
      .post(
        `/api/review/${product._id}`,
        {
          productId: product._id,
          text: data.text,
          reviewAuthor: user.name,
          ratingForm,
        },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token_amazon_lc")
            )}`,
          },
        }
      )
      .then(() => {
        reset();
        setRatingForm(null);
        router.push(`/product/${product._id}`);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="flex flex-col bg-slate-100 mx-2">
      <div className="flex flex-col items-center gap-5 p-5 my-3 bg-white rounded-md  md:hidden ">
        <h3 className="font-bold text-xl">{product.name}</h3>
        <img src={product.picUrl} alt="category" />
        <div className="flex items-center ">
          {handleRating(ratingAverage)}{" "}
          <p className="text-lg pl-2">
            {(Math.round(ratingAverage * 100) / 100).toFixed(1)} out of 5
          </p>
        </div>
        <p className="font-bold text-2xl self-center">£{product.price}</p>
        <div className="my-3 flex flex-col items-center">
          <p className="flex gap-1 items-center mb-2">
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
      <div className="hidden md:flex flex-col bg-white my-3  p-5 items-center rounded-md md:mx-24 lg:mx-52 xl:mx-[400px]">
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
            <div className="flex gap-1 mb-7">
              {handleRating(ratingAverage)}{" "}
              <p className="text-lg pl-2">
                {(Math.round(ratingAverage * 100) / 100).toFixed(1)} out of 5
              </p>
            </div>
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
      <div className="bg-white py-5 flex flex-col gap-5 items-center rounded-md  md:mx-24 lg:mx-52 xl:mx-[400px]  ">
        <div className="flex gap-3 px-1.5 border-solid border-2  border-slate-400 rounded-2xl">
          <p onClick={() => decreaseQuantity()}>-</p>
          <p>{quantity}</p>
          <p onClick={() => increaseQuantity()}>+</p>
        </div>
        <button
          onClick={() => addToCart(product.id)}
          className="p-2 w-[120px] text-[14px] rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
        >
          Add to Cart
        </button>
      </div>
      <div className="bg-white mt-3 p-5 flex flex-col  rounded-md md:px-10  md:mx-24 lg:mx-52 xl:mx-[400px]">
        <h3 className="font-bold text-2xl">Customer reviews</h3>
        <p className="mb-3 text-slate-600">
          {reviews.length} global rating{reviews.length > 1 && "s"}
        </p>
        <div>
          <table>
            <tbody>
              {starsLoop.map((star, index) => (
                <tr className="flex   mb-2 items-center " key={index}>
                  <td className="w-[60px] ">{star + 1} star </td>{" "}
                  <td className="h-[22px] w-[160px] border border-[#e3e6e6] bg-[#F0F2F2] rounded-[3px]">
                    <div
                      style={{
                        width: `${
                          ratingArray[star + 1] !== 0
                            ? (ratingArray[star + 1] / reviews.length) * 100 +
                              "%"
                            : "0%"
                        }`,
                      }}
                      className={`h-[20px] bg-[#FFA41C] rounded-l-[3px]`}
                    ></div>
                  </td>
                  <td className="text-right w-[50px]">
                    {ratingArray[star + 1] !== 0
                      ? Math.round(
                          (ratingArray[star + 1] / reviews.length) * 100
                        ) + "%"
                      : "0%"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          {reviews.length > 0 ? (
            <div>
              {reviews.map((review, index) => (
                <div
                  className="mt-8 pb-2 border-solid border-b-2 border-slate-200"
                  key={index}
                >
                  <div className="flex gap-2 items-center">
                    <img
                      className="w-[40px] h-[40px] rounded-full"
                      src="/images/user.jpeg"
                      alt="avatar"
                    />{" "}
                    <p className="text-xl">{review.reviewAuthor}</p>
                  </div>

                  <div className="flex gap-1 my-2">
                    {starsLoop.map((numb, index) =>
                      review.rating > numb ? (
                        <BsStarFill
                          key={index}
                          className="text-[#FFA41C] text-lg"
                        />
                      ) : (
                        <BsStar
                          key={index}
                          className="text-[#FFA41C] text-lg"
                        />
                      )
                    )}
                  </div>
                  <p>{review.text}</p>
                </div>
              ))}
            </div>
          ) : (
            "No reviews"
          )}
        </div>
        {user ? (
          <div>
            <h4 className="my-2 font-semibold">Leave a review</h4>
            <div className="flex items-center flex-col gap-2  ">
              <div className="flex gap-3 items-center">
                {starsLoop.map((numb, index) =>
                  ratingForm > numb ? (
                    <BsStarFill
                      key={index}
                      className="text-[#FFA41C] text-xl"
                      onClick={() => {
                        setErrorRating("");
                        setRatingForm(numb + 1);
                      }}
                    />
                  ) : (
                    <BsStar
                      key={index}
                      className="text-[#FFA41C] text-xl"
                      onClick={() => {
                        setErrorRating("");
                        setRatingForm(numb + 1);
                      }}
                    />
                  )
                )}
              </div>
              <p className="text-red-500 text-sm">{errorRating}</p>
            </div>
            <div>
              <form
                className="flex flex-col items-center mt-2"
                onSubmit={handleSubmit(addReview)}
              >
                <textarea
                  className="w-full p-1 text resize-none rounded-sm h-24"
                  id="text"
                  name="text"
                  {...register("text")}
                />
                <button
                  className=" mt-2 p-2 w-[120px] text-[14px] rounded-[5px] border-[1px] border-gray-300 bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
                  type="submit"
                >
                  Add review
                </button>
              </form>
            </div>
          </div>
        ) : (
          <button onClick={() => setAskLogin(true)}>Write a review</button>
        )}
      </div>
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
export const getStaticProps = async ({ params }) => {
  let res = await getDataProductId(params.productId);
  res = JSON.parse(JSON.stringify(res));

  let resReview = await getDataReview(params.productId);
  resReview = JSON.parse(JSON.stringify(resReview));
  
  return {
    props: {
      product: res,
      reviews: resReview.reviews,
      ratingArray: resReview.ratingArray,
      ratingAverage: resReview.average,
    },
  };
};

export const getStaticPaths = async () => {

  let products = await getAllProduct();
  products = JSON.parse(JSON.stringify(products));
  return {
    paths: products.map((product) => {
      return {
        params: {
          productId: product._id,
        },
      };
    }),
    fallback: false,
  };
};
