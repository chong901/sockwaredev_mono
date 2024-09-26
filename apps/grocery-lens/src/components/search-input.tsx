"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ComponentProps } from "react";

type GrocerySearchProps = {
  onClear?: () => void;
} & Pick<
  ComponentProps<"input">,
  "className" | "onChange" | "value" | "placeholder"
>;

export function SearchInput({
  value,
  onChange,
  onClear,
  className,
  placeholder,
}: GrocerySearchProps) {
  const inputClassName = cn(
    "pr-10 border-purple-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50",
    className,
  );

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputClassName}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </button>
      )}
    </div>
  );
}
