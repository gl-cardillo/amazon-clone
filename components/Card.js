import React from "react";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";

import { CurrencyContext } from "../utils/context";

export default function Card({ product }) {
  const { currencySymbol, currencyRate } = useContext(CurrencyContext);

  return (
    <Link href={`/product/${product._id}`}>
      <a>
        <div className="flex gap-5 p-2 m-2 border-2 rounded bg-white w-full md:w-[265px] md:h-[400px] md:flex-col ">
          <img
            src={product.picUrl}
            className=" object-contain w-[150px] h-[200px] sm:w-[150px] md:self-center"
            alt="category"
          />
          <div>
            <p className="font-semibold mb-2">{product.name}</p>
            <p className="font-bold">
              {currencySymbol}
              {(Math.round(product.price * currencyRate * 100) / 100).toFixed(2)}
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
}
