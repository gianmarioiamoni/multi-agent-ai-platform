import { defineConfig, globalIgnores } from "eslint/config";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const typescriptPlugin = require("@typescript-eslint/eslint-plugin");
const typescriptParser = require("@typescript-eslint/parser");
const reactPlugin = require("eslint-plugin-react");
const reactHooksPlugin = require("eslint-plugin-react-hooks");
const nextPlugin = require("@next/eslint-plugin-next");

// Note: Next.js 15 eslint-config-next exports legacy configs (not flat config compatible)
// We manually configure the plugins and rules instead
const eslintConfig = defineConfig([
  // Override default ignores
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "@typescript-eslint": typescriptPlugin,
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      "@next/next": nextPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Next.js core-web-vitals rules
      ...nextPlugin.configs["core-web-vitals"].rules,
      // TypeScript recommended rules
      ...typescriptPlugin.configs.recommended.rules,
      
      // Enforce no 'any' types - ERROR
      "@typescript-eslint/no-explicit-any": "error",
      
      // Enforce no unused variables - ERROR
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      
      // Additional SOLID and clean code rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "curly": ["error", "all"],
      
      // React best practices
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-no-leaked-render": ["error", { validStrategies: ["ternary"] }],
      
      // TypeScript specific
      "@typescript-eslint/explicit-function-return-type": "off", // Allow inference
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
    },
  },
]);

export default eslintConfig;
