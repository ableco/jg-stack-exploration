const { environment } = require("@rails/webpacker");
const { UnusedFilesWebpackPlugin } = require("unused-files-webpack-plugin");

const unusedFilesPlugin = new UnusedFilesWebpackPlugin({
  patterns: "src/**/*.{js,css}",
  globOptions: {
    ignore: [
      "node_modules/**/*",
      "**/*.test.js",
      "src/__tests__/*",
      "src/__mocks__/*",
      "coverage/**/*",
    ],
  },
});

environment.plugins.append("Unused Files", unusedFilesPlugin);

module.exports = environment;
