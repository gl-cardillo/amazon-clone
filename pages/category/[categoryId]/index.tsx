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
    (category) => category.id === categoryId,
  );

  return (
    <div className="flex min-h-screen gap-3">
      <div className="fixed hidden h-[calc(100vh-60px)] min-w-[210px] border-r-2 bg-white p-2 md:block">
        <h2 className="mb-3 text-2xl font-bold">Categories</h2>
        {catalogs.map((category, index) => {
          return (
            <div key={index}>
              <Link href={category.link}>
                <h3
                  className={`${
                    category.id === categoryId && "text-lg font-bold"
                  } mt-1 transition-transform duration-200 ease-in-out hover:scale-[1.02]`}
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
                          subcategory === subcategoryId && "text-lg font-bold"
                        } pl-5 transition-transform duration-200 ease-in-out hover:scale-[1.02]`}
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
        <h3 className="mb-2 border-b-2 border-slate-300 pl-1 text-2xl font-bold md:hidden">
          {currentCategory?.name}
        </h3>
        <div className="flex items-center md:hidden">
          {currentCategory?.subcategory.map((subcategory, index) => {
            return (
              <Link key={index} href={`/category/${categoryId}/${subcategory}`}>
                <p
                  className={`${
                    subcategory === subcategoryId && "text-lg font-bold"
                  } pl-2`}
                >
                  {subcategory}
                </p>
              </Link>
            );
          })}
        </div>
        <div className="my-2 justify-center md:flex md:flex-wrap">
          {productsAndAverage.length === 0 && (
            <p className="pt-5 text-center">No products found</p>
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
