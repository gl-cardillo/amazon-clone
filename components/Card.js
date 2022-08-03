import Link from "next/link";
import { useContext } from "react";
import { CurrencyContext } from "../utils/context";
import { handleRating } from "../utils/utils";

export default function Card({ product, reviewAverage }) {
  const { currencySymbol, currencyRate } = useContext(CurrencyContext);

  return (
    <Link href={`/product/${product._id}`}>
      <a>
        <div className="flex gap-5 p-2 m-2 border-2 rounded bg-white w-full md:w-[245px] md:h-[400px] md:flex-col lg:w-[300px] hover:scale-[1.02] hover:shadow-xl">
          <img
            src={product.picUrl}
            className="object-scale-down min-w-[140px] w-[140px] h-[200px] md:self-center"
            alt="category"
          />
          <div>
            <p className="font-semibold  text-sm md:text-md ">{product.name}</p>
            <div className="flex gap-1 my-5">{handleRating(reviewAverage)}</div>
            <p className="font-bold ">
              {currencySymbol}
              {(Math.round(product.price * currencyRate * 100) / 100).toFixed(
                2
              )}
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
}
