import { useEffect, useState } from "react";
import axios from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ProductWithRating } from "@/types";

export function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function useProductSearch(query: string) {
  const q = useDebouncedValue(query.trim());
  return useQuery({
    queryKey: ["search", q],
    queryFn: async ({ signal }) =>
      (
        await axios.get<ProductWithRating[]>("/api/product/search", {
          params: { q },
          signal,
        })
      ).data,
    enabled: q !== "",
    // keep showing the last results while the next ones load
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });
}
