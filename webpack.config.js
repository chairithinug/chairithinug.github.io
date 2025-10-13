const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // The entry point file described above
  entry: './minimal.js',
  // The location of the build folder described above
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
  // Optional and for development only. This provides the ability to
  // map the built code back to the original source format when debugging.
  // devtool: 'eval-source-map',
  devtool: 'source-map',
};