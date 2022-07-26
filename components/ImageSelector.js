import React from "react";
import { useState } from "react";
import Image from 'next/image'

export default function ImageSelector({ product }) {
  const [pic, setPic] = useState(product.picUrl);
  return (
    <div className="flex flex-col items-center gap-5">
          <Image src={pic} width={300} height={350} className="object-scale-down" alt="category" />
      <div className="flex gap-2">
        <button
          className={`p-2 border border-slate-700 rounded-full ${
            pic === product.picUrl && "bg-slate-400"
          }`}
          onClick={() => setPic(product.picUrl)}
        ></button>
        <button
          className={`p-2 border border-slate-700 rounded-full ${
            pic === product.picUrl2 && "bg-slate-600"
          }`}
          onClick={() => setPic(product.picUrl2)}
        ></button>
        <button
          className={`p-2 border border-slate-700 rounded-full ${
            pic === product.picUrl3 && "bg-slate-600"
          }`}
          onClick={() => setPic(product.picUrl3)}
        ></button>
      </div>
    </div>
  );
}
