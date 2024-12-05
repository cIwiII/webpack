// 开发环境的配置

const base = require('./webpack.base.config');
const { merge } = require('webpack-merge');

const fESA='192.168.11.17'   //前端地址，（端口port配置）
/** 后端url */
const bESA='http://192.168.11.17:3000/'   //后端地址

module.exports = merge(base, {
    mode:'development',
    // 显示错误之处,勿使用于生产模式
    devtool: 'inline-source-map',
    // 代码改变重新编译时，指定不再编译的部分加快编译效率
    watchOptions: {
        ignored: /node_modules/
    },
    devServer: {
        //不配置loclhost访问，127.0.0.1，本地ip访问，1全0 本机ip访问
        host:fESA,
        hot: true,  // 启动热更新 文件改动后，服务器会自动重新打包
        port: 3000, // 设置服务器端口号为 3000, 默认8080
        open: true, // 启动服务器时自动打开浏览器
        openPage: './html/index.html',
        proxy: {    // 代理跨域配置
            '/api': {
                target: 'http://localhost:3000',  // 后端服务器地址
                changeOrigin: true,
                pathRewrite: { "^/api": "" }
            },
            "/":{
                // target:'http://127.0.0.1:3000/'
                // 提升至上方统一管理
                target:bESA
             }
        }
    },
    resolve: {
        extensions: ['.ts','css'],
    },
})