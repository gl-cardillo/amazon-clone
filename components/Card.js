import React from "react";
import Link from "next/link";
export default function Card({ product }) {
  return (
    <Link href={`/product/${product._id}`}>
      <a>
        <div className="flex gap-5 p-2 m-2 border-2 rounded bg-white md:w-[265px] md:h-[400px]  md:flex-col ">
          <img
            src={product.picUrl}
            className="w-[100px] h-[200px] sm:w-[150px] md:self-center"
            alt="category"
          />
          <div>
            <p className="font-semibold mb-2">{product.name}</p>
            <p className="font-bold">£{product.price} </p>
          </div>
        </div>
      </a>
    </Link>
  );
}
