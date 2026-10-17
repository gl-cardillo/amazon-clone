import Link from "next/link";
import Image from "next/image";
import Card from "./ui/Card";
import Stars from "./ui/Stars";
import Price from "./ui/Price";
import { cn } from "../utils/cn";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  reviewAverage?: number;
}

export default function ProductCard({
  product,
  reviewAverage,
}: ProductCardProps) {
  // book and game covers are portrait, show them whole instead of cropping
  const isCover =
    product.categoryId === "books" || product.subcategory === "Videogame";

  return (
    <Link href={`/product/${product._id}`}>
      <Card className="m-2 flex w-full gap-5 p-3 transition-shadow duration-200 hover:shadow-lg md:h-100 md:w-61 md:flex-col lg:w-75">
        {/* product photos have white backgrounds, covers sit on a neutral tile */}
        <div
          className={cn(
            "relative h-37.5 w-32.5 min-w-32.5 overflow-hidden rounded-md md:h-52.5 md:w-full",
            isCover ? "bg-muted" : "bg-white",
          )}
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
          <Stars rating={reviewAverage} className="my-5" />
          <Price amount={product.price} className="font-bold" />
        </div>
      </Card>
    </Link>
  );
}
