### [mini-css-extract-plugin](https://webpack.docschina.org/plugins/mini-css-extract-plugin/) 

提取 `CSS` 到一个单独的文件中, 

```js
npm install --save-dev mini-css-extract-plugin
```



```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
 ...,
  module: {
   rules: [
    {
     test: /\.s[ac]ss$/,
     // test: /\.css$/i,
     use: [
        // MiniCssExtractPlugin.loader,//可以不用写为对象，如果需要指定选项必须为对象
         {loader: MiniCssExtractPlugin.loader},
         {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "/public/path/to/",
            },
          },
          'css-loader',
          'sass-loader'
      ]
   }
   ]
 },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
  ]
}
```

note：在入口文件中导入的样式，不会被执行。



### Plugin Options

- 

| 属性：类型 = 默认值                                          | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| filename：String \| Function=[name].css                      | 此选项决定了输出的每个 CSS 文件的名称                        |
| chunkFilename：string \| Function=based on filename          | 此选项决定了非入口的 chunk 文件名称，function在@5可用        |
| ignoreOrder：boolean=false                                   | 移除 Order 警告                                              |
| insert：string \| Function=document.head.appendChild(linkTag); | 在指定位置将 [非初始（由 async 修饰）](https://webpack.docschina.org/concepts/under-the-hood/#chunks) 的 CSS chunk 插入 `link` 标签，string需要为选择器，link插入到选择器节点之后。function（linkTag）｛自定义节点插入｝ |
| attributes：Object=｛｝                                      | 为 [非初始（由 async 修饰）](https://webpack.docschina.org/concepts/under-the-hood/#chunks) 的 CSS chunk 所处的 `link` 标签添加自定义属性， |
| linkType：string \| boolean=‘text/css’                       | 允许使用自定义 link 类型加载异步 chunk，type="text/css"，false禁用type属性 |
| runtime：boolean=true                                        | 允许启动/禁用 runtime 生成                                   |
| experimentalUseImportModule：boolean=undefined               | 使用实验性的 webpack API 来执行模块，而非子代编译器          |

###  Loader Option

| 名称：类型=默认值                                            | 描述                                                 |
| :----------------------------------------------------------- | :--------------------------------------------------- |
| publicPath：string \| Function=webpackOptions.output.publicPath | 为图片、文件等外部资源指定一个自定义的公共路径。     |
| emit：boolean=true                                           | 如果设为 false，插件将会提取 CSS **但不会** 生成文件 |
| esModule：boolean=true                                       | 使用 ES modules 语法                                 |

#### `publicPath`

类型：`String|Function` 默认值：`webpackOptions.output` 选项中的 `publicPath`

为 CSS 内的图片、文件等外部资源指定一个自定义的公共路径。 机制类似于 [`output.publicPath`](https://webpack.docschina.org/configuration/output/#outputpublicpath)。



```js
// webpack.config.js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      // 类似于 webpackOptions.output 中的选项
      // 所有选项都是可选的
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "/public/path/to/",
              publicPath: (resourcePath, context) => {
                return path.relative(path.dirname(resourcePath), context) + "/";
              },
             modules: {
                namedExport: true,
                localIdentName: "foo__[name]__[local]",
              },
            },
          },
          "css-loader",
        ],
      },
    ],
  },
};
```





### 说明

为每个包含 CSS 的 JS 文件创建一个 CSS 文件，并且支持 CSS 和 SourceMaps 的按需加载。

本插件基于 webpack v5 的新特性构建，并且需要 webpack 5 才能正常工作。最好和 [`css-loader`](https://webpack.docschina.org/loaders/css-loader/) 一起使用

与 extract-text-webpack-plugin 相比：

- 异步加载
- 没有重复的编译（性能）
- 更容易使用
- 特别针对 CSS 开发