import Link from "next/link";
import { useContext } from "react";
import { CurrencyContext } from "../utils/context";
import { handleRating } from "../utils/utils";
import Image from "next/image";

export default function Card({ product, reviewAverage }) {
  const { currencySymbol, currencyRate } = useContext(CurrencyContext);

  return (
    <Link href={`/product/${product._id}`}>
      <a>
        <div className="flex gap-5 p-2 m-2 border-2 rounded bg-white w-full md:w-[245px] md:h-[400px] md:flex-col lg:w-[300px] hover:scale-[1.01] shadow hover:shadow-lg transition-transform duration-200 ease-in-out">
          <div className="object-scale-down min-w-[100px] w-[100px] h-[180px] md:self-center md:w-[140px] md:h-[200px] relative">
            <Image
              src={product.picUrl}
              alt="category"
              layout="fill"
              objectFit="scale-down"
            />
          </div>
          <div>
            <p className="font-semibold text-sm md:text-md ">{product.name}</p>
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
