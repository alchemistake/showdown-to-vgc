module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    extraFileExtensions: ['.ts'],
  },
  env: {
    node: true,
    es2021: true,
  },
  plugins: ['prettier'],
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  rules: {
    'no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
  },
  ignorePatterns: ['build/', 'node_modules/'],
};
