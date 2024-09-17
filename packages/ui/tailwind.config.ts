import type { Config } from "tailwindcss";

const config: Config = {
  prefix: "ui-",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("@repo/tailwind-config/base")],
};
export default config;
