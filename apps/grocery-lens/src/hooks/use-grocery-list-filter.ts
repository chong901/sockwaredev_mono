import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

export const useGroceryListFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // use ref to avoid recreating those callbacks
  const searchParamsRef = useRef(searchParams);

  const stores = searchParams.get("stores")?.split(",") ?? [];
  const labels = searchParams.get("labels")?.split(",") ?? [];
  const keyword = searchParams.get("keyword") ?? "";

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
    onFilterChange,
    onSearchChange,
    addLabelFilter,
    addStoreFilter,
    resetFilters,
  };
};
