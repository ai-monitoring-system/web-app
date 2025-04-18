module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"), // Ensure Dart Sass is used
            },
          },
        ],
      },
    ],
  },
};