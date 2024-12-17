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
  const keywordSearchParam = searchParams.get("keyword");
  const sortBySearchParam = searchParams.get("sortBy");

  // getAll return array, useMemo will always recalculate so it's the same as using searchParams.getAll("stores") directly
  const stores = searchParams.getAll("stores") ?? [];
  const labels = searchParams.getAll("labels") ?? [];
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
      params.delete("stores");
      if (filters.stores.length > 0) {
        filters.stores.forEach((store) => params.append("stores", store));
      }

      params.delete("labels");
      if (filters.labels.length > 0) {
        filters.labels.forEach((label) => params.append("labels", label));
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
      const labels = params.getAll("labels") ?? [];
      if (labels.includes(label)) return;
      params.append("labels", label);
      router.push(`?${params.toString()}`);
    },
    [router],
  );

  const addStoreFilter = useCallback(
    (store: string) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      const stores = params.getAll("stores") ?? [];
      if (stores.includes(store)) return;
      params.append("stores", store);
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
