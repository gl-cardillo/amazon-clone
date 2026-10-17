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
    <div className="mx-auto mt-3 flex w-full max-w-3xl flex-col rounded-lg border border-border bg-surface p-5 shadow-sm md:px-10">
      <div className="flex flex-col items-center">
        <h3 className="text-2xl font-bold text-foreground">Customer reviews</h3>
        <p className="mb-3 text-muted-foreground">
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
                  <td className="w-15 text-link">{star + 1} star</td>
                  <td className="h-5.5 w-40 rounded-sm bg-muted">
                    <div
                      style={{ width: `${share(star + 1)}%` }}
                      className={`h-5 rounded-sm bg-star shadow-sm`}
                    ></div>
                  </td>
                  <td className="w-12.5 text-right text-link">
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
          <label htmlFor="sortBy" className="font-bold text-foreground">
            Sort by
          </label>
          <select
            id="sortBy"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMethod)}
            className="w-35 cursor-pointer rounded-md border-input bg-surface text-sm text-foreground shadow-xs"
          >
            <option value="recent">Most recent</option>
            <option value="rating">Rating</option>
          </select>
        </div>
        <div className="mt-6 flex flex-col items-center gap-1 self-center">
          <label htmlFor="filterBy" className="font-bold text-foreground">
            Filter by
          </label>
          <select
            id="filterBy"
            onChange={(e) => handleFilter(e.target.value)}
            className="w-35 cursor-pointer rounded-md border-input bg-surface text-sm text-foreground shadow-xs"
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
                  className="mt-8 border-b border-border pb-2"
                  key={review._id}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      className="h-10 w-10 rounded-full"
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
                        <BsStarFill key={index} className="text-lg text-star" />
                      ) : (
                        <BsStar key={index} className="text-lg text-star" />
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
        <p className="pt-5 text-center text-muted-foreground">
          You reviewed this product
        </p>
      ) : user ? (
        <div>
          <h4 className="my-3 font-semibold text-foreground">Leave a review</h4>
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
                    <BsStarFill className="text-xl text-star" />
                  ) : (
                    <BsStar className="text-xl text-star" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-sm text-danger">{errorRating}</p>
          </div>
          <div>
            <form
              className="mt-2 flex flex-col items-center"
              onSubmit={handleSubmit(addReview)}
            >
              <textarea
                className="h-24 w-full resize-none rounded-md border-input bg-surface p-2 text-foreground shadow-sm"
                id="text"
                aria-label="Your review"
                {...register("review")}
              />
              <p className="pt-1 text-xs text-danger">
                {errors?.review?.message}
              </p>
              <button
                className="mt-2 w-30 rounded-md bg-primary p-2 text-sm text-primary-foreground shadow-sm hover:bg-primary-hover"
                type="submit"
              >
                Add review
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          className="mt-5 h-12 w-50 self-center rounded-md bg-primary p-1 font-medium text-primary-foreground shadow-sm hover:bg-primary-hover"
          onClick={() => setAskLogin(true)}
        >
          Write a review
        </button>
      )}
    </div>
  );
}
