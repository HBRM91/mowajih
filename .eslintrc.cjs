/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  ignorePatterns: [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.wrangler/**",
    "**/*.config.{js,cjs,ts}",
    "tooling/**",
    "docs/**",
  ],
  rules: {
    // Type-aware/style rules we don't enforce yet — keep CI signal on real bugs,
    // not on pre-existing style debt across the codebase.
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    "@typescript-eslint/no-empty-function": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "no-undef": "off", // TypeScript handles this; avoids false positives on JSX/global types
    "no-empty": "warn",
    "no-constant-condition": ["error", { checkLoops: false }],
  },
};
