"use client";

import { SearchInput } from "@/components/search-input";
import StoreLabelFilter from "@/components/store-label-filter";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SortByValue, useGroceryListFilter } from "@/hooks/use-grocery-list-filter";
import { cn } from "@/lib/utils";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
type SortByOption = {
  value: SortByValue;
  label: string;
};

const sortByValues: SortByOption[] = [
  { value: "NAME", label: "Name" },
  { value: "RECENCY", label: "Recency" },
  { value: "LOWEST_PRICE", label: "Lowest Price" },
  { value: "HIGHEST_PRICE", label: "Highest Price" },
  { value: "LOWEST_PRICE_PER_UNIT", label: "Lowest Price per unit" },
  { value: "HIGHEST_PRICE_PER_UNIT", label: "Highest Price per unit" },
];

export function GroceryFilterComponent() {
  const { keyword, sortBy, onSortByChange, onSearchChange } = useGroceryListFilter();
  const [search, setSearch] = useState(keyword);

  const [isSortByOpen, setIsSortByOpen] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleSearchChange = useCallback(
    debounce((search: string) => {
      onSearchChange(search);
    }, 300),
    [onSearchChange],
  );

  useEffect(() => {
    return () => debouncedHandleSearchChange.cancel();
  }, [debouncedHandleSearchChange]);

  useEffect(() => {
    setSearch(keyword);
  }, [keyword]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedHandleSearchChange(e.target.value);
  };

  const handleClearSearch = () => {
    setSearch("");
    onSearchChange("");
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput value={search} onChange={handleSearchChange} className="bg-white" onClear={handleClearSearch} placeholder="Search groceries" />
      <div className="flex items-center gap-2">
        <Label>Sort By</Label>
        <Select open={isSortByOpen} onOpenChange={setIsSortByOpen} onValueChange={onSortByChange} value={sortBy}>
          <SelectTrigger className={cn("w-fit border-purple-300 bg-white text-purple-600 hover:bg-purple-100 hover:text-black", isSortByOpen ? "border-purple-500" : "")}>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            {sortByValues.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <StoreLabelFilter />
    </div>
  );
}
