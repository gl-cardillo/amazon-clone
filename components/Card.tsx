import Link from "next/link";
import { useContext } from "react";
import { CurrencyContext } from "../utils/context";
import { handleRating } from "../utils/utils";
import Image from "next/image";
import type { Product } from "@/types";

interface CardProps {
  product: Product;
  reviewAverage?: number;
}

export default function Card({ product, reviewAverage }: CardProps) {
  const { currencySymbol, currencyRate } = useContext(CurrencyContext);
  // book and game covers are portrait, show them whole instead of cropping
  const isCover =
    product.categoryId === "books" || product.subcategory === "Videogame";

  return (
    <Link href={`/product/${product._id}`}>
      <div className="m-2 flex w-full gap-5 rounded border-2 bg-white p-2 shadow transition-transform duration-200 ease-in-out hover:scale-[1.01] hover:shadow-lg md:h-[400px] md:w-[245px] md:flex-col lg:w-[300px]">
        <div className="relative h-[150px] w-[130px] min-w-[130px] overflow-hidden rounded bg-slate-50 md:h-[210px] md:w-full">
          <Image
            src={product.picUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 768px) 245px, 130px"
            className={isCover ? "object-contain" : "object-cover"}
          />
        </div>
        <div>
          <p className="md:text-md text-sm font-semibold">{product.name}</p>
          <div className="my-5 flex gap-1">{handleRating(reviewAverage)}</div>
          <p className="font-bold">
            {currencySymbol}
            {(Math.round(product.price * currencyRate * 100) / 100).toFixed(2)}
          </p>
        </div>
      </div>
    </Link>
  );
}
