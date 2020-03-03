module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    sourceType: 'module',
  //   allowImportExportEverywhere: false,
  //   ecmaVersion: 6,
  //   ecmaFeatures: {
  //     modules: true,
  //     experimentalObjectRestSpread: true,
  //   },
  //   babelOptions: {
  //     configFile: 'src/.babelrc'
  //   }
  },
  overrides: [
    {
      files: ["**/*.ts"],
      parser: '@typescript-eslint/parser',
      plugins: [
        '@typescript-eslint',
      ],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint'
      ]
    }
  ],
  env: {
    es6: true,
    browser: true,
    node: true,
    // jest: true,
  },
  rules: {
    quotes: ['warn', 'single'],
    semi: ['warn', 'never'],
    // 'no-unused-vars': ['warn', 'local'],
  },
  ignorePatterns: ['dist/']
}
