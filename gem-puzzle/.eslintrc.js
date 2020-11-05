// eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }]

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },  
  indent: ['error', 2],
  rules: {
    'no-plusplus': 'off',
    'no-continue': 'off',
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js',
      },
    },
  },
};
