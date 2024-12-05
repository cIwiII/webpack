// 生产环境的配置

const base = require('./webpack.base.config');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

module.exports = merge(base, {
    plugins: [
        /**
         * 生产使用
         * 不传入任何参数，该插件会默认使用 `output.path` 目录(一般为dist)作为需要清空的目录
         * 配置 option 使用较少
         * @see https://github.com/johnagan/clean-webpack-plugin
         */
        new CleanWebpackPlugin(),
        new ParallelUglifyPlugin({
            // 传递给 UglifyJS 的参数, 使用 UglifyJS 压缩，只不过帮助开启了多进程
            uglifyJS: {
                output: {
                    beautify: false, // 最紧凑的输出
                    comments: false, // 删除所有的注释
                },
                compress: {
                    // 删除所有的 console 语句，可以兼容ie浏览器
                    drop_console: true,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true,
                }
            }
        })
    ]
})