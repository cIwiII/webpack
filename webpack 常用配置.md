

```js
module.exports = {
    // __dirname值为所在文件的目录，context默认为执行webpack命令所在的目录
    context: path.resolve(__dirname, 'app'),
    // 必填项，编译入口，webpack启动会从配置文件开始解析,如下三种(还有一种动态加载entry的方式就是给entry传入一个函数，这个在项目比较大，页面很多的情况下可以优化编译时间)
    entry: './app/entry', // 只有一个入口，入口只有一个文件
    entry: ['./app/entry1', './app/entry2'], // 只有一个入口，入口有两个文件
       // 两个入口
    entry: {
        entry1: './app/entry1',
        entry2: './app/entry2'
    },
    // 输出文件配置
    output: {
        // 输出文件存放的目录，必须是string类型的绝对路径
        path: path.resolve(__dirname, 'dist'),
        // 输出文件的名称
        filename: 'bundle.js',
        filename: '[name].js', // 配置了多个入口entry是[name]的值会被入口的key值替换，此处输出文件会输出的文件名为entry1.js和entry2.js
        filename: [chunkhash].js, // 根据chunk的内容的Hash值生成文件的名称，其他只还有id，hash，hash和chunkhash后面可以使用:number来取值，默认为20位，比如[name]@[chunkhash:12].js,
        // 文件发布到线上的资源的URL前缀，一般用于描述js和css位置，举个例子，打包项目时会导出一些html,那么html里边注入的script和link的地址就是通过这里配置的
        publicPath: "https://cdn.example.com/assets/", // CDN（总是 HTTPS 协议）
        publicPath: "//cdn.example.com/assets/", // CDN (协议相同)
        publicPath: "/assets/", // 相对于服务(server-relative)
        publicPath: "assets/", // 相对于 HTML 页面
        publicPath: "../assets/", // 相对于 HTML 页面
        publicPath: "", // 相对于 HTML 页面（目录相同）
        // 当需要构建的项目可以被其他模块导入使用，会用到libraryTarget和library
        library: 'xxx', // 配置导出库的名称，但是和libraryTarget有关，如果是commonjs2默认导出这个名字就没啥用
        // 从webpack3.1.0开始，可以为每个target起不同的名称
        library: {
            root: "MyLibrary",
            amd: "my-library",
            commonjs: "my-common-library"
        },
        libraryTarget: 'umd', // 导出库的类型，枚举值: umd、commonjs2、commonjs，amd、this、var(默认)、assign、window、global、jsonp(区别查看补充2)
        // 需要单独导出的子模块，这样可以直接在引用的时候使用子模块，默认的时候是_entry_return_
        libraryExport: 'default', // __entry_return_.default
        libraryExport: 'MyModule', // __entry_return_.MyModule
        libraryExport: ['MyModule', 'MySubModule '], // 使用数组代表到指定模块的取值路径 __entry_return_.MyModule.MySubModule
        // 配置无入口的chunk在输出时的文件名称，但仅用于在运行过程中生成的Chunk在输出时的文件名称，这个应该一般和插件的导出有关，支持和filename一样的内置变量
        chunkFilename: '[id].js',
        // 是否包含文件依赖相关的注释信息，不懂？请看补充3，在mode为development的是默认为true
        pathinfo: true,
        // JSONP异步加载chunk，或者拼接多个初始chunk(CommonsChunkPlugin,AggressiveSplittingPlugin)
        jsonpFunction: 'myWebpackJsonp',
        // 此选项会向应盘写入一个输出文件，只在devtool启动了sourceMap选项时采用，默认为`[file].map`,除了和filename一样外还可以使用[file]
        sourceMapFilename: '[file].map',
        // 浏览器开发者工具里显示的源码模块名称，此选项仅在 「devtool 使用了需要模块名称的选项」时使用，使用source-map调试，关联模块鼠标移动到上面的时候显示的地址(截不到图啊，醉了)，默认这个值是有的，一般不需要关心
        devtoolModuleFilenameTemplate: 'testtest://[resource-path]'
    },
    // 配置模块相关
    module: {
        rules: [ // 配置loaders
            {
                test: /\.jsx?$/, // 匹配规则，匹配文件使用，一般使用正则表达值
                include: [path.resolve(__dirname, 'app')], // 只会命中这个目录文件
                exclude: [path.resolve(__diranme, 'app/demo-files')], // 命中的时候排除的目录
                use: [ // 使用的loader，每一项为一个loader，从该数组的最后一个往前执行
                    'style-loader', // loader的名称,这样则是使用默认配置，可以在后面加!配置属性，也可以用下面方式
                    {
                        loader: 'css-loader', // loader的名称
                        options: {} // loader接受的参数
                    }
                ],
                noParse: [ // 不用解析和处理的模块 RegExp | [RegExp] | function（从 webpack 3.0.0 开始）
                    /jquery|lodash/
                ]
            }
        ]
    },
    // 配置插件，
    plugins: [
      // 压缩js的plugin
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          drop_console: false,
        }
      }),
    ],
    // 解析文件引用的模块的配置
    resolve: {
        // 模块的根目录,默认从node_modules开始找
        modules: [
            'node_modules',
            'browser_modules'
        ],
        // 模块的后缀名，我们引入模块有时候不写扩展名，自动补充扩展名的顺序如下
        extensions: ['.js', '.json', '.jsx', '.css'],
        // 模块解析时候的别名
        alias: {
            // 那么导入模块时则可以写import myComponent from '$component/myComponent';
            $component: './src/component',
            // 末尾加$精确匹配
            xyz$: path.resolve(__dirname, 'path/to/file.js')
        },
        // 此选项决定优先使用package.json配置哪份导出文件，详见补充5
        mainFields: ['jsnext:main', 'browser', 'main'],
        // 是否强制导入语句写明后缀
        enforceExtension: false,
        // 是否将符号链接(symlink)解析到它们的符号链接位置(symlink location)
        symlinks: true,
    },
    // 选择一种 source map 格式来增强调试过程。不同的值会明显影响到构建(build)和重新构建(rebuild)的速度。
    devtool: 'source-map',
    // 配置输出代码的运行环境，可以为async-node，electron-main，electron-renderer，node，node-webkit，web(默认)，webworker
    target: 'web',
    externals: { // 使用来自于js运行环境提供的全局变量
        jquery: 'jQuery'
    },
    // 控制台输出日志控制
    stats: {
        assets: true, // 添加资源信息
        colors: true, // 控制台日志信息是否有颜色
        errors: true, // 添加错误信息
        errorDetails: true, // 添加错误的详细信息（就像解析日志一样）
        hash: true, // 添加 compilation 的哈希值
    },
    devServer: { // 本地开发服务相关配置
        proxy: { // 代理到后端服务接口
            '/api': 'http://localhost:3000'
        },
        contentBase: path.join(__dirname, 'public'), // 配置devserver http服务器文件的根目录
        compress: true, // 是否开启gzip压缩
        hot: true, // 是否开启模块热交换功能
        https: false, // 是否开启https模式
        historyApiFallback: true, // 是否开发HTML5 History API网页，不太理解TODO
    },
    profile: true, // 是否捕捉webpack构建的性能信息，用于分析是什么原因导致的构建性能不佳
    cache: false, // 缓存生成的 webpack 模块和 chunk，来改善构建速度。缓存默认在观察模式(watch mode)启用。
    cache: {
        // 如果传递一个对象，webpack 将使用这个对象进行缓存。保持对此对象的引用，将可以在 compiler 调用之间共享同一缓存：
        cache: SharedCache  // let SharedCache = {}
    },
    watch: true, // 是否启用监听模式
    watchOptions: { // 监听模式选项
        ignored: /node_modules/, // 不监听的文件或文件夹，支持正则匹配，默认为空
        aggregateTimeout: 300, //监听到变化后，300ms再执行动作，节流，防止文件更新频率太快导致重新编译频率太快
        poll: 1000 // 检测文件是否变化，间隔时间
    },
    // 输出文件的性能检查配置
    perfomance: {
        hints: 'warning', // 有性能问题时输出警告
        hints: 'error', // 有性能问题时输出错误
        hints: false, // 关闭性能检查
        maxAssetSize: 200000, // 最大文件大小，单位bytes
        maxEntrypointSize: 400000, // 最大入口文件的大小，单位bytes
        // 此属性允许 webpack 控制用于计算性能提示的文件。
        assetFilter: function(assetFilename) {
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    }
}
```

#### webpack基础构建流程说明2：

> 1、从context对应的文件夹开始…
>
> 2、寻找entry里所有的文件名…
>
> 3、然后读取它们的内容。在解析代码时，每一个通过import（ES6） 或require()（Node） 引入的依赖都会被打包到最终的构建结果当中。它会接着搜索那些依赖，以及那些依赖的依赖，直到“依赖树”的叶子节点 — 只打包它所需要的依赖，没有其他的东西。
>
> 4、Webpack 将所有东西打包到output.path对应的文件夹里，使用output.filename对应的命名模板来命名（[name]被entry里的对象键值所替代）

#### 整体属性介绍2

- context 基础目录，绝对路径，用于从配置中解析入口起点(entry point)和加载器(loader)   注：默认使用当前文件路径

- entry 入口文件的属性，整个项目的主入口，其余依赖的模块均在这些文件中引入

- output   出口文件的属性，整个项目的唯一出口，虽然可以有多个入口，但是只有一个出口

- module
  不同资源的加载器，默认webpack只支持JS，但是引入不同的loader，就可以加载更多类型的资源文件，例如HTML,CSS,JPG等等。通过module属性配置需要匹配的文件资源和对应的加载器。需要注意的是，加载器需要提前通过npm安装。

  ```js
  
  ```

  

- resolve   重定义如何处理模块资源，例如设置模块的别名，设置是否允许无后缀名等
- plugins   插件可以实现对各种资源文件的定制处理，例如压缩，混淆，转换，分割等等
- devServer  配置开发服务器，这是一个小型的Node Express服务器，可以为打包后的静态资源提供访问服务
- devtool   要在webpack打包的同时生成source maps，需得在webpack.config.js中配置devtool配置项
- target
  webpack可以为js的各种不同的宿主环境提供编译功能，为了能正确的进行编译，就需要开发人员在配置里面正确的进行配置

默认情况下，target的值是web，也就是为类浏览器的环境提供编译

- watch and watchOptions    webpack 可以监听文件变化，当它们修改后会重新编译
- externals  webpack中的externals配置提供了"不从 bundle 中引用依赖"的方式。例如，从 CDN引入jQuery，而不是把它打包
- node   自定义 NodeJS 环境
- performance  这些选项可以控制 webpack 如何通知"资源(asset)和入口起点超过指定文件限制"，就是当构建大资源文件时可以给出警告提示
- stats   这些选项能让你准确地控制显示哪些包的信息





#### 官方3

```js
//说明：    https://www.webpackjs.com/configuration/

const path = require('path');

module.exports = {
  mode: "production", // "production" | "development" | "none"
  entry: "./app/entry", // string | object | array
  // 这里应用程序开始执行
  // webpack 开始打包

  output: {
    // webpack 如何输出结果的相关选项
    path: path.resolve(__dirname, "dist"), // string
    // 所有输出文件的目标路径
    // 必须是绝对路径（使用 Node.js 的 path 模块）

    filename: "bundle.js", // string
    // 「入口分块(entry chunk)」的文件名模板（出口分块？）

    publicPath: "/assets/", // string
    // 输出解析文件的目录，url 相对于 HTML 页面

    library: "MyLibrary", // string,
    // 导出库(exported library)的名称

    libraryTarget: "umd", // 通用模块定义
    // 导出库(exported library)的类型

    /* 高级输出配置（点击显示） */
  },

  module: {
    // 关于模块配置

    rules: [
      // 模块规则（配置 loader、解析器等选项）

      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, "app")
        ],
        exclude: [
          path.resolve(__dirname, "app/demo-files")
        ],
        // 这里是匹配条件，每个选项都接收一个正则表达式或字符串
        // test 和 include 具有相同的作用，都是必须匹配选项
        // exclude 是必不匹配选项（优先于 test 和 include）
        // 最佳实践：
        // - 只在 test 和 文件名匹配 中使用正则表达式
        // - 在 include 和 exclude 中使用绝对路径数组
        // - 尽量避免 exclude，更倾向于使用 include

        issuer: { test, include, exclude },
        // issuer 条件（导入源）

        enforce: "pre",
        enforce: "post",
        // 标识应用这些规则，即使规则覆盖（高级选项）

        loader: "babel-loader",
        // 应该应用的 loader，它相对上下文解析
        // 为了更清晰，`-loader` 后缀在 webpack 2 中不再是可选的
        // 查看 webpack 1 升级指南。

        options: {
          presets: ["es2015"]
        },
        // loader 的可选项
      },

      {
        test: /\.html$/,
        test: "\.html$"

        use: [
          // 应用多个 loader 和选项
          "htmllint-loader",
          {
            loader: "html-loader",
            options: {
              /* ... */
            }
          }
        ]
      },

      { oneOf: [ /* rules */ ] },
      // 只使用这些嵌套规则之一

      { rules: [ /* rules */ ] },
      // 使用所有这些嵌套规则（合并可用条件）

      { resource: { and: [ /* 条件 */ ] } },
      // 仅当所有条件都匹配时才匹配

      { resource: { or: [ /* 条件 */ ] } },
      { resource: [ /* 条件 */ ] },
      // 任意条件匹配时匹配（默认为数组）

      { resource: { not: /* 条件 */ } }
      // 条件不匹配时匹配
    ],

    /* 高级模块配置（点击展示） */
  },

  resolve: {
    // 解析模块请求的选项
    // （不适用于对 loader 解析）

    modules: [
      "node_modules",
      path.resolve(__dirname, "app")
    ],
    // 用于查找模块的目录

    extensions: [".js", ".json", ".jsx", ".css"],
    // 使用的扩展名

    alias: {
      // 模块别名列表

      "module": "new-module",
      // 起别名："module" -> "new-module" 和 "module/path/file" -> "new-module/path/file"

      "only-module$": "new-module",
      // 起别名 "only-module" -> "new-module"，但不匹配 "only-module/path/file" -> "new-module/path/file"

      "module": path.resolve(__dirname, "app/third/module.js"),
      // 起别名 "module" -> "./app/third/module.js" 和 "module/file" 会导致错误
      // 模块别名相对于当前上下文导入
    },
    /* 可供选择的别名语法（点击展示） */

    /* 高级解析选项（点击展示） */
  },

  performance: {
    hints: "warning", // 枚举
    maxAssetSize: 200000, // 整数类型（以字节为单位）
    maxEntrypointSize: 400000, // 整数类型（以字节为单位）
    assetFilter: function(assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },

  devtool: "source-map", // enum
  // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
  // 牺牲了构建速度的 `source-map' 是最详细的。

  context: __dirname, // string（绝对路径！）
  // webpack 的主目录
  // entry 和 module.rules.loader 选项
  // 相对于此目录解析

  target: "web", // 枚举
  // 包(bundle)应该运行的环境
  // 更改 块加载行为(chunk loading behavior) 和 可用模块(available module)

  externals: ["react", /^@angular\//],
  // 不要遵循/打包这些模块，而是在运行时从环境中请求他们

  stats: "errors-only",
  // 精确控制要显示的 bundle 信息

  devServer: {
    proxy: { // proxy URLs to backend development server
      '/api': 'http://localhost:3000'
    },
    contentBase: path.join(__dirname, 'public'), // boolean | string | array, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    noInfo: true, // only errors & warns on hot reload
    // ...
  },

  plugins: [
    // ...
  ],
  // 附加插件列表

  /* 高级配置（点击展示） */
}
```

#### 配置结构3

```js
module.exports = {
  mode: "production", //打包模式
  entry: "./app/entry",//打包起始文件
  output: {//输出文件绝对路径
    path: path.resolve(__dirname, "dist"),//文件夹
    filename: "bundle.js", //文件名
    publicPath: "/assets/", //静态文件打包
    library: "MyLibrary",  // 导出库(exported library)的名称
    libraryTarget: "umd", // 导出库(exported library)的类型
    /* 高级输出配置（未显示） */
  },

  module: {// 关于模块配置
    rules: [ // 模块规则（配置 loader、解析器等选项）
      {
        test: /\.jsx?$/, // 和 include 具有相同的作用，必匹配选项
        include: [//使用绝对路径数组
            path.resolve(__dirname, "app")
        ],
           // exclude 是必不匹配选项（优先于 test 和 include）
        exclude: [// - 尽量避免 exclude，更倾向于使用 include
            path.resolve(__dirname, "app/demo-files")
        ],
        issuer: { test, include, exclude },// issuer 条件（导入源）
        enforce: "pre",
        enforce: "post",// 标识应用这些规则，即使规则覆盖（高级选项）
        loader: "babel-loader", // 相对上下文解析
        // 为了更清晰，`-loader` 后缀在 webpack 2 中不再是可选的
        options: {  // loader 的可选项
             presets: ["es2015"]
        }, 
      },
      {
        test: /\.html$/,
        test: "\.html$"
        use: [ // 应用多个 loader 和选项
          "htmllint-loader",
          {
            loader: "html-loader",
            options: {/* ... */ }
          }
        ]
      },
      { oneOf: [ /* rules */ ] },
      // 只使用这些嵌套规则之一
      { rules: [ /* rules */ ] },
      // 使用所有这些嵌套规则（合并可用条件）
      { resource: { and: [ /* 条件 */ ] } },
      // 仅当所有条件都匹配时才匹配

      { resource: { or: [ /* 条件 */ ] } },
      { resource: [ /* 条件 */ ] },
      // 任意条件匹配时匹配（默认为数组）

      { resource: { not: /* 条件 */ } }
      // 条件不匹配时匹配
    ],// rules完
    /* 高级模块配置（未展示） */
  },//一级属性module完
      
  resolve: {// 解析模块请求的选项（不适用于对 loader 解析）
    modules: [ // 用于查找模块的目录
      "node_modules",
      path.resolve(__dirname, "app")
    ],
    extensions: [".js", ".json", ".jsx", ".css"],// 使用的扩展名
    alias: {// 模块别名列表（文件夹）
      "module": "new-module",
      // 起别名："module" -> "new-module" 和 "module/path/file" -> "new-module/path/file"
      "only-module$": "new-module",
      // 起别名 "only-module" -> "new-module"，但不匹配 "only-module/path/file" -> "new-module/path/file"
      "module": path.resolve(__dirname, "app/third/module.js"),
      // 起别名 "module" -> "./app/third/module.js" 和 "module/file" 会导致错误
      // 模块别名相对于当前上下文导入
    },
    /* 可供选择的别名语法（点击展示） */
    /* 高级解析选项（点击展示） */
  },
  performance: {
    hints: "warning", // 枚举，|"error"性能提示中抛出错误 | false, 关闭性能提示。
    maxAssetSize: 200000, // 整数类型（以字节为单位）
    maxEntrypointSize: 400000, // 整数类型（以字节为单位）
    assetFilter: function(assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  devtool: "source-map", // 点击展开
  // 通过在浏览器调试工具(browser devtools)中添加元信息(meta info)增强调试
  // 牺牲了构建速度的 `source-map' 是最详细的。
  context: __dirname, // string（绝对路径！）
  // webpack 的主目录
  // entry 和 module.rules.loader 选项
  // 相对于此目录解析

  target: "web", // 枚举，点击展开
  // 包(bundle)应该运行的环境
  // 更改 块加载行为(chunk loading behavior) 和 可用模块(available module)

  externals: ["react", /^@angular\//],//店家展开
  // 不要遵循/打包这些模块，而是在运行时从环境中请求他们

  stats: "errors-only",//点击展开
  // 精确控制要显示的 bundle 信息

  devServer: {
    proxy: { // 到后端开发服务器的代理URL
      '/api': 'http://localhost:3000'
      //"/api": {
        //  target: "http://localhost:3000",
        //  pathRewrite: {"^/api" : ""
       //}
  }
    },
    contentBase: path.join(__dirname, 'public'), // boolean | string | array, 静态文件位置
    compress: true, // 启用gzip压缩
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths。对于索引为真。404上的html，多路径对象
    hot: true, //是否根据 HotModuleReplacementPlugin热更新
    https: false, //真实的自签名颁发机构
    noInfo: true, //仅限热更新时的错误和警告
    // ...
  },
  plugins: [// 附加插件列表
    // ...
  ],
  /* 其他一级高级配置（点击展示） */
}
```



