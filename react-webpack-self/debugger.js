
/** 测试文件 */

// const { webpack } = require("./webpack.js"); //后面自己手写2.0
const { webpack } = require("webpack");//
const webpackOptions = require("./webpack.config.js");
const compiler = webpack(webpackOptions);

//开始编译，run接受回调，查看错误和编译信息
compiler.run((err, stats) => {
  console.log(err);
  console.log(
    stats.toJson({
      assets: true, //打印本次编译产出的资源
      chunks: true, //打印本次编译产出的代码块
      modules: true, //打印本次编译产出的模块，即打包了哪些模块
    })
  );
});
