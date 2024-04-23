/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: [
    'node_modules/',
    'dist/',
  ],
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'no-console': 0,
    'indent': [
      'error',
      2,
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'max-len': [
      'warn',
      {
        'code': 120,
        'tabWidth': 2,
        'comments': 120,
        'ignoreUrls': true,
        'ignoreTemplateLiterals': false,
        'ignoreRegExpLiterals': true,
      },
    ],
    'comma-dangle': [
      'error',
      {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'always-multiline',
        'exports': 'always-multiline',
        'functions': 'only-multiline',
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        'argsIgnorePattern': '^_',
      },
    ],
    'eol-last': [
      'error',
      'always',
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        'max': 2,
        'maxEOF': 1,
        'maxBOF': 0,
      },
    ],
  },
};
