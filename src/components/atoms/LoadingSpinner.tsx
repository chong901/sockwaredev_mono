import { ComponentProps } from "react";

export const LoadingSpinner = (props: ComponentProps<"div">) => (
  <div
    className="w-12 h-12 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"
    {...props}
  />
);
