module.exports = {
  extends: [
    'plugin:vue/vue3-recommended',
    '@typescript-eslint',
    'eslint:recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: ['prettier'],
  rules: {
    'no-console': 'warn',
    'prettier/prettier': 'error',
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
  },
  ignorePatterns: ['node_modules', 'build', 'dist', 'public'],
}
