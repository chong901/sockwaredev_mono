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
  const sortBy: GroceryItemSortBy = useMemo(() => (sortBySearchParam as GroceryItemSortBy) ?? GroceryItemSortBy.Recency, [sortBySearchParam]);

  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  const updateSearchParams = useCallback(
    (callback: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParamsRef.current.toString());
      callback(params);
      router.push(`?${params.toString()}`);
    },
    [router],
  );

  const onFilterChange = useCallback(
    (filters: { stores: string[]; labels: string[] }) => {
      updateSearchParams((params) => {
        params.delete("stores");
        if (filters.stores.length > 0) {
          filters.stores.forEach((store) => params.append("stores", store));
        }
        params.delete("labels");
        if (filters.labels.length > 0) {
          filters.labels.forEach((label) => params.append("labels", label));
        }
      });
    },
    [updateSearchParams],
  );

  const onSortByChange = useCallback(
    (sortBy: string) => {
      updateSearchParams((params) => {
        params.set("sortBy", sortBy);
      });
    },
    [updateSearchParams],
  );

  const onSearchChange = useCallback(
    (keyword: string) => {
      updateSearchParams((params) => {
        if (keyword) {
          params.set("keyword", keyword);
        } else {
          params.delete("keyword");
        }
      });
    },
    [updateSearchParams],
  );

  const resetFilters = useCallback(() => {
    updateSearchParams((params) => {
      params.delete("stores");
      params.delete("labels");
      params.delete("keyword");
    });
  }, [updateSearchParams]);

  const addLabelFilter = useCallback(
    (label: string) => {
      updateSearchParams((params) => {
        const labels = params.getAll("labels") ?? [];
        if (!labels.includes(label)) {
          params.append("labels", label);
        }
      });
    },
    [updateSearchParams],
  );

  const addStoreFilter = useCallback(
    (store: string) => {
      updateSearchParams((params) => {
        const stores = params.getAll("stores") ?? [];
        if (!stores.includes(store)) {
          params.append("stores", store);
        }
      });
    },
    [updateSearchParams],
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
