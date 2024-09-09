import { ComponentProps } from "react";

export const HomeIcon = (props: ComponentProps<"svg">) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 12l9-9 9 9M4 10v10a2 2 0 002 2h12a2 2 0 002-2V10"
    />
  </svg>
);
