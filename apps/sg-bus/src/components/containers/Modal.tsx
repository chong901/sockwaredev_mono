import { ComponentProps, forwardRef, Ref } from "react";

export const Modal = forwardRef(function ModalComp(
  { className, ...rest }: ComponentProps<"div">,
  ref: Ref<HTMLDivElement>,
) {
  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 ${className ?? ""}`}
      {...rest}
      ref={ref}
    />
  );
});
