// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

// eslint.config.ts
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import storybook from "eslint-plugin-storybook";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      prettier,
      storybook,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      /* ------------------ JSX consistency ------------------ */

      // isEnabled={true} → isEnabled
      "react/jsx-boolean-value": ["error", "never"],

      // title={"text"} → title="text"
      "react/jsx-curly-brace-presence": [
        "error",
        { props: "never", children: "never" },
      ],

      /* ------------------ React & Hooks ------------------ */

      "react/react-in-jsx-scope": "off", // Next.js
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      /* ------------------ TypeScript sanity ------------------ */

      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],

      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],

      /* ------------------ Prettier integration ------------------ */

      "prettier/prettier": "error",
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

