import { GroceryItemSortBy } from "@/graphql-codegen/frontend/graphql";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";

export type SortByValue = `${GroceryItemSortBy}`;

export const useGroceryListFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // use ref to avoid recreating those callbacks
  const searchParamsRef = useRef(searchParams);

  // if we use searchParams directly in the useMemo, it causes unnecessary re-renders since as long as one of the params changes, the searchParams object will be recreated
  // so instead of using searchParams in the dependency array, we extract the values we need from it and use them in the dependency array
  const storesSearchParam = searchParams.get("stores");
  const labelsSearchParam = searchParams.get("labels");
  const keywordSearchParam = searchParams.get("keyword");
  const sortBySearchParam = searchParams.get("sortBy");

  const stores = useMemo(
    () => storesSearchParam?.split(",") ?? [],
    [storesSearchParam],
  );
  const labels = useMemo(
    () => labelsSearchParam?.split(",") ?? [],
    [labelsSearchParam],
  );
  const keyword = useMemo(() => keywordSearchParam ?? "", [keywordSearchParam]);
  const sortBy: GroceryItemSortBy = useMemo(
    () => (sortBySearchParam as GroceryItemSortBy) ?? GroceryItemSortBy.Recency,
    [sortBySearchParam],
  );

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const onFilterChange = useCallback(
    (filters: { stores: string[]; labels: string[] }) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (filters.stores.length > 0) {
        params.set("stores", filters.stores.join(","));
      } else {
        params.delete("stores");
      }

      if (filters.labels.length > 0) {
        params.set("labels", filters.labels.join(","));
      } else {
        params.delete("labels");
      }

      router.push(`?${params.toString()}`);
    },
    [router],
  );

  const onSortByChange = useCallback(
    (sortBy: string) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      params.set("sortBy", sortBy);
      router.push(`?${params.toString()}`);
    },
    [router],
  );

  const onSearchChange = useCallback(
    (keyword: string) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      if (keyword) {
        params.set("keyword", keyword);
      } else {
        params.delete("keyword");
      }

      router.push(`?${params.toString()}`);
    },
    [router],
  );

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams(searchParamsRef.current.toString());
    params.delete("stores");
    params.delete("labels");
    params.delete("keyword");
    router.push(`?${params.toString()}`);
  }, [router]);

  const addLabelFilter = useCallback(
    (label: string) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      const labels = params.get("labels")?.split(",") ?? [];
      if (labels.includes(label)) return;
      labels.push(label);
      params.set("labels", labels.join(","));
      router.push(`?${params.toString()}`);
    },
    [router],
  );

  const addStoreFilter = useCallback(
    (store: string) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      const stores = params.get("stores")?.split(",") ?? [];
      if (stores.includes(store)) return;
      stores.push(store);
      params.set("stores", stores.join(","));
      router.push(`?${params.toString()}`);
    },
    [router],
  );

  return {
    stores,
    labels,
    keyword,
    sortBy,
    onSortByChange,
    onFilterChange,
    onSearchChange,
    addLabelFilter,
    addStoreFilter,
    resetFilters,
  };
};
