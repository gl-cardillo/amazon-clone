import axios from "axios";
import { useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function Product({ product }) {

  const [showDescription, setShowDescription] = useState(false);

  return (
    <div className="flex flex-col bg-slate-100 mx-2">
      <div className="flex flex-col gap-3 p-5 my-3 bg-white rounded-md  md:hidden ">
        <h3 className="font-bold text-xl">{product.name}</h3>
        <img src={product.picUrl} alt="category" />
        <p className="font-bold text-2xl self-center">£{product.price}</p>
      </div>
      <div className=" hidden md:flex bg-white rounded-md mx-52 my-3 gap-5 p-5 items-center">
        <div className="p-5 w-1/3">
          <img src={product.picUrl} className="w-full h-1/3" alt="category" />
        </div>
        <div className="flex flex-col self-baseline pt-16  ">
          <h3 className=" font-bold text-3xl">{product.name}</h3>
          <p className="font-bol  text-xl py-5">£{product.price}</p>
          <p className="flex gap-2 items-center">
            Description
            <MdKeyboardArrowDown
              className={showDescription ? "rotate-180 text-xl" : "text-xl"}
              onClick={() => {
                setShowDescription(!showDescription);
              }}
            />
          </p>
          {showDescription && (
            <div className=" max-w-md">
              <p>&#8226;{product.description}</p>
              <p>&#8226;{product.description2 && product.description2}</p>
              <p>&#8226;{product.description3}</p>
            </div>
          )}
        </div>
      </div>
      <div className="bg-white py-5 flex rounded-md md:mx-52 ">
        <button className=" bg-yellow-400 p-2 px-5 rounded-lg m-auto">
          Add to Cart
        </button>
      </div>
      <div className="p-5 bg-white rounded-md my-3 md:hidden ">
        <p className="flex gap-2 items-center">
          Description
          <MdKeyboardArrowDown
            className={showDescription ? "rotate-180 text-xl" : "text-xl"}
            onClick={() => {
              setShowDescription(!showDescription);
            }}
          />
        </p>
        {showDescription && (
          <div className=" max-w-sm">
            <p>&#8226;{product.description}</p>
            <p>&#8226;{product.description2 && product.description2}</p>
            <p>&#8226;{product.description3}</p>
          </div>
        )}
      </div>
    </div>
  );
}
export const getStaticProps = async ({ params }) => {

  const res = await axios.get(
    `http://localhost:3000/api/product/${params.productId}`
  );
  return { props: { product: res.data } };
};

export const getStaticPaths = async () => {
  const products = await axios.get(`http://localhost:3000/api/product`);

  return {
    paths: products.data.map((product) => {
      return {
        params: {
          productId: product._id,
        },
      };
    }),
    fallback: false,
  };
};
