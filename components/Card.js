import axios from "axios";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { CurrencyContext } from "../utils/context";
import { handleRating } from "../utils/utils";

export default function Card({ product }) {
  const { currencySymbol, currencyRate } = useContext(CurrencyContext);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const getStars = () => {
      axios
        .get(`http://localhost:3000/api/review/getRating/${product._id}`)
        .then((res) => {
          setRating(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getStars();
  }, [product]);

  return (
    <Link href={`/product/${product._id}`}>
      <a>
        <div className="flex gap-5 p-2 m-2 border-2 rounded bg-white w-full md:w-[265px] md:h-[400px] md:flex-col hover:scale-[1.02] hover:shadow-xl">
          <img
            src={product.picUrl}
            className=" object-contain w-[150px] h-[200px] sm:w-[150px] md:self-center"
            alt="category"
          />
          <div>
            <p className="font-semibold mb-2">{product.name}</p>
            <div className="flex gap-1">{handleRating(rating)}</div>
            <p className="font-bold">
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
