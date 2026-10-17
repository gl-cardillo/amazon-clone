import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types";

export default function ImageSelector({ product }: { product: Product }) {
  const pics = [product.picUrl, product.picUrl2, product.picUrl3].filter(
    (url): url is string => Boolean(url),
  );
  const [pic, setPic] = useState(product.picUrl);
  return (
    <div className="flex flex-col items-center gap-5">
      <Image
        src={pic}
        width={250}
        height={300}
        className="rounded-md bg-white object-scale-down p-2"
        alt={product.name}
      />
      {pics.length > 1 && (
        <div className="flex gap-2">
          {pics.map((url) => (
            <button
              key={url}
              aria-label="Show image"
              className={`h-3.5 w-3.5 rounded-full ${
                pic === url ? "bg-foreground" : "bg-muted-foreground/40"
              }`}
              onClick={() => setPic(url)}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
}
