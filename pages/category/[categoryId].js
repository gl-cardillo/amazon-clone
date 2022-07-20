import axios from "axios";
import Card from "../../components/Card";
import { catalogs } from "../../utils/catalogs";
export default function Category({ products }) {
  //console.log(products[0].category, catalogs[0].name)
  return (
    <div className="flex min-h-screen gap-3 p-3">
      <div className=" hidden md:block border-r-2 p-3">
        <h3>Categoeries</h3>

        {catalogs.map((category) => {
          return (
            <div>
              <p
                className={`${
                  category.name === products[0].categoryName &&
                  "font-bold text-lg"
                }`}
              >
                {category.name}
              </p>
            </div>
          );
        })}
      </div>
      <div>
        <h2 className="font-bold text-2xl">{products[0].categoryName}</h2>
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
  const paths = catalogs.map((catalog) => {
    return {
      params: { categoryId: catalog.id },
    };
  });

  return { paths, fallback: false };
};
