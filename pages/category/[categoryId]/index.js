import axios from "axios";
import Card from "../../../components/Card";
import Link from "next/link";
import { useRouter } from "next/router";
import { catalogs } from "../../../utils/catalogs";
export default function Category({ products }) {
  const router = useRouter();
  const categoryId = router.query.categoryId;
  const subcategoryId = router.query.subcategory || null;

  return (
    <div className="flex min-h-screen gap-3 p-3">
      <div className=" hidden md:block border-r-2 p-2 min-w-[170px]">
        <h3 className="text-2xl font-bold mb-3">Categoeries</h3>
        {catalogs.map((category, index) => {
          return (
            <div key={index}>
              <Link href={category.link}>
                <a>
                  <p
                    className={`${
                      category.id === categoryId && "font-bold text-lg"
                    }  mt-1`}
                  >
                    {category.name}
                  </p>
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
                          }  pl-5`}
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
      <div>
        <h2 className="font-bold text-3xl pl-6">{products[0].categoryName}</h2>
        <div className="md:flex md:flex-wrap justify-center">
          {products.map((product, index) => {
            return <Card key={index} product={product} />;
          })}
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = async ({ params }) => {
  const res = await axios

    .get(`http://localhost:3000/api/category/${params.categoryId}`)
    .catch((err) => {
      console.log(err.message);
    });

  return { props: { products: res.data } };
};

export const getStaticPaths = () => {
  const paths = catalogs.map((category) => {
    return {
      params: { categoryId: category.id },
    };
  });
  return { paths, fallback: false };
};
