import axios from "axios";
import { BsStarFill, BsStar } from "react-icons/bs";
import { useState, useContext, useEffect } from "react";
import { UserContext, CurrencyContext } from "../utils/context";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";

export default function Reviews({
  reviews,
  ratingArray,
  product,
  setAskLogin,
}) {
  //used for star rating
  const starsLoop = [0, 1, 2, 3, 4];
  const { user, setUser } = useContext(UserContext);
  const [ratingForm, setRatingForm] = useState(null);
  const [errorRating, setErrorRating] = useState("");
  const [filter, setFilter] = useState([1, 2, 3, 4, 5]);
  const [sort, setSort] = useState("recent");
  const router = useRouter();

  const schema = yup.object().shape({
    review: yup.string().min(2),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const addReview = async (data) => {
    if (!ratingForm) {
      setErrorRating("Select a star");
      return;
    }
    try {
      await axios.post(`/api/review/${product._id}`, {
        productId: product._id,
        text: data.review,
        reviewAuthor: user.name,
        ratingForm,
      });
      reset();
      setRatingForm(null);
      router.push(`/product/${product._id}`);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleFilter = (value) => {
    switch (value) {
      case "0":
        setFilter([1, 2, 3, 4, 5]);
        break;
      case "1":
        setFilter([1]);
        break;
      case "2":
        setFilter([2]);
        break;
      case "3":
        setFilter([3]);
        break;
      case "4":
        setFilter([4]);
        break;
      case "5":
        setFilter([5]);
        break;

      default:
        break;
    }
  };

  const handleSort = (sortMethod) => {
    if (sortMethod === "rating") {
      reviews.sort((a, b) => b.rating - a.rating);
      setSort("rating");
    } else {
      reviews.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setSort("recent");
    }
  };

  return (
    <div className="bg-white mt-3 p-5 flex flex-col rounded-md md:px-10 shadow md:mx-24 lg:mx-52 xl:mx-[400px] 3xl:mx-[600px]">
      <div className="flex flex-col items-center">
        <h3 className="font-bold text-2xl text-gray-700">Customer reviews</h3>
        <p className="mb-3 text-slate-600">
          {reviews.length} global rating{reviews.length > 1 && "s"}
        </p>
        <div>
          <table>
            <tbody>
              {starsLoop.map((star, index) => (
                <tr
                  className="flex mb-2 items-center cursor-pointer hover:scale-[1.02] transition-transform duration-200 ease-in-out"
                  key={index}
                  onClick={() => handleFilter(`${star + 1}`)}
                >
                  <td className="w-[60px] text-blue-500">{star + 1} star</td>
                  <td className="h-[22px] w-[160px] bg-[#F0F2F2] rounded">
                    <div
                      style={{
                        width: `${
                          ratingArray[star + 1] !== 0
                            ? (ratingArray[star + 1] / reviews.length) * 100 +
                              "%"
                            : "0%"
                        }`,
                      }}
                      className={`h-[20px] bg-[#FFA41C] rounded shadow`}
                    ></div>
                  </td>
                  <td className="text-right w-[50px] text-blue-500">
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
      </div>
      <div className="flex gap-4  justify-center">
        <div className="self-center mt-6 flex flex-col items-center gap-1">
          <label id="sortBy" className="font-bold text-gray-700">
            Sort by
          </label>
          <select
            id="sortBy"
            onChange={(e) => handleSort(e.target.value)}
            className="cursor-pointer text-sm w-[140px] border-gray-300 rounded shadow-sm"
          >
            <option value="recent" name="filter">
              Most recent
            </option>
            <option value="rating" name="filter">
              Rating
            </option>
          </select>
        </div>
        <div className="self-center mt-6 flex flex-col items-center gap-1">
          <label htmlFor="filterBy" className="font-bold text-gray-700">
            Filter by
          </label>
          <select
            id="filterBy"
            onChange={(e) => handleFilter(e.target.value)}
            className="cursor-pointer text-sm w-[140px] border-gray-300 rounded shadow-sm"
          >
            <option value="0" name="filter">
              All rating
            </option>
            <option value="1" name="filter">
              1 star
            </option>
            <option value="2" name="filter">
              2 star
            </option>
            <option value="3" name="filter">
              3 star
            </option>
            <option value="4" name="filter">
              4 star
            </option>
            <option value="5" name="filter">
              5 star
            </option>
          </select>
        </div>
      </div>
      <div>
        {reviews.length > 0 ? (
          <div>
            {reviews
              .filter((review) => filter.includes(review.rating))
              .map((review, index) => (
                <div
                  className="mt-8 pb-2 border-solid border-b-2 border-slate-200"
                  key={index}
                >
                  <div className="flex gap-3 items-center">
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
                  <p className="text-sm mb-2">
                    Reviewed on {review.date_formatted}
                  </p>
                  <p>{review.text}</p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-center pt-5">No reviews for this product</p>
        )}
      </div>
      {user ? (
        <div>
          <h4 className="my-3 font-semibold text-gray-700">Leave a review</h4>
          <div className="flex items-center flex-col gap-2">
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
                className="w-full p-1 text resize-none rounded-sm h-24 border-gray-300 shadow"
                id="text"
                name="text"
                {...register("review")}
              />
              <p className="text-[12px] text-red-600 pt-1">
                {errors?.review?.message}
              </p>
              <button
                className=" mt-2 p-2 w-[120px] text-[14px] rounded-[5px] shadow bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
                type="submit"
              >
                Add review
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          className=" text-lg self-center mt-5 p-1 w-[200px] h-12 text-[14px] rounded-[5px] shadow bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b]"
          onClick={() => setAskLogin(true)}
        >
          Write a review
        </button>
      )}
    </div>
  );
}
