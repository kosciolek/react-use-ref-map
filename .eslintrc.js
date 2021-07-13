module.exports = {
  root: true,
  extends: ["airbnb-typescript/base", "plugin:jest/recommended", "prettier"],
  plugins: ["jest"],
  env: {
    node: true
  },
  parserOptions: {
    project: "./tsconfig.eslint.json",
  },
  rules: {
    "import/no-default-export": "error",
    "import/prefer-default-export": "off",
    "no-underscore-dangle": "off"
  }
};
