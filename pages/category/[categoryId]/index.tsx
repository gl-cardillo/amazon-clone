import Card from "../../../components/Card";
import Link from "next/link";
import { useRouter } from "next/router";
import { catalogs } from "../../../utils/catalogs";
import { getProductsByCategory } from "../../../lib/products";
import type { GetStaticPaths, GetStaticProps } from "next";
import type { ProductWithRating } from "@/types";

export interface CategoryProps {
  productsAndAverage: ProductWithRating[];
}

// rebuild the page at most once a minute so new ratings show up
export const REVALIDATE_SECONDS = 60;

export default function Category({ productsAndAverage }: CategoryProps) {
  const router = useRouter();
  const categoryId = router.query.categoryId;
  const subcategoryId = router.query.subcategory || null;
  const currentCategory = catalogs.find(
    (category) => category.id === categoryId
  );

  return (
    <div className="flex min-h-screen gap-3">
      <div className="hidden md:block fixed h-[calc(100vh-60px)] border-r-2 p-2 min-w-[210px] bg-white">
        <h2 className="text-2xl font-bold mb-3">Categories</h2>
        {catalogs.map((category, index) => {
          return (
            <div key={index}>
              <Link href={category.link}>
                <h3
                  className={`${
                    category.id === categoryId && "font-bold text-lg"
                  }  mt-1 hover:scale-[1.02] transition-transform duration-200 ease-in-out`}
                >
                  {category.name}
                </h3>
              </Link>
              {category.id === categoryId &&
                category.subcategory.map((subcategory, index) => {
                  return (
                    <Link key={index} href={`${category.link}/${subcategory}`}>
                      <p
                        className={`${
                          subcategory === subcategoryId && "font-bold text-lg"
                        } pl-5 hover:scale-[1.02] transition-transform duration-200 ease-in-out`}
                      >
                        {subcategory}
                      </p>
                    </Link>
                  );
                })}
            </div>
          );
        })}
      </div>
      <div className="w-full md:ml-[210px]">
        <h3 className=" md:hidden font-bold text-2xl pl-1 mb-2  border-b-2 border-slate-300">
          {currentCategory?.name}
        </h3>
        <div className="md:hidden flex items-center">
          {currentCategory?.subcategory.map((subcategory, index) => {
            return (
              <Link key={index} href={`/category/${categoryId}/${subcategory}`}>
                <p
                  className={`${
                    subcategory === subcategoryId && "font-bold text-lg"
                  } pl-2`}
                >
                  {subcategory}
                </p>
              </Link>
            );
          })}
        </div>
        <div className="md:flex md:flex-wrap justify-center my-2">
          {productsAndAverage.length === 0 && (
            <p className="text-center pt-5">No products found</p>
          )}
          {productsAndAverage.map((products) => {
            return (
              <Card
                key={products.product._id}
                product={products.product}
                reviewAverage={products.reviewAverage}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps<CategoryProps> = async ({
  params,
}) => {
  const res = await getProductsByCategory(String(params?.categoryId));
  const productsAndAverage = JSON.parse(JSON.stringify(res));

  return { props: { productsAndAverage }, revalidate: REVALIDATE_SECONDS };
};

export const getStaticPaths: GetStaticPaths = () => {
  const paths = catalogs.map((category) => {
    return {
      params: { categoryId: category.id },
    };
  });
  return { paths, fallback: false };
};
