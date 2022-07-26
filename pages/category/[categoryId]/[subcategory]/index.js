import axios from "axios";
import Category from "../index";
import { catalogs } from "../../../../utils/catalogs";
import { getDataSubcategory } from "../../../api/subcategory/[subcategoryId]";
export default function index({ products }) {
  return <Category products={products} />;
}

export const getStaticProps = async ({ params }) => {
  let res = await getDataSubcategory(params.subcategory);

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
