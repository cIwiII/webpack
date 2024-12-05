const { merge } = require('webpack-merge')
const path = require('path')
const webpack = require('webpack')

const common = require('./webpack.common')
const { PROJECT_PATH, SERVER_HOST, SERVER_PORT } = require('./constant')

console.log(PROJECT_PATH, SERVER_HOST, SERVER_PORT)

module.exports = merge(common, {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  output: {
    filename: 'js/[name].js',
    path: path.resolve(PROJECT_PATH, './dist'),
    publicPath: '/',
  },
  devServer: {
    host: SERVER_HOST,
    port: SERVER_PORT,
    stats: 'errors-only',     
    clientLogLevel: 'none',
    compress: true,
    open: true,
    hot: true,
    noInfo: true,
    historyApiFallback: {
			index: path.join(PROJECT_PATH, './public/index.html') // 当路由与真实文件不匹配时，webpack-dev-server 使用指定文件渲染而非 404 错误
	  }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  optimization: {
    minimize: false,
    minimizer: [],
    splitChunks: {
      chunks: 'all',
      minSize: 0,
    }
  },
  target: 'web'
})