### HtmlWebpackPlugin

简单创建html文件，用户服务器访问

在打包结束后，⾃动生成⼀个 `html` ⽂文件，并把打包生成的`js` 模块引⼊到该 `html` 中

```js
npm install --save-dev html-webpack-plugin

// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
 ...
  plugins: [
     new HtmlWebpackPlugin({
       title: "My App",
       filename: "app.html",
       template: "./src/html/index.html"
     }) 
  ]
};
```

### option

- title：string=Webpack App： 生成html的标题
- filename：string | Function=‘index.html’ ：生成html的文件名，可以添加路径如：src/index.html
- template：string=‘’： 模板的相对或绝对路径。默认情况下，如果存在，将使用src/index.ejs。
- templateContent：string | Function | false=false ：可以代替模板来提供内联模板，自行编写模板
- templateParameters：string | Object | false=false ：模版需要的参数
- inject：boolean | string=true
  - true 将根据scriptLoading选项将其添加到head/body
  - body script标签位于html文件的 body 底部
  - head script标签位于html文件的 head中
  - false 不插入生成的js文件，这个几乎不会用到的

- publicPath：string | ‘auto’=‘auto’：用于脚本和链接标记的publicPath
- scriptLoading：‘blocking’ | ‘defer’ | ‘module’=‘defer’
  - defer 异步加载
  - module ，添加属性type=“module” 延迟加载
- favicon：string=‘’： 将给定的favicon路径添加到输出HTML
- meta：object={}： 插入的meta标签内容 例如 meta: {viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'}
- base：object | string | false=false：基础标记地址，如 https:// example.com/path/ page.htm
- minify：boolean | object=？： 控制是否使用以及以何种方式压缩html，如果模式为“production”，则为true，否则为false。不设置时，如果 webpack 的 mode 为 `production`，就会压缩 html，移除多余的空格和注释之类的。
- hash：boolean=true：对所有css 和 js文件追加webpack生成的hash值
- cache：boolean=true：缓存，只有内容变化的时候生成新文件
- showErrors：boolean=true：是否把错误输出到html文件
- chunks：{?}=?： chunks主要用于多入口文件，当你有多个入口文件，那就回编译后生成多个打包后的文件，那么chunks 就能选择你要使用那些js文件
- chunksSortMode：‘none’ | ‘auto’ | ‘manual？’ | Function=‘auto’：多个chunk的script的顺序
  - 'dependency' 不用说，按照不同文件的依赖关系来排序。
  - 'auto' 默认值，插件的内置的排序方式，具体顺序....
  - 'none' 无序？
  - {function} 提供一个函数？
- excludeChunks：Array< string >=‘’： 排除掉一些js或者chunk
- xhtml：boolean=false，如果为 true ,则以兼容 xhtml 的模式引用文件。



### 自定义变量注入

```js
<!DOCTYPEhtml> <html> 
<head> 
    <meta charset="UTF-8"> 
    <meta name="viewport"content="width=device-width,initial-scale=1.0"> 
    <title><%=htmlWebpackPlugin.options.title%></title> 
</head> 
<body> <%=htmlWebpackPlugin.options.saySomething%> </body> </html>
```

配置改为

```js
plugins:[ 
    ...
    new HtmlWebpackPlugin({ 
        template:'index.html', 
        title:'前端西瓜哥的博客', 
        //下面这个是自定义属性 
        saySomething:'Stayhungry,stayfoolish' 
    }), 
],
```





打包移除console

```js
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false,
                    // 打包的时候移除console、debugger
                    drop_debugger: true, // 移除debugger
                    drop_console: true, // 移除console
                    pure_funcs: ['console.log','console.info']
                }
            },
            sourceMap: config.build.productionSourceMap,
            parallel: true
        }),
```

