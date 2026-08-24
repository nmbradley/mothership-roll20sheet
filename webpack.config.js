/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");

module.exports = {
  entry: "./src/ts/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts"],
  },
  output: {
    filename: "sheetworkers.js",
    path: path.resolve(__dirname, "src/js"),
  },
  optimization: {
    chunkIds: "named",
    mangleExports: false,
    minimize: false,
  },
};
