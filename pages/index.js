import Link from "next/link";
import Image from "next/image";
import { catalogs } from "../utils/catalogs";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

export default function Home() {
  const slideImages = [
    { image: "/images/shoes-slide.jpeg", link: "/category/clothes/Shoes" },
    {
      image: "/images/phones-slide.jpeg",
      link: "/category/electronics/Phones",
    },
    { image: "/images/pets-slide.jpeg", link: "/category/petsSupplies" },
  ];

  const properties = {
    duration: 3000,
    prevArrow: (
      <button>
        <IoIosArrowBack className="border-none ml-2 text-3xl text-white" />
      </button>
    ),
    nextArrow: (
      <button>
        <IoIosArrowForward className="border-none mr-2 text-3xl text-white" />
      </button>
    ),
  };

  return (
    <>
      <div className="slide-container">
        <Slide {...properties}>
          {slideImages.map((slideImage, index) => (
            <div className="each-slide" key={index}>
              <Link href={slideImage.link}>
                <a>
                  <div className="h-[250px] md:h-[350px] lg:h-[400px] xl:h-[550px] 3xl:h-[700px] w-full relative">
                    <Image src={slideImage.image} layout="fill" alt="ads" />
                  </div>
                </a>
              </Link>
            </div>
          ))}
        </Slide>
      </div>
      <div className="flex flex-wrap justify-center bg-slate-100 pt-2 ">
        {catalogs.map((catalog, index) => {
          return (
            <div
              key={index}
              className="p-3 m-3 max-w-xs bg-white hover:scale-[1.02] hover:shadow-xl"
            >
              <Link href={catalog.link}>
                <a>
                  <h2 className="font-bold pb-2 text-lg">{catalog.name}</h2>
                  <Image
                    src={catalog.image}
                    width={400}
                    height={400}
                    alt="category"
                  />
                  <p className=" text-slate-500">See more...</p>
                </a>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
