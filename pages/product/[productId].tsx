import { useState, useContext } from "react";
import { CurrencyContext } from "../../utils/context";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useRouter } from "next/router";
import { handleRating } from "../../utils/utils";
import { getProductById } from "../../lib/products";
import { getReviewSummary } from "../../lib/reviews";
import ImageSelector from "../../components/ImageSelector";
import Reviews from "../../components/Reviews";
import { useMe } from "../../hooks/useAuth";
import { useAddToCart } from "../../hooks/useCart";
import { MAX_CART_QUANTITY } from "../../utils/constants";
import type { GetServerSideProps } from "next";
import type { Product as ProductType, Review, ReviewSummary } from "@/types";

interface ProductProps {
  product: ProductType;
  reviews: Review[];
  ratingArray: ReviewSummary["ratingArray"];
  ratingAverage: number;
}

export default function Product({
  product,
  reviews,
  ratingArray,
  ratingAverage,
}: ProductProps) {
  const [showDescription, setShowDescription] = useState(false);
  const [askLogin, setAskLogin] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { user } = useMe();
  const addToCartMutation = useAddToCart();
  const { currencySymbol, currencyRate } = useContext(CurrencyContext);

  const addToCart = () => {
    if (!user) {
      setAskLogin(true);
      return;
    }
    addToCartMutation.mutate(
      { productId: product._id, quantity },
      { onSuccess: () => setQuantity(1) },
    );
  };

  const increaseQuantity = () => {
    if (quantity === MAX_CART_QUANTITY) return;
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity === 1) return;
    setQuantity(quantity - 1);
  };

  return (
    <div className="mx-2 mb-4 flex flex-col">
      <div className="my-3 flex flex-col items-center gap-5 rounded-md bg-surface p-5 md:hidden">
        <h3 className="text-xl font-bold">{product.name}</h3>
        <div className="flex items-center">
          {handleRating(ratingAverage)}{" "}
          <p className="pl-2 text-sm">
            {(Math.round(ratingAverage * 100) / 100).toFixed(1)} out of 5
          </p>
        </div>
        <ImageSelector product={product} />
        <p className="self-center text-xl font-bold">
          {currencySymbol}
          {(Math.round(product.price * currencyRate * 100) / 100).toFixed(2)}
        </p>
        <div className="flex flex-col items-center">
          <div className="mb-2 flex items-center gap-1 font-semibold">
            <p>About this item</p>
            <button
              onClick={() => {
                setShowDescription(!showDescription);
              }}
            >
              <MdKeyboardArrowDown
                className={`${showDescription && "rotate-180 text-xl"} text-xl`}
              />
            </button>
          </div>
          {showDescription && (
            <div className="max-w-sm">
              <p>&#8226;{product.description}</p>
              <p>&#8226;{product.description2 && product.description2}</p>
              <p>&#8226;{product.description3}</p>
            </div>
          )}
        </div>
      </div>
      <div className="my-3 hidden flex-col items-center rounded-md bg-surface p-3 shadow-sm md:mx-auto md:flex md:w-full md:max-w-3xl">
        <div className="flex h-80 w-full items-center justify-between gap-5">
          <div className="w-1/3 p-2">
            <ImageSelector product={product} />
          </div>
          <div className="flex h-80 w-[60%] flex-col justify-around pt-5 align-baseline">
            <h3 className="text-lg font-bold lg:text-xl xl:text-3xl">
              {product.name}
            </h3>
            <div className="flex gap-2">
              <p className="font-bold">
                {product.categoryName === "Books" ? "Author" : "Manufacturer"}
                :{" "}
              </p>
              <p>{product.manufacturer}</p>
            </div>
            <div className="flex gap-1">
              {handleRating(ratingAverage)}{" "}
              <p className="pl-2 text-lg">
                {(Math.round(ratingAverage * 100) / 100).toFixed(1)} out of 5
              </p>
            </div>
            <p className="text-lg font-bold xl:text-xl">
              {currencySymbol}
              {(Math.round(product.price * currencyRate * 100) / 100).toFixed(
                2,
              )}
            </p>
            <div className="mb-2 flex items-center gap-1">
              <p>About this item</p>
              <button
                onClick={() => {
                  setShowDescription(!showDescription);
                }}
              >
                <MdKeyboardArrowDown
                  className={`${
                    showDescription && "rotate-180 text-xl"
                  } text-xl`}
                />
              </button>
            </div>
          </div>
        </div>
        {showDescription && (
          <div className="w-[60%] self-end">
            <p className="text-sm">&#8226;{product.description}</p>
            <p className="py-2 text-sm">&#8226;{product.description2}</p>
            <p className="text-sm">&#8226;{product.description3}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-3 rounded-md bg-surface py-5 shadow-sm md:mx-auto md:w-full md:max-w-3xl">
        <p className="font-semibold text-success">In Stock</p>
        <div className="flex w-17.5 gap-3 rounded-2xl border border-border px-2">
          <button
            onClick={() => decreaseQuantity()}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <p>{quantity}</p>
          <button
            onClick={() => increaseQuantity()}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          onClick={addToCart}
          disabled={addToCartMutation.isPending}
          className="h-12 w-75 rounded-md bg-primary p-2 text-sm text-primary-foreground shadow-sm hover:bg-primary-hover"
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
        <div className="fixed top-0 left-0 z-10 h-full w-full bg-black/50">
          <div className="absolute top-1/2 left-1/2 w-75 -translate-x-1/2 -translate-y-1/2 transform rounded-md border border-border bg-surface p-4 text-lg shadow-lg">
            <p className="text-center font-semibold text-muted-foreground">
              You need to login first
            </p>
            <div className="flex justify-around">
              <button
                className="mt-5 w-30 rounded-md bg-primary p-2 text-sm text-primary-foreground shadow-sm hover:bg-primary-hover"
                onClick={() => setAskLogin(false)}
              >
                Cancel
              </button>
              <button
                className="mt-5 w-30 rounded-md bg-primary p-1 text-sm text-primary-foreground shadow-sm hover:bg-primary-hover"
                onClick={() => router.push("/signin")}
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

export const getServerSideProps: GetServerSideProps<ProductProps> = async (
  context,
) => {
  const productId = String(context.params?.productId);
  const product = await getProductById(productId);
  if (!product) {
    return { notFound: true };
  }
  const summary = await getReviewSummary(productId);

  // round-trip through json so mongoose documents become plain props
  return {
    props: JSON.parse(
      JSON.stringify({
        product,
        reviews: summary.reviews,
        ratingArray: summary.ratingArray,
        ratingAverage: summary.average,
      }),
    ),
  };
};
