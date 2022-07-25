import axios from "axios";
import Category from "../index";
import { catalogs } from "../../../../utils/catalogs";

export default function index({ products }) {
  return <Category products={products} />;
}

export const getStaticProps = async ({ params }) => {
  const res = await axios

    .get(`${process.env.MY_VARIABLE_API}/api/subcategory/${params.subcategory}`)
    .catch((err) => {
      console.log(err.message);
    });

  return { props: { products: res.data } };
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
