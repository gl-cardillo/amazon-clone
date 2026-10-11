import Card from "../components/Card";
import { searchProducts } from "../lib/products";

export default function Search({ query, productsAndAverage }) {
  return (
    <div className="m-5">
      <h2 className="text-xl font-bold">Search Result</h2>
      <p className="text-sm">
        {productsAndAverage.length} product
        {productsAndAverage.length !== 1 && "s"} found for &quot;{query}&quot;
      </p>
      {productsAndAverage.map(({ product, reviewAverage }) => {
        return (
          <Card
            key={product._id}
            product={product}
            reviewAverage={reviewAverage}
          />
        );
      })}
    </div>
  );
}

export async function getServerSideProps(context) {
  const query = (context.query.q || "").toString().trim();
  if (!query) {
    return { props: { query, productsAndAverage: [] } };
  }

  const productsAndAverage = await searchProducts(query);

  return {
    props: {
      query,
      productsAndAverage: JSON.parse(JSON.stringify(productsAndAverage)),
    },
  };
}
