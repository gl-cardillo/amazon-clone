import Category from "../index";
import { catalogs } from "../../../../utils/catalogs";
import { getProductsBySubcategory } from "../../../../lib/products";
export default function index({ products }) {
  return <Category productsAndAverage={products} />;
}

export const getStaticProps = async ({ params }) => {
  let res = await getProductsBySubcategory(params.subcategory);

  res = JSON.parse(JSON.stringify(res));
  return { props: { products: res } };
};

export const getStaticPaths = () => {
  const paths = catalogs
    .map((category) =>
      category.subcategory.map((subcategory) => {
        return {
          params: { categoryId: category.id, subcategory },
        };
      })
    )
    .flat();

  return { paths, fallback: false };
};
