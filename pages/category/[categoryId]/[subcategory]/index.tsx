import type { GetStaticPaths, GetStaticProps } from "next";
import Category, { REVALIDATE_SECONDS, type CategoryProps } from "../index";
import { catalogs } from "../../../../utils/catalogs";
import { getProductsBySubcategory } from "../../../../lib/products";

export default function Subcategory({ productsAndAverage }: CategoryProps) {
  return <Category productsAndAverage={productsAndAverage} />;
}

export const getStaticProps: GetStaticProps<CategoryProps> = async ({
  params,
}) => {
  const res = await getProductsBySubcategory(String(params?.subcategory));
  const productsAndAverage = JSON.parse(JSON.stringify(res));

  return { props: { productsAndAverage }, revalidate: REVALIDATE_SECONDS };
};

export const getStaticPaths: GetStaticPaths = () => {
  const paths = catalogs.flatMap((category) =>
    category.subcategory.map((subcategory) => ({
      params: { categoryId: category.id, subcategory },
    })),
  );

  return { paths, fallback: false };
};
