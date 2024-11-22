import type { Config } from "tailwindcss";

const config: Config = {
  presets: [require("@repo/tailwind-config/base")],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,tsx}",
  ],
};
export default config;
