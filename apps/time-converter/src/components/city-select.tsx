"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import * as React from "react";

import { searchCitiesAtom } from "@/components/store/city";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import { useAtom } from "jotai";

export default function CitySelect({
  onSelect,
  selectedTimezones,
  value,
}: {
  onSelect: (timezone: string) => void;
  value: string;
  selectedTimezones?: string[];
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [{ data: searchedCities, mutate: searchCities }] =
    useAtom(searchCitiesAtom);

  // Debounce search input
  const debouncedSearch = useDebounce(search, 200);

  React.useEffect(() => {
    if (!debouncedSearch) return;
    searchCities(debouncedSearch);
  }, [debouncedSearch, searchCities]);

  return (
    <Popover
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) setSearch("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value || "Search cities..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <input
              className={cn(
                "flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
              )}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CommandEmpty>
            {search ? "No cities found." : "Start typing to search for cities."}
          </CommandEmpty>
          <CommandList>
            <CommandGroup>
              {searchedCities?.map((city) => {
                const displayValue = [city?.name, city?.country, city?.timezone]
                  .filter(Boolean)
                  .join(", ");
                return (
                  <CommandItem
                    key={city?.id}
                    value={city?.id}
                    onSelect={(currentValue) => {
                      onSelect(currentValue);
                      setSearch("");
                      setOpen(false);
                    }}
                    disabled={selectedTimezones?.includes(city!.timezone)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === city?.id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {displayValue}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
