import React, { MouseEventHandler } from "react";
import { DeleteIcon } from "./DeleteIcon";

interface DeleteIconProps {
  className?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export const DeleteButton: React.FC<DeleteIconProps> = ({
  className,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border border-red-300 bg-red-100 p-2 hover:bg-red-200 focus:outline-none ${className}`}
    >
      <DeleteIcon className="h-full w-full" />
    </button>
  );
};
