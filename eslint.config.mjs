import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export const sharedConfig = [
  {
    // 공통 무시 파일들
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      ".yarn/**",
      "packages/front/next-env.d.ts",
    ],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];

export default sharedConfig;
