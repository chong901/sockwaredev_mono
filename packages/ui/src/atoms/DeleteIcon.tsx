import React from "react";

interface DeleteIconProps {
  className?: string;
  onClick?: () => void;
}

export const DeleteIcon: React.FC<DeleteIconProps> = ({
  className,
  onClick,
}) => {
  return (
    <svg
      onClick={onClick}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      className={`h-6 w-6 cursor-pointer text-red-600 ${className}`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12h14"
      />
    </svg>
  );
};
