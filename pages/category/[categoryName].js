import axios from "axios";
import Card from "../../components/Card";

export default function Category({ products }) {
  return (
    <div className="flex min-h-screen gap-3 p-3">
      <div className=" hidden md:block border-r-2 p-3">
        <h3>Categoeries</h3>
        <p>bla</p>
        <p>bla</p>
      </div>
      <div>
        <h2 className="font-bold text-2xl">
          {products[0].category.charAt(0).toUpperCase() +
            products[0].category.slice(1)}
        </h2>
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
  const res = await axios.get(
    `http://localhost:3000/api/category/${params.categoryName}`
  );

  return { props: { products: res.data } };
};

export const getStaticPaths = () => {
  return {
    paths: [
      { params: { categoryName: "electronics" } },
      { params: { categoryName: "videogame&console" } },
      { params: { categoryName: "clothes" } },
      { params: { categoryName: "petsSupplies" } },
      { params: { categoryName: "kitchenProduct" } },
      { params: { categoryName: "books" } },
      { params: { categoryName: "personalCare" } },
    ],
    fallback: false,
  };
};
