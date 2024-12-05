其他参考：https://blog.csdn.net/weixin_52851967/article/details/128612325



common-shake插件

tree-shaking

### tree-saking 按需引入

#### 一、tree-shaking？

es6 推出了tree shaking机制，类似于按需引入，在Uglify阶段查出，没有使用的不打包到bundle中。为了减少最终构建体积而诞生。只支持ES6 Module代码。在production 环境默认开启。

#### 二、使用

哪些情况下可以使用tree-shaking呢？
1.首先，要明确一点：Tree Shaking 只支持 ESM 的引入方式，不支持 Common JS 的引入方式。

ESM: export + import
Common JS: module.exports + require

提示：如果想要做到tree shaking，在引入模块时就应该避免将全部引入，应该引入局部才可以触发tree shaking机制

代码如下（示例）：

```js
// Import everything (not tree-shaking)
import lodash from 'lodash';

// Import named export (can be tree-shaking)
import { debounce } from 'lodash';

// Import the item directly (can be tree-shaking)
import debounce from 'lodash/lib/debounce';
```

#### 三、配置

项目中如何配置tree-shaking(抖动摇晃)？

1、开发环境配置tree shaking

```js
// webpack.config.js
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  // ...
  mode: 'development',
  optimization: {
    usedExports: true,// 1.为true，标记为未使用，但依然存在
  },
  plugins: [
        new UglifyJsPlugin(), //2.将标记为未使用的清除掉
        new HtmlWebpackPlugin({
            template: "./src/index.html"
        }),
        new CleanWebpackPlugin()
    ],
};
```



生产环境下的配置:  去掉 usedExports 和 uglifyjs-webpack-plugin 相关配置，将 mode 修改为 production:

```js
// webpack.config.js   生产环境下只需要把mode配置成‘production’即可
module.exports = {
  // ...
  mode: 'production',
};
```

 根据环境的不同进行配置以后，还需要在 package.json 中，添加字段：**sideEffects: false，**告诉 Webpack 哪些代码可以处理

```js
{
  "name": "webpack-demo-1",
  "sideEffects": false, 
  // ...
}
//  列子：
// All files have side effects, and none can be tree-shaken
{
 "sideEffects": true
}

// No files have side effects, all can be tree-shaken
{
 "sideEffects": false
}

// Only these files have side effects, all other files can be tree-shaken, but these must be kept
// 只有这些文件会有副作用，所有其他文件都会受到影响，但这些文件必须保留
// 即引入后，即使没有使用，也应当打包，如css文件
{
 "sideEffects": [
 // "./src/file1.js",
 //"./src/file2.js",
 // "./src/some-side-effectful-file.js",
  "*.css"
 ]
}
```



#### 四、sideEffects

sideEffects 对全局 CSS 的影响
对于那些直接引入到 js 文件的文件，例如全局的 css，它们并不会被转换成一个 CSS 模块。

```js
/* reset.css */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
html,
body {
    background-color: #eaeaea;
}

// main.js
import "./styles/reset.css"
```

以上样式无效：原因在于：sideEffects 设置为 false后(标记为无副作用)，所有的文件都会被 Tree Shaking，通过 import 形式引入的 CSS 就会被当作无用代码处理掉。
为了解决这个问题，可以在 loader 的规则配置中，添加 sideEffects: true，告诉 Webpack 这些文件不要Tree Shaking。方式一、在sideEffects数组种设置，见上例，方式二，如下：loder中设置

```js
// webpack.config.js
module.exports = {
  // ...
    module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
        sideEffects: true
      }
    ]
  },
};
```

**总结** 

- tree shaking就是类似一棵树有长熟的苹果，将已经成熟的苹果摇掉减轻树的负担，这就实现了这个机制
- 在es6中的import和export才可以触发这个机制
- 项目中对tree-shaking的配置
- tree-shaking对项目中的影响

### Devtool错误提示

自动使用 SourceMapDevToolPlugin`/`EvalSourceMapDevToolPlugin 插件

最终将应用两个插件。**build** 构建，**rebuild** 重建

| devtool                                    | performance                              | production | quality        | comment                                                      |
| :----------------------------------------- | :--------------------------------------- | :--------- | :------------- | :----------------------------------------------------------- |
| (none)                                     | **build**: fastest  **rebuild**: fastest | yes        | bundle         | 最大性能生产版本                                             |
| **`eval`**                                 | **build**: fast  **rebuild**: fastest    | no         | generated      | 最大性能的开发版本                                           |
| `eval-cheap-source-map`                    | **build**: ok  **rebuild**: fast         | no         | transformed    | 开发构建的权衡选择。                                         |
| `eval-cheap-module-source-map`             | **build**: slow  **rebuild**: fast       | no         | original lines | 开发构建的权衡选择。                                         |
| **`eval-source-map`**                      | **build**: slowest  **rebuild**: ok      | no         | original       | 使用高质量SourceMaps开发构建的推荐选择                       |
| `cheap-source-map`                         | **build**: ok  **rebuild**: slow         | no         | transformed    |                                                              |
| `cheap-module-source-map`                  | **build**: slow  **rebuild**: slow       | no         | original lines |                                                              |
| **`source-map`**                           | **build**: slowest  **rebuild**: slowest | yes        | original       | 推荐使用高质量SourceMaps进行生产构建。完全详细位置提示       |
| `inline-cheap-source-map`                  | **build**: ok  **rebuild**: slow         | no         | transformed    |                                                              |
| `inline-cheap-module-source-map`           | **build**: slow  **rebuild**: slow       | no         | original lines |                                                              |
| `inline-source-map`                        | **build**: slowest  **rebuild**: slowest | no         | original       | 发布单个文件时的可能选择                                     |
| `eval-nosources-cheap-source-map`          | **build**: ok  **rebuild**: fast         | no         | transformed    | 未包含源代码                                                 |
| `eval-nosources-cheap-module-source-map`   | **build**: slow  **rebuild**: fast       | no         | original lines | 未包含源代码                                                 |
| `eval-nosources-source-map`                | **build**: slowest  **rebuild**: ok      | no         | original       | 未包含源代码                                                 |
| `inline-nosources-cheap-source-map`        | **build**: ok  **rebuild**: slow         | no         | transformed    | 未包含源代码                                                 |
| `inline-nosources-cheap-module-source-map` | **build**: slow  **rebuild**: slow       | no         | original lines | 未包含源代码                                                 |
| `inline-nosources-source-map`              | **build**: slowest  **rebuild**: slowest | no         | original       | 未包含源代码                                                 |
| `nosources-cheap-source-map`               | **build**: ok  **rebuild**: slow         | no         | transformed    | 未包含源代码                                                 |
| `nosources-cheap-module-source-map`        | **build**: slow  **rebuild**: slow       | no         | original lines | source code not included                                     |
| `nosources-source-map`                     | **build**: slowest  **rebuild**: slowest | yes        | original       | source code not included                                     |
| `hidden-nosources-cheap-source-map`        | **build**: ok  **rebuild**: slow         | no         | transformed    | 无引用，不包含源代码                                         |
| `hidden-nosources-cheap-module-source-map` | **build**: slow  **rebuild**: slow       | no         | original lines | no reference, source code not included                       |
| `hidden-nosources-source-map`              | **build**: slowest  **rebuild**: slowest | yes        | original       | no reference, source code not included                       |
| `hidden-cheap-source-map`                  | **build**: ok  **rebuild**: slow         | no         | transformed    | 无引用                                                       |
| `hidden-cheap-module-source-map`           | **build**: slow  **rebuild**: slow       | no         | original lines | no reference                                                 |
| `hidden-source-map`                        | **build**: slowest  **rebuild**: slowest | yes        | original       | 无参考。仅出于错误报告目的使用SourceMap时的可能选择。<br/>显示源码样式，但不知是那个文件 |



### 进程展示插件

| 进度插件                    | 美观 | 扩展性    | 额外安装 | 大小   |
| --------------------------- | ---- | --------- | -------- | ------ |
| webpack.ProgressPlugin      | 差   | 容易/一般 | 无需     | 16.9kb |
| progress-bar-webpack-plugin | 良   | 容易/优秀 | 需安装   | 5.72   |
| webpackbar                  | 优   | 复杂/优秀 | 需安装   | 134kb  |



### 问题

#### 1.webpackJsonp is not defined 错误
- vue项目，发现有这报错。
- 原因是用了CommonsChunkPlugin生成了公共文件，但是页面还没有引用这个公共文件
- 地址： https://www.cnblogs.com/wayneliu007/p/11578531.html



 