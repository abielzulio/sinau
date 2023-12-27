import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: [...fontFamily.sans],
      },
      colors: {
        "off-white": "#f9fafb",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
