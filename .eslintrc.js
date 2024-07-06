/* eslint-disable no-dupe-keys */
module.exports = {
  env: {
    browser: true,
    // es2021: true,
    commonjs: false,

  },
  extends: ['prettier', 'airbnb-base', 'plugin:import/recommended'],
  plugins: ['prettier', 'eslint-plugin-no-cyrillic-string'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    // 'newline-after-var': ['error', 'always'],
    // options: {
    //   "indent": ["error", "tab"]
    // },
    'linebreak-style': 0,
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: false,
          minProperties: 1,
        },
        ObjectPattern: 'never',
      },
    ],
    'import/order': [
      'error',
      {
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'max-len': [
      'error',
      {
        ignoreTemplateLiterals: true,
        ignoreStrings: false,
        code: 250,
      },
    ],
    'no-duplicate-imports': 'error',
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'no-underscore-dangle': 'off',
    'object-curly-newline': 'off',
    'no-restricted-syntax': 'off',
    'no-console': 'off',
  },
};
