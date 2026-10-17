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
      <div className="m-2 flex w-full gap-5 rounded-lg border border-border bg-surface p-3 shadow-sm transition-shadow duration-200 hover:shadow-lg md:h-100 md:w-61 md:flex-col lg:w-75">
        {/* product photos have white backgrounds, covers sit on a neutral tile */}
        <div
          className={`relative h-37.5 w-32.5 min-w-32.5 overflow-hidden rounded-md md:h-52.5 md:w-full ${
            isCover ? "bg-muted" : "bg-white"
          }`}
        >
          <Image
            src={product.picUrl}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 300px, (min-width: 768px) 245px, 130px"
            className={isCover ? "object-contain" : "object-cover"}
          />
        </div>
        <div>
          <p className="text-sm font-semibold md:text-base">{product.name}</p>
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
