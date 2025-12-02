import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import nextPlugin from "@next/eslint-plugin-next";
import globals from "globals";
import { sharedConfig } from "../../eslint.config.mjs";
import suspensePlugin from "eslint-plugin-react-suspense-check";

export default [
  ...sharedConfig,
  suspensePlugin.configs.recommended,
  {
    ...pluginReactConfig,
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "react/react-in-jsx-scope": "off",
      "react-suspense-check/detect-suspense-hook": ["warn", { language: "kr" }],
    },
    settings: {
      next: {
        rootDir: ".",
      },
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
