var merge = require('webpack-merge');
var baseConfig = require('./webpack.config.dev.js');
var TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(baseConfig, {
  output: {
    library: 'sseio',
    libraryTarget: 'umd',
    filename: 'sse.io-client.js'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            ie8: false
          },
          mangle: {
            ie8: false
          },
          output: {
            ie8: false,
            beautify: false
          }
        }
      })
    ]
  }
});