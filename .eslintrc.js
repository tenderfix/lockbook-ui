module.exports = {
  root: true,
  extends: '@abs-safety/eslint-config',
  parserOptions: {
    project: ['./tsconfig.json', './cypress/tsconfig.json'],
  },
};
