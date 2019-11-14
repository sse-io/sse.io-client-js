module.exports = {
  mode: 'production',
  entry: './lib/index.js',
  output: {
    library: 'sseio',
    libraryTarget: 'umd',
    filename: 'sse.io-client.dev.js'
  },
  node: {
    Buffer: false
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
