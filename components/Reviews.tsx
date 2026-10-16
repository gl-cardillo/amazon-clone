import axios from "axios";
import Image from "next/image";
import { BsStarFill, BsStar } from "react-icons/bs";
import { useState, type Dispatch, type SetStateAction } from "react";
import { errorMessage, useMe } from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { reviewSchema, type ReviewInput } from "../utils/schemas";
import type { Product, Review, ReviewSummary } from "@/types";

type SortMethod = "recent" | "rating";

interface ReviewsProps {
  reviews: Review[];
  ratingArray: ReviewSummary["ratingArray"];
  product: Product;
  setAskLogin: Dispatch<SetStateAction<boolean>>;
}

const ALL_RATINGS = [1, 2, 3, 4, 5];

export default function Reviews({
  reviews,
  ratingArray,
  product,
  setAskLogin,
}: ReviewsProps) {
  //used for star rating
  const starsLoop = [0, 1, 2, 3, 4];
  const { user } = useMe();
  const [ratingForm, setRatingForm] = useState<number | null>(null);
  const [errorRating, setErrorRating] = useState("");
  const [filter, setFilter] = useState(ALL_RATINGS);
  const [sort, setSort] = useState<SortMethod>("recent");
  const router = useRouter();
  // one review per product, the api rejects a second one with 409
  const alreadyReviewed =
    user !== null && reviews.some((review) => review.userId === user._id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
  });

  const addReview = async (data: ReviewInput) => {
    if (!ratingForm) {
      setErrorRating("Select a star");
      return;
    }
    try {
      await axios.post(`/api/review/${product._id}`, {
        review: data.review,
        rating: ratingForm,
      });
      reset();
      setRatingForm(null);
      // rerun getServerSideProps so the new review shows up
      router.replace(router.asPath, undefined, { scroll: false });
    } catch (error) {
      setErrorRating(errorMessage(error));
    }
  };

  // "0" means all ratings
  const handleFilter = (value: string) => {
    setFilter(value === "0" ? ALL_RATINGS : [Number(value)]);
  };

  // percentage of reviews with this many stars
  const share = (stars: number) =>
    reviews.length > 0 ? ((ratingArray[stars] ?? 0) / reviews.length) * 100 : 0;

  // sort a copy, the reviews prop must not be mutated
  const sortedReviews = [...reviews].sort((a, b) =>
    sort === "rating"
      ? b.rating - a.rating
      : new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="mt-3 flex flex-col rounded-md bg-white p-5 shadow-sm md:mx-24 md:px-10 lg:mx-52 xl:mx-[400px] 3xl:mx-[600px]">
      <div className="flex flex-col items-center">
        <h3 className="text-2xl font-bold text-gray-700">Customer reviews</h3>
        <p className="mb-3 text-slate-600">
          {reviews.length} global rating{reviews.length > 1 && "s"}
        </p>
        <div>
          <table>
            <tbody>
              {starsLoop.map((star, index) => (
                <tr
                  className="mb-2 flex cursor-pointer items-center transition-transform duration-200 ease-in-out hover:scale-[1.02]"
                  key={index}
                  onClick={() => handleFilter(`${star + 1}`)}
                >
                  <td className="w-[60px] text-blue-500">{star + 1} star</td>
                  <td className="h-[22px] w-[160px] rounded-sm bg-[#F0F2F2]">
                    <div
                      style={{ width: `${share(star + 1)}%` }}
                      className={`h-[20px] rounded-sm bg-[#FFA41C] shadow-sm`}
                    ></div>
                  </td>
                  <td className="w-[50px] text-right text-blue-500">
                    {Math.round(share(star + 1))}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <div className="mt-6 flex flex-col items-center gap-1 self-center">
          <label htmlFor="sortBy" className="font-bold text-gray-700">
            Sort by
          </label>
          <select
            id="sortBy"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMethod)}
            className="w-[140px] cursor-pointer rounded-sm border-gray-300 text-sm shadow-xs"
          >
            <option value="recent">Most recent</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div className="mt-6 flex flex-col items-center gap-1 self-center">
          <label htmlFor="filterBy" className="font-bold text-gray-700">
            Filter by
          </label>
          <select
            id="filterBy"
            onChange={(e) => handleFilter(e.target.value)}
            className="w-[140px] cursor-pointer rounded-sm border-gray-300 text-sm shadow-xs"
          >
            <option value="0">All rating</option>
            <option value="1">1 star</option>
            <option value="2">2 star</option>
            <option value="3">3 star</option>
            <option value="4">4 star</option>
            <option value="5">5 star</option>
          </select>
        </div>
      </div>
      <div>
        {reviews.length > 0 ? (
          <div>
            {sortedReviews
              .filter((review) => filter.includes(review.rating))
              .map((review) => (
                <div
                  className="mt-8 border-b-2 border-solid border-slate-200 pb-2"
                  key={review._id}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      className="h-[40px] w-[40px] rounded-full"
                      src="/images/user.svg"
                      width={40}
                      height={40}
                      alt="avatar"
                      unoptimized
                    />{" "}
                    <p className="text-xl">{review.reviewAuthor}</p>
                  </div>
                  <div className="my-2 flex gap-1">
                    {starsLoop.map((numb, index) =>
                      review.rating > numb ? (
                        <BsStarFill
                          key={index}
                          className="text-lg text-[#FFA41C]"
                        />
                      ) : (
                        <BsStar
                          key={index}
                          className="text-lg text-[#FFA41C]"
                        />
                      ),
                    )}
                  </div>
                  <p className="mb-2 text-sm">
                    Reviewed on {review.date_formatted}
                  </p>
                  <p>{review.text}</p>
                </div>
              ))}
          </div>
        ) : (
          <p className="pt-5 text-center">No reviews for this product</p>
        )}
      </div>
      {alreadyReviewed ? (
        <p className="pt-5 text-center text-slate-600">
          You reviewed this product
        </p>
      ) : user ? (
        <div>
          <h4 className="my-3 font-semibold text-gray-700">Leave a review</h4>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              {starsLoop.map((numb) => (
                <button
                  key={numb}
                  type="button"
                  aria-label={`Rate ${numb + 1} star${numb > 0 ? "s" : ""}`}
                  aria-pressed={ratingForm === numb + 1}
                  onClick={() => {
                    setErrorRating("");
                    setRatingForm(numb + 1);
                  }}
                >
                  {(ratingForm ?? 0) > numb ? (
                    <BsStarFill className="text-xl text-[#FFA41C]" />
                  ) : (
                    <BsStar className="text-xl text-[#FFA41C]" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-red-500">{errorRating}</p>
          </div>
          <div>
            <form
              className="mt-2 flex flex-col items-center"
              onSubmit={handleSubmit(addReview)}
            >
              <textarea
                className="text h-24 w-full resize-none rounded-xs border-gray-300 p-1 shadow-sm"
                id="text"
                aria-label="Your review"
                {...register("review")}
              />
              <p className="pt-1 text-[12px] text-red-600">
                {errors?.review?.message}
              </p>
              <button
                className="mt-2 w-[120px] rounded-[5px] bg-linear-to-b from-[#f7dfa5] to-[#f0c14b] p-2 text-[14px] shadow-sm"
                type="submit"
              >
                Add review
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          className="mt-5 h-12 w-[200px] self-center rounded-[5px] bg-linear-to-b from-[#f7dfa5] to-[#f0c14b] p-1 text-lg text-[14px] shadow-sm"
          onClick={() => setAskLogin(true)}
        >
          Write a review
        </button>
      )}
    </div>
  );
}
