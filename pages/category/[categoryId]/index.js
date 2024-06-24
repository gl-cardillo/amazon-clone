import Card from "../../../components/Card";
import Link from "next/link";
import { useRouter } from "next/router";
import { catalogs } from "../../../utils/catalogs";
import { getDataCategory } from "../../api/category/[categoryId]";

export default function Category({ productsAndAverage }) {
  const router = useRouter();
  const categoryId = router.query.categoryId;
  const subcategoryId = router.query.subcategory || null;

  return (
    <div className="flex min-h-screen gap-3">
      <div className="hidden md:block fixed h-[calc(100vh-60px)] border-r-2 p-2 min-w-[210px] bg-white">
        <h2 className="text-2xl font-bold mb-3">Categories</h2>
        {catalogs.map((category, index) => {
          return (
            <div key={index}>
              <Link href={category.link}>
                <a>
                  <h3
                    className={`${
                      category.id === categoryId && "font-bold text-lg"
                    }  mt-1 hover:scale-[1.02] transition-transform duration-200 ease-in-out`}
                  >
                    {category.name}
                  </h3>
                </a>
              </Link>
              {category.id === categoryId &&
                category.subcategory.map((subcategory, index) => {
                  return (
                    <Link key={index} href={`${category.link}/${subcategory}`}>
                      <a>
                        <p
                          className={`${
                            subcategory === subcategoryId && "font-bold text-lg"
                          } pl-5 hover:scale-[1.02] transition-transform duration-200 ease-in-out`}
                        >
                          {subcategory}
                        </p>
                      </a>
                    </Link>
                  );
                })}
            </div>
          );
        })}
      </div>
      <div className="w-full ml-[200px]">
        <h3 className=" md:hidden font-bold text-2xl pl-1 mb-2  border-b-2 border-slate-300">
          {productsAndAverage[0].product.categoryName}
        </h3>
        <div className="md:hidden flex items-center">
          {catalogs
            .filter((category) => category.id === categoryId)[0]
            .subcategory.map((subcategory, index) => {
              return (
                <Link
                  key={index}
                  href={`/category/${categoryId}/${subcategory}`}
                >
                  <a>
                    <p
                      className={`${
                        subcategory === subcategoryId && "font-bold text-lg"
                      } pl-2`}
                    >
                      {subcategory}
                    </p>
                  </a>
                </Link>
              );
            })}
        </div>
        <div className="md:flex md:flex-wrap justify-center my-2">
          {productsAndAverage.map((products, index) => {
            return (
              <Card
                key={index}
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

export const getStaticProps = async ({ params }) => {
  const res = await getDataCategory(params.categoryId);
  const productsAndAverage = JSON.parse(JSON.stringify(res));

  return { props: { productsAndAverage } };
};

export const getStaticPaths = () => {
  const paths = catalogs.map((category) => {
    return {
      params: { categoryId: category.id },
    };
  });
  return { paths, fallback: false };
};
