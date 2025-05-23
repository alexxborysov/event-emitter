import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: "safari",
    },

    globals: true,

    reporters: ["verbose"],

    include: ["__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./packages/"),
    },
  },
});
