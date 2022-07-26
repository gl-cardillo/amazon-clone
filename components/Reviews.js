import axios from "axios";
import { BsStarFill, BsStar } from "react-icons/bs";
import { useState, useContext, useEffect } from "react";
import { UserContext, CurrencyContext } from "../utils/context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";

export default function Reviews({ reviews, ratingArray, product }) {
  //used for star rating
  const starsLoop = [0, 1, 2, 3, 4];
  const { user, setUser } = useContext(UserContext);
  const [ratingForm, setRatingForm] = useState(null);
  const [errorRating, setErrorRating] = useState("");
  const router = useRouter();
  
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
    <div className="bg-white mt-3 p-5 flex flex-col  rounded-md md:px-10  md:mx-24 lg:mx-52 xl:mx-[400px]">
      <h3 className="font-bold text-2xl">Customer reviews</h3>
      <p className="mb-3 text-slate-600">
        {reviews.length} global rating{reviews.length > 1 && "s"}
      </p>
      <div>
        <table>
          <tbody>
            {starsLoop.map((star, index) => (
              <tr className="flex mb-2 items-center " key={index}>
                <td className="w-[60px] ">{star + 1} star</td>
                <td className="h-[22px] w-[160px] border border-[#e3e6e6] bg-[#F0F2F2] rounded-[3px]">
                  <div
                    style={{
                      width: `${
                        ratingArray[star + 1] !== 0
                          ? (ratingArray[star + 1] / reviews.length) * 100 + "%"
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
                      <BsStar key={index} className="text-[#FFA41C] text-lg" />
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
  );
}
