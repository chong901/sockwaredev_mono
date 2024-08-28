import { ComponentProps } from "react";

export const PageContainer = ({
  className,
  ...rest
}: ComponentProps<"div">) => (
  <div
    className={`flex h-svh items-center justify-center bg-slate-50 ${className}`}
    {...rest}
  />
);
