module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:jsdoc/recommended',
  ],
  parserOptions: {
    ecmaVersion: 13,
    project: './tsconfig.eslint.json',
    sourceType: 'module',
  },
  plugins: [
    'jsdoc',
  ],
  rules: {
  },
};
