
/** 测试文件  虽然和debugger.js 完全一致，
 *  但自写 Compiler 和 run 没有存储配置 options 和this.hook 信息 
 *  所以不能执行run中函数，也不会有dist文件生成和相关输出
 * 在5.10 不走以后，解决次问题
 * */

const { webpack } = require("./webpack.js"); //2.0
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