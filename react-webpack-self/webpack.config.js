/**
 * 使用自己写的 webpack
 */

const path = require("path");
// const { WebpackRunPlugin, WebpackDonePlugin, loader1, loader2 } = require("./webpack");

/** Webpack 本质上是一个函数,接受配置信息作为参数,返回一个 compiler 对象，此处直接写 参数 信息 */

module.exports = {
  mode: "development", //防止代码被压缩

  entry: "./src/index.js", //入口文件

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },

  devtool: "source-map", //防止干扰源文件

/*   // 5.3 插件plugin配置
  plugins: [new WebpackRunPlugin(), new WebpackDonePlugin()],

  // 5.6 配置loader规则，入口文件出发，然后查找出对应的 Loader 对源代码进行翻译和替换
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [loader1, loader2],
      },
    ],
  }, */

};




