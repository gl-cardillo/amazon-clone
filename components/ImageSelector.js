import { useState } from "react";
import Image from "next/image";

export default function ImageSelector({ product }) {
  const [pic, setPic] = useState(product.picUrl);
  return (
    <div className="flex flex-col items-center gap-5">
      <Image
        src={pic}
        width={250}
        height={300}
        className="object-scale-down"
        alt="category"
      />
      <div className="flex gap-2">
        <button
          className={`w-3.5 h-3.5 rounded-full ${
            pic === product.picUrl ? "bg-black" : "bg-slate-400"
          }`}
          onClick={() => setPic(product.picUrl)}
        ></button>
        <button
          className={`w-3.5 h-3.5 rounded-full ${
            pic === product.picUrl2 ? "bg-black" : "bg-slate-400"
          }`}
          onClick={() => setPic(product.picUrl2)}
        ></button>
        <button
          className={`w-3.5 h-3.5 rounded-full ${
            pic === product.picUrl3 ? "bg-black" : "bg-slate-400"
          }`}
          onClick={() => setPic(product.picUrl3)}
        ></button>
      </div>
    </div>
  );
}
