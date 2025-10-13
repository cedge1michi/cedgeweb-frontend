import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  // safelist: [
  //   "leading-[1.9]",
  //   "whitespace-pre-wrap",
  //   "underline",
  //   "underline-offset-2",
  //   "transition-colors",
  //   "break-words",
  //   "group",
  //   "text-blue-600",
  //   "hover:text-blue-700",
  //   "group-hover:text-blue-700",
  // ],
  plugins: [],
};
export default config;
