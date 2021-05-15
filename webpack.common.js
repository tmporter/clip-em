const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  entry: {
    main: "./src/index.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader",
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: "file-loader",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
  },
  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
    }),
    new CopyPlugin({
      patterns: [{ from: "src/assets", to: "assets" }],
    }),
    new HtmlWebpackPlugin({ template: "./index.html" }),
  ],
  output: {
    clean: true,
  },
};
