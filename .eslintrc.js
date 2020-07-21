const path = require("path");

module.exports = {
  root: true,
  settings: {
    "import/resolver": {
      webpack: {
        config: path.resolve("./config/webpack/development"),
      },
      node: {
        paths: ["src"],
        extensions: [".js"],
      },
    },
    react: {
      version: "detect",
    },
  },
  extends: "@ableco",
  rules: {
    "unicorn/prefer-query-selector": "off",
  },
};
