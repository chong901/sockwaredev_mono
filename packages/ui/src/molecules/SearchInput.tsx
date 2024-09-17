import React, { FocusEventHandler, forwardRef } from "react";

type SearchInputProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  onClear: () => void;
  children?: React.ReactNode;
};

export const SearchInput = forwardRef<HTMLDivElement, SearchInputProps>(
  function SearchInput(
    { placeholder = "Search...", value, onChange, onClear, children, onFocus },
    ref,
  ) {
    return (
      <div
        className="absolute left-1/2 top-[10px] z-[1000] w-3/4 -translate-x-1/2 transform md:top-6 md:w-4/12"
        ref={ref}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          className="w-full rounded-lg border border-gray-300 px-12 py-2 text-3xl shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            className={`h-8 w-8 text-gray-400`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 5.65a7.5 7.5 0 010 10.6z"
            ></path>
          </svg>
        </div>
        {value && (
          <button
            onClick={onClear}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <svg
              className={`h-8 w-8 text-gray-400 hover:text-gray-600`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        )}
        {children && (
          <div className="absolute top-[56px] w-full">{children}</div>
        )}
      </div>
    );
  },
);
