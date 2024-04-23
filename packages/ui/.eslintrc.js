/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "@repo/eslint-config/react-internal.js",
    "@repo/eslint-config/react.js"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
