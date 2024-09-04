import { ComponentProps } from "react";

export const LoadingSpinner = ({
  className,
  ...rest
}: ComponentProps<"div">) => (
  <div
    className={`h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent ${className ?? ""}`}
    {...rest}
  />
);
