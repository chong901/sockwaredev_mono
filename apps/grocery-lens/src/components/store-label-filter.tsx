import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GetLabelsQuery, GetStoresQuery } from "@/graphql-codegen/frontend/graphql";
import { getLabelQuery, getStoresQuery } from "@/graphql/query";
import { useGroceryListFilter } from "@/hooks/use-grocery-list-filter";
import { cn } from "@/lib/utils";
import { useQuery } from "@apollo/client";
import { LoadingSpinner } from "@repo/ui/atoms";
import { Filter, X } from "lucide-react";
import { useState } from "react";
import { useDeepCompareEffect } from "react-use";

interface StoreFilterProps {
  storeData: GetStoresQuery | undefined;
  selectedStores: string[];
  handleStoreChange: (store: string) => void;
}

interface LabelFilterProps {
  labelData: GetLabelsQuery | undefined;
  selectedLabels: string[];
  handleLabelChange: (label: string) => void;
}

interface AppliedFiltersProps {
  appliedStores: string[];
  appliedLabels: string[];
  removeFilter: (type: "store" | "label", value: string) => void;
  clearAllFilters: () => void;
}

const StoreLabelFilter = () => {
  const { data: storeData, loading: storeLoading } = useQuery<GetStoresQuery>(getStoresQuery);
  const { data: labelData, loading: labelLoading } = useQuery<GetLabelsQuery>(getLabelQuery);

  const { labels: appliedLabels, stores: appliedStores, onFilterChange, resetFilters } = useGroceryListFilter();

  const [selectedLabels, setSelectedLabels] = useState<string[]>(appliedLabels ?? []);
  const [selectedStores, setSelectedStores] = useState<string[]>(appliedStores ?? []);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useDeepCompareEffect(() => {
    if (isFilterOpen) {
      setSelectedLabels(appliedLabels);
      setSelectedStores(appliedStores);
    }
  }, [appliedLabels, appliedStores, isFilterOpen]);

  const handleStoreChange = (store: string) => {
    setSelectedStores((prev) => (prev.includes(store) ? prev.filter((s) => s !== store) : [...prev, store]));
  };

  const handleLabelChange = (label: string) => {
    setSelectedLabels((prev) => (prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]));
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
    resetFilters();
  };

  const totalAppliedFilters = appliedStores.length + appliedLabels.length;

  const hasFilterData = (storeData?.getStores?.length ?? 0) > 0 || (labelData?.getLabels?.length ?? 0) > 0;

  return (
    <>
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn("border-purple-300 bg-white text-purple-600 hover:bg-purple-100", isFilterOpen ? "border-purple-500" : "")}>
            <Filter className="mr-2 h-4 w-4" />
            Filter {totalAppliedFilters > 0 && `(${totalAppliedFilters})`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          {storeLoading || labelLoading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="grid gap-4">
              {!hasFilterData && <NoFilterDataMessage />}
              {(storeData?.getStores?.length ?? 0) > 0 && <StoreFilter storeData={storeData} selectedStores={selectedStores} handleStoreChange={handleStoreChange} />}
              {(labelData?.getLabels?.length ?? 0) > 0 && <LabelFilter labelData={labelData} selectedLabels={selectedLabels} handleLabelChange={handleLabelChange} />}
              <Button onClick={applyFilters} className="w-full bg-purple-600 text-white hover:bg-purple-700">
                Apply Filters
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>

      {totalAppliedFilters > 0 && <AppliedFilters appliedStores={appliedStores} appliedLabels={appliedLabels} removeFilter={removeFilter} clearAllFilters={clearAllFilters} />}
    </>
  );
};

const NoFilterDataMessage = () => (
  <div>
    <p className="text-gray-600">No filter is created yet.</p>
  </div>
);

const StoreFilter: React.FC<StoreFilterProps> = ({ storeData, selectedStores, handleStoreChange }) => (
  <div className="space-y-2">
    <h4 className="font-medium leading-none">Stores</h4>
    <div className="flex flex-wrap gap-2">
      {storeData?.getStores?.map(({ id, name }) => (
        <Label key={id} className={`flex cursor-pointer items-center rounded-md border p-2 ${selectedStores.includes(name) ? "border-blue-600 bg-blue-100" : ""}`}>
          <Input type="checkbox" checked={selectedStores.includes(name)} onChange={() => handleStoreChange(name)} className="sr-only" />
          <span>{name}</span>
        </Label>
      ))}
    </div>
  </div>
);

const LabelFilter: React.FC<LabelFilterProps> = ({ labelData, selectedLabels, handleLabelChange }) => (
  <div className="space-y-2">
    <h4 className="font-medium leading-none">Labels</h4>
    <div className="flex flex-wrap gap-2">
      {labelData?.getLabels?.map(({ id, name }) => (
        <Label
          key={id}
          className={`flex cursor-pointer items-center rounded-full px-3 py-1 text-sm ${selectedLabels.includes(name) ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-800"}`}
        >
          <Input type="checkbox" checked={selectedLabels.includes(name)} onChange={() => handleLabelChange(name)} className="sr-only" />
          <span>{name}</span>
        </Label>
      ))}
    </div>
  </div>
);

const AppliedFilters: React.FC<AppliedFiltersProps> = ({ appliedStores, appliedLabels, removeFilter, clearAllFilters }) => (
  <div className="flex flex-wrap items-center gap-2">
    {appliedStores.map((store) => (
      <Button key={store} variant="outline" size="sm" className="border-blue-300 bg-blue-100 text-blue-600 hover:bg-blue-200" onClick={() => removeFilter("store", store)}>
        {store}
        <X className="ml-2 h-3 w-3" />
      </Button>
    ))}
    {appliedLabels.map((label) => (
      <Button key={label} variant="outline" size="sm" className="border-purple-300 bg-purple-100 text-purple-600 hover:bg-purple-200" onClick={() => removeFilter("label", label)}>
        {label}
        <X className="ml-2 h-3 w-3" />
      </Button>
    ))}
    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-purple-600" onClick={clearAllFilters}>
      Clear all
    </Button>
  </div>
);

export default StoreLabelFilter;
