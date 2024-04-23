/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/index.js"],
  parserOptions: {
    ecmaVersion: 2022
  },
  overrides: [
    {
      files: ["*.js"],
      rules: {
        '@typescript-eslint/no-var-requires': 'off'
      }
    }
  ]
};