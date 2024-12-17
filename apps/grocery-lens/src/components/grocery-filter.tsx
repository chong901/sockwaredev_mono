"use client";

import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GetLabelsQuery,
  GetStoresQuery,
} from "@/graphql-codegen/frontend/graphql";
import { getLabelQuery, getStoresQuery } from "@/graphql/query";
import {
  SortByValue,
  useGroceryListFilter,
} from "@/hooks/use-grocery-list-filter";
import { cn } from "@/lib/utils";
import { useQuery } from "@apollo/client";
import debounce from "lodash.debounce";
import { Check, Filter, X } from "lucide-react";
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
  const { data: storeData } = useQuery<GetStoresQuery>(getStoresQuery);
  const { data: labelData } = useQuery<GetLabelsQuery>(getLabelQuery);

  const {
    labels: appliedLabels,
    stores: appliedStores,
    keyword,
    sortBy,
    onSortByChange,
    onSearchChange,
    onFilterChange,
    resetFilters,
  } = useGroceryListFilter();
  const [search, setSearch] = useState(keyword);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    appliedLabels ?? [],
  );
  const [selectedStores, setSelectedStores] = useState<string[]>(
    appliedStores ?? [],
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortByOpen, setIsSortByOpen] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHandleSearchChange = useCallback(
    debounce((search: string) => {
      onSearchChange(search);
    }, 300),
    [onSearchChange],
  );

  useEffect(() => {
    if (isFilterOpen) {
      setSelectedLabels(appliedLabels);
      setSelectedStores(appliedStores);
    }
  }, [appliedLabels, appliedStores, isFilterOpen]);

  useEffect(() => {
    return () => debouncedHandleSearchChange.cancel();
  }, [debouncedHandleSearchChange]);

  useEffect(() => {
    setSearch(keyword);
  }, [keyword]);

  const handleStoreChange = (store: string) => {
    setSelectedStores((prev) =>
      prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store],
    );
  };

  const handleLabelChange = (label: string) => {
    setSelectedLabels((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label],
    );
  };

  const applyFilters = () => {
    onFilterChange({ stores: selectedStores, labels: selectedLabels });
    setIsFilterOpen(false);
  };

  const removeFilter = (type: "store" | "label", value: string) => {
    if (type === "store") {
      const newStores = appliedStores.filter((s) => s !== value);
      setSelectedStores(newStores);
      onFilterChange({ stores: newStores, labels: appliedLabels });
    } else {
      const newLabels = appliedLabels.filter((l) => l !== value);
      setSelectedLabels(newLabels);
      onFilterChange({ stores: appliedStores, labels: newLabels });
    }
  };

  const clearAllFilters = () => {
    setSelectedStores([]);
    setSelectedLabels([]);
    setSearch("");
    resetFilters();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedHandleSearchChange(e.target.value);
  };

  const handleClearSearch = () => {
    setSearch("");
    onSearchChange("");
  };

  const totalAppliedFilters = appliedStores.length + appliedLabels.length;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <SearchInput
        value={search}
        onChange={handleSearchChange}
        className="bg-white"
        onClear={handleClearSearch}
        placeholder="Search groceries"
      />
      <div className="flex items-center gap-2">
        <Label>Sort By</Label>
        <Select
          open={isSortByOpen}
          onOpenChange={setIsSortByOpen}
          onValueChange={onSortByChange}
          value={sortBy}
        >
          <SelectTrigger
            className={cn(
              "w-fit border-purple-300 bg-white text-purple-600 hover:bg-purple-100 hover:text-black",
              isSortByOpen ? "border-purple-500" : "",
            )}
          >
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
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "border-purple-300 bg-white text-purple-600 hover:bg-purple-100",
              isFilterOpen ? "border-purple-500" : "",
            )}
          >
            <Filter className="mr-2 h-4 w-4" />
            Filter {totalAppliedFilters > 0 && `(${totalAppliedFilters})`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Stores</h4>
              <div className="grid grid-cols-2 gap-2">
                {storeData?.getStores?.map(({ id, name }) => (
                  <Label
                    key={id}
                    className={`flex cursor-pointer items-center space-x-2 rounded-md border p-2 ${
                      selectedStores.includes(name)
                        ? "border-blue-600 bg-blue-100"
                        : ""
                    }`}
                  >
                    <Input
                      type="checkbox"
                      checked={selectedStores.includes(name)}
                      onChange={() => handleStoreChange(name)}
                      className="sr-only"
                    />
                    <span>{name}</span>
                    {selectedStores.includes(name) && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </Label>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Labels</h4>
              <div className="flex flex-wrap gap-2">
                {labelData?.getLabels?.map(({ id, name }) => (
                  <Label
                    key={id}
                    className={`flex cursor-pointer items-center space-x-2 rounded-full px-3 py-1 text-sm ${
                      selectedLabels.includes(name)
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <Input
                      type="checkbox"
                      checked={selectedLabels.includes(name)}
                      onChange={() => handleLabelChange(name)}
                      className="sr-only"
                    />
                    <span>{name}</span>
                  </Label>
                ))}
              </div>
            </div>
            <Button
              onClick={applyFilters}
              className="w-full bg-purple-600 text-white hover:bg-purple-700"
            >
              Apply Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {totalAppliedFilters > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {appliedStores.map((store) => (
            <Button
              key={store}
              variant="outline"
              size="sm"
              className="border-blue-300 bg-blue-100 text-blue-600 hover:bg-blue-200"
              onClick={() => removeFilter("store", store)}
            >
              {store}
              <X className="ml-2 h-3 w-3" />
            </Button>
          ))}
          {appliedLabels.map((label) => (
            <Button
              key={label}
              variant="outline"
              size="sm"
              className="border-purple-300 bg-purple-100 text-purple-600 hover:bg-purple-200"
              onClick={() => removeFilter("label", label)}
            >
              {label}
              <X className="ml-2 h-3 w-3" />
            </Button>
          ))}
          {totalAppliedFilters > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-purple-600"
              onClick={clearAllFilters}
            >
              Clear all
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
