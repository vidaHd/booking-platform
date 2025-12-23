import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,jsx}"],
    extends: ["eslint:recommended"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
  },

  {
    files: ["**/*.{ts,tsx}"],
    extends: ["plugin:@typescript-eslint/recommended"],
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
]);
