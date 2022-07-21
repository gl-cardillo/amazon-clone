import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Card from "../components/Card";

export default function Search() {
  const router = useRouter();
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    if (router.isReady) {
      let { search } = router.query;
      setSearchResult(JSON.parse(search));
    }
  }, [router.isReady]);

  return (
    <div className="m-5">
      <h2 className="text-xl font-bold">Search Result</h2>
      <p className="text-sm">
        {searchResult.length} product{searchResult.length > 1 && "s" } found
      </p>
      {searchResult.map((product, index) => {
        return <Card key={index} product={product} />;
      })}
    </div>
  );
}
