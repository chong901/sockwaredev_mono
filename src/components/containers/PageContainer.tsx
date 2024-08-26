import { ComponentProps } from "react";

export const PageContainer = ({
  className,
  ...rest
}: ComponentProps<"div">) => (
  <div
    className={`h-screen bg-slate-50 flex justify-center items-center ${className}`}
    {...rest}
  />
);
