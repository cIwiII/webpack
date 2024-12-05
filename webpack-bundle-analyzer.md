
## webpack-bundle-analyzer相关
**概念/作用：** 生成项目体积分析报告



- webpack-bundle-analyzer 是 webpack 的插件，需要配合 webpack 和 webpack-cli 一起使用。读取输出文件夹（通常是 dist）中的 stats.json 文件，把该文件可视化展现，生成代码分析报告，直观分析打包出的文件有哪些，包括大小、占比情况、各文件 Gzipped 后的大小、模块包含关系、依赖项等，对应做出优化，从而帮助提升代码质量和网站性能。

通过观察该网页我们可以得出：

打包文件都包含了什么；

每个文件在总体的占比；

模块之间的依赖关系；

每个文件Gzip后的大小。

其使用非常简单，在安装该插件以后，只需在Plugins中配置即可：
### 安装：
```js
# NPM 
npm install --save-dev webpack-bundle-analyzer
# Yarn 
yarn add -D webpack-bundle-analyzer
```
### 使用方法
#### 作为插件使用
1. 配置 webpack.config.js 文件：
```js
// webpack.config.js 文件
 
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
module.exports={
  plugins: [
    new BundleAnalyzerPlugin()  // 使用默认配置
    // 默认配置的具体配置项
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: '8888',
    //   reportFilename: 'report.html',
    //   defaultSizes: 'parsed',
    //   openAnalyzer: true,
    //   generateStatsFile: false,
    //   statsFilename: 'stats.json',
    //   statsOptions: null,
    //   excludeAssets: null,
    //   logLevel: info
    // })
  ]
}
```
2. 配置 package.json 文件
```js
{
 "scripts": {
    "dev": "webpack --config webpack.dev.js --progress"
  }
}
```
3. 在命令行工具中输入:npm run dev

- el：vue为例
```js
//vue.conf.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;//可视化大小插件
module.exports = {
    plugins: [new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerHost: '127.0.0.1',
            analyzerPort: 8889,
            reportFilename: 'report.html',//打包后，可视化文件大小关系的文件名
            defaultSizes: 'parsed',
            openAnalyzer: true,
            generateStatsFile: false,
            statsFilename: 'stats.json',
            statsOptions: null,
            logLevel: 'info'
        }),
        
        ]
}
```

```json

{
  "name": "",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vue-cli-service serve", //本地开发运行，会把process.env.NODE_ENV设置为'development'
    "build": "vue-cli-service build", //默认打包模式，会把process.env.NODE_ENV设置为'production'
  },
  "dependencies": {
  }
}
```

### 配置项

名称	类型	描述
- analyzerMode	server / static / json / disabled	默认值：server。 在server 模式下，分析器将启动 HTTP 服务器以显示 bundle 报告。 在 static 模式下，将生成带有 bundle 报告的单个 HTML 文件（需要手动打开）。 在 json 模式下，将生成带有捆绑报告的单个 JSON 文件。 在 disable 模式下，您可以使用此插件通过将 generateStatsFile 设置为 true 来生成 Webpack Stats JSON 文件。
- analyzerHost	{ String }	默认值：127.0.0.1。 在 server 模式下用于启动 HTTP 服务器的主机。
- analyzerPort	{ Number }或者 auto	默认值：8888。在 server 模式下用于启动 HTTP 服务器的端口
- reportFilename	{String}	默认值：report.html。 在 static 模式下生成的捆绑报告文件的路径。 它可以是绝对路径，也可以是相对于 bundle 文件输出目录的路径（在 webpack 配置中是 output.path）。
- reportTitle	{ String | function }	默认值：返回打印当前日期和时间的函数。 HTML  的 title 元素的内容； 或获取该内容的 () => string  形式的函数。
- defaultSizes	stat / parsed / gzip	
默认值：parsed。 默认情况下在报告中显示的模块大小。

stat：这是文件的“输入”大小，在进行任何转换（如缩小）之前。之所以称为“stat size”，是因为它是从 Webpack 的 stats 对象中获取的。

parsed：这是文件的“输出”大小。 如果你使用的是 Uglify 之类的 Webpack 插件，那么这个值将反映代码的缩小后的大小。

gzip：这是通过 gzip 压缩运行解析的包/模块的大小。

- openAnalyzer	{ Boolean }	默认值：true。 在默认浏览器中自动打开报告。
- genarateStatsFile	{ Boolean }	默认值：false。 如果为 true，将在 bundle 输出目录中生成 webpack stats JSON 文件
- statsFilename	{ String }	默认值：stats.json。 如果 generateStatsFile 为 true，表示将生成的 webpack stats JSON 文件的名称。 它可以是绝对路径，也可以是相对于bundle文件输出目录的路径（在 webpack 配置中是 output.path）。
- statsOptions	null 或 { Object }	默认值：null。 stats.toJson() 方法的选项。 例如，您可以使用 source: false 选项从统计文件中排除模块的源代码。 
- excludeAssets	  { null | pattern | pattern[] }  其中 pattern 可以是   { String | RegExp | function }
    - 默认值：null。 用于匹配将从报告中排除的资源名称的模式。 如果 pattern 是一个字符串，它将通过 new RegExp(str) 转换为 RegExp。 如果 pattern 是一个函数，它应该具有以下签名 (assetName: string) => boolean 并且应该返回 true 以排除匹配的资源。 如果提供了多个模式，资源应至少匹配其中一个以被排除。
- logLevel	info / warn / error / silent	
    - 默认值：info。 用于控制插件输出多少细节。

```js
{
 "scripts": {
    "generateAnalyzFile": "webpack --profile --json > stats.json", // 生成分析文件
    "analyz": "webpack-bundle-analyzer --port 8888 ./dist/stats.json" // 启动展示打包报告的http服务器
  }
}
//在命令行工具中，先运行 npm run generateAnalyzFile 命令，然后运行 npm run analyz 命令。此时就可以看到分析结果了
```