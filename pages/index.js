import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

export default function Home() {
  useEffect(() => {
    console.log(localStorage.getItem("user_amazon_lc"));
    console.log(localStorage.getItem("token_amazon_lc"));
  }, []);

  const slideImages = [
    { image: "/images/phones-slide.jpeg", link: "/electronics" },
    { image: "/images/pets-slide.jpeg", link: "/pets" },
    { image: "/images/shoes-slide.jpeg", link: "/clothes" },
  ];
  const catalogs = [
    {
      name: "Electronics",
      image: "/images/electronic_devices_catalog.jpeg",
      link: "category/electronics",
    },
    {
      name: "Videogame & Console",
      image: "/images/console_videogame_catalog.jpeg",
      link: "category/videogame&console",
    },
    {
      name: "Clothes",
      image: "/images/clothes_catalog.jpeg",
      link: "category/clothes",
    },
    {
      name: "Pets supplies",
      image: "/images/pets_catalog.jpeg",
      link: "category/petsSupplies",
    },
    {
      name: "Books",
      image: "/images/books_catalog.jpeg",
      link: "category/books",
    },
    {
      name: "Personal care",
      image: "/images/personal_care_catalog.jpeg",
      link: "category/personalCare",
    },
    {
      name: "Kitchen products",
      image: "/images/kitchen_catalog.jpeg",
      link: "category/kitchenProduct",
    },
  ];
  return (
    <>
      <div className="slide-container">
        <Slide>
          {slideImages.map((slideImage, index) => (
            <div className="each-slide" key={index}>
              <img
                key={index}
                className="h-auto max-h-[500px] w-full"
                src={slideImage.image}
                alt=""
              />
            </div>
          ))}
        </Slide>
      </div>
      <div className="flex flex-wrap justify-center bg-slate-100">
        {catalogs.map((catalog, index) => {
          return (
            <div key={index} className="p-3 m-3 max-w-xs bg-white ">
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
