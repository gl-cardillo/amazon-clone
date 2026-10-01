import Link from "next/link";
import Image from "next/image";
import { catalogs } from "../utils/catalogs";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

export default function Home() {
  const slideImages = [
    {
      image: "/images/shoes-slide.jpg",
      link: "/category/clothes/Shoes",
      caption: ["Shoes.", "They're never enough"],
      position: "center",
    },
    {
      image: "/images/phones-slide.jpg",
      link: "/category/electronics/Phones",
      caption: ["Check new deals", "on phones"],
      position: "center 70%",
    },
    {
      image: "/images/pets-slide.jpg",
      link: "/category/petsSupplies",
      caption: ["Find a gift", "for your pets"],
      position: "center 40%",
    },
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
                    <Image
                      src={slideImage.image}
                      layout="fill"
                      objectFit="cover"
                      objectPosition={slideImage.position}
                      alt={slideImage.caption.join(" ")}
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/10 to-transparent">
                      <h2 className="p-5 md:p-10 lg:px-16 font-serif font-bold text-white text-2xl md:text-4xl lg:text-5xl drop-shadow-lg">
                        {slideImage.caption[0]}
                        <br />
                        {slideImage.caption[1]}
                      </h2>
                    </div>
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
              className="p-3 m-3 max-w-xs bg-white hover:scale-[1.01] shadow rounded hover:shadow-lg transition-transform duration-300 ease-in-out"
            >
              <Link href={catalog.link}>
                <a>
                  <h2 className="font-bold pb-2 text-lg">{catalog.name}</h2>
                  <Image
                    src={catalog.image}
                    width={400}
                    height={400}
                    objectFit="cover"
                    alt={catalog.name}
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
