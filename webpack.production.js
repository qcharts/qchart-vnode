const path = require('path')

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'lib'),
    library: 'vnode',
    libraryTarget: 'umd'
  },
  devtool: 'source-map',
  externals: {}
  // devServer: {
  //   contentBase: path.join(__dirname, 'examples'),
  //   hot: true
  // }
}
