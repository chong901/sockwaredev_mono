"use client";

import { Check, ChevronsUpDown, Search } from "lucide-react";
import * as React from "react";

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
import { CityHelper } from "@/lib/city";
import { cn } from "@/lib/utils";
import { City, GetCitiesResponse } from "@/types/api/cities";
import { useAtom } from "jotai";
import { atomWithMutation } from "jotai-tanstack-query";

export default function CitySelect({
  onSelect,
  selectedCities,
  buttonText,
}: {
  onSelect: (city: City) => void;
  selectedCities?: City[];
  buttonText?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const searchCitiesAtom = React.useMemo(
    () =>
      atomWithMutation(() => ({
        mutationKey: ["cities"],
        mutationFn: async (search: string) => {
          const response = await fetch(`/api/cities?search=${search}`);
          return ((await response.json()) as GetCitiesResponse).data;
        },
      })),
    [],
  );
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
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {buttonText || "Search cities..."}
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <CommandEmpty>
            {search ? "No cities found." : "Start typing to search for cities."}
          </CommandEmpty>
          <CommandList>
            <CommandGroup>
              {searchedCities?.map((city) => {
                const isSelectedCity = !!selectedCities?.find(
                  (selectedCity) => selectedCity.id === city.id,
                );
                return (
                  <CommandItem
                    key={city?.id}
                    value={city?.id}
                    onSelect={() => {
                      onSelect(city);
                      setSearch("");
                      setOpen(false);
                    }}
                    disabled={isSelectedCity}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelectedCity ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {CityHelper.getDisplayName(city)}
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
