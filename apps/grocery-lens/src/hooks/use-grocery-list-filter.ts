import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const useGroceryListFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const stores = searchParams.get("stores")?.split(",") ?? [];
  const labels = searchParams.get("labels")?.split(",") ?? [];

  const onFilterChange = useCallback(
    (filters: { stores: string[]; labels: string[] }) => {
      const params = new URLSearchParams();

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
    [router]
  );

  return {
    stores,
    labels,
    onFilterChange,
  };
};
