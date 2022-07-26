import Link from "next/link";
import Image from "next/image";
import { catalogs } from "../utils/catalogs";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

export default function Home() {
  const slideImages = [
    { image: "/images/phones-slide.jpeg", link: "/electronics" },
    { image: "/images/pets-slide.jpeg", link: "/pets" },
    { image: "/images/shoes-slide.jpeg", link: "/clothes" },
  ];

  return (
    <>
      <div className="slide-container">
        <Slide>
          {slideImages.map((slideImage, index) => (
            <div className="each-slide" key={index}>
              <img
                key={index}
                className="h-auto max-h-[500px] xl:max-h-[600px] w-full"
                src={slideImage.image}
                alt=""
              />
            </div>
          ))}
        </Slide>
      </div>
      <div className="flex flex-wrap justify-center bg-slate-100 ">
        {catalogs.map((catalog, index) => {
          return (
            <div key={index} className="p-3 m-3 max-w-xs bg-white hover:scale-[1.02] hover:shadow-xl">
              <Link href={catalog.link}>
                <a>
                  <h2 className="font-bold pb-2 text-lg">{catalog.name}</h2>
                  <Image
                    src={catalog.image}
                    width={"400px"}
                    height={"400px"}
                    alt="category"
                  />
                  <p className=" text-blue-600">See more...</p>
                </a>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
