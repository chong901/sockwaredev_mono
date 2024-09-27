import { ComponentProps } from "react";

export const GroceryLensLogo = (props: ComponentProps<"svg">) => (
  <svg viewBox="0 0 624 624" xmlns="http://www.w3.org/2000/svg" {...props}>
    {/* Grouping elements to apply transformations */}
    <g transform="translate(0, -112)">
      {/* Stylized Shopping Cart */}
      <path
        d="M62 204 L562 204 L500 556 L124 556 Z"
        fill="none"
        className="stroke-current"
        strokeWidth="60"
        strokeLinejoin="round"
      />

      {/* Wheels of the Cart */}
      <circle cx="180" cy="616" r="50" className="fill-current" />
      <circle cx="440" cy="616" r="50" className="fill-current" />

      {/* Price Tag Hanging from Cart Handle */}
      <path
        d="M62 204 L12 264 L12 344 L92 344 L92 264 Z"
        className="fill-current"
      />

      {/* Dollar Sign on Price Tag */}
      <text
        x="52"
        y="324"
        fontFamily="Helvetica, Arial, sans-serif"
        fontSize="80"
        className="fill-white"
        textAnchor="middle"
      >
        $
      </text>

      {/* Checkmark Inside Cart */}
      <path
        d="M200 394 L280 474 L440 314"
        fill="none"
        className="stroke-current"
        strokeWidth="60"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);
