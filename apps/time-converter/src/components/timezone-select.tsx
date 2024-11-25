"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";
import { FixedSizeList as List } from "react-window";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
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

const timezones = Intl.supportedValuesOf("timeZone");

export default function TimezoneSelect({
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

  // Debounce search input
  const debouncedSearch = useDebounce(search, 200);

  const timezoneOptions = React.useMemo(() => {
    if (!selectedTimezones || selectedTimezones.length === 0) {
      return timezones;
    }
    return timezones.filter(
      (timezone) =>
        !selectedTimezones.includes(timezone) &&
        timezone.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
  }, [debouncedSearch, selectedTimezones]);

  // Filtered timezones
  const filteredTimezones = React.useMemo(
    () =>
      timezoneOptions.filter((timezone) =>
        timezone.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    [debouncedSearch, timezoneOptions],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value || "Select timezone..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search timezone..."
            onValueChange={setSearch}
          />
          <CommandEmpty>No timezone found.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              <List
                height={300} // Adjust to fit the dropdown height
                itemCount={filteredTimezones.length}
                itemSize={40} // Adjust to fit the height of each item
                width="100%"
              >
                {({ index, style }) => {
                  const timezone = filteredTimezones[index];
                  return (
                    <div style={style}>
                      <CommandItem
                        key={timezone}
                        value={timezone}
                        onSelect={(currentValue) => {
                          onSelect(currentValue);
                          setSearch("");
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === timezone ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {timezone}
                      </CommandItem>
                    </div>
                  );
                }}
              </List>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
