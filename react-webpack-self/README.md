
## 基本使用

工程结构：

```ini
├── node_modules
├── package-lock.json
├── package.json
├── webpack.config.js # 配置文件
├── debugger.js       # 测试文件
└── src               # 源码目录
     |── index.js
     |── name.js
     └── age.js

```

webpack 主要模块编译关系

```ini
c:同一个回调，c1:另一个回调， o:同一个配置项, os:初始化的配置项 和 o 是同一个，方式不同

Webpack模块，
├
├── getSource         # 输出的文件模板
├
├── Compilation       # class 核心 编译阶段专用
├     |── constructor # 初始化 配置项 和其他为 [] 或 {}
├     |── buildModule # 生成单个文件对象
├     └── build       # 文件入口到输出执行
├ 
├── Compiler          # class 管理整个编译过程，而且是单例模式
├     |── constructor # 初始化 配置项 和 钩子函数
├     |── compile     # 创建编译和执行
├     └── run         # 开始编译
├ 
├── webpack           # 返回 Compiler 实例 编译器
├ 
├── 其他 Plugin Loader 方法 定义


```

- getSource: (){}，接受所有最终信息，chunk代码块 转换为文件,打包后文件模板

- Compilation.buildModule: (){} 参数name ：这个模块是属于哪个代码块chunk的， 参数modulePath ：模块绝对路径，return 单个文件对象，

- Compilation.build： (c1){} callback(成功打印内容)编译构建入口开始操作, 便利循环调用buildModule(name, modulePath) ,执行getSource(chunk)输出文件

- Compiler.compile: (c1){} 创建 Compilation(os) 实例。实例调用 build(c1)

- Compiler.run: (c){} 触发钩子函数，创建c1(内容写入文件系统), 调用 compile(c1),

- webpack： (o){} 模块起始点 接受配置，创建 Compiler(o) 实例并最终返回，运行run(callback(err, stats))方法,错误和编译信息



Webpack 本质上是一个函数，它接受一个配置信息作为参数，执行后返回一个 compiler 对象，调用 compiler 对象中的 run 方法就会启动编译。run 方法接受一个回调，可以用来查看编译过程中的错误信息或编译信息。

node ./debugger.js  打包，

node ./dist/main.js  执行打包后的文件

## 三、核心思想

源代码和构建产物之间的关系：（main,js分析）

入口文件（src/index.js）被包裹在最后的立即执行函数中

而它所依赖的模块（src/name.js、src/age.js）则被放进了 modules 对象中（modules 用于存放入口文件的依赖模块，key 值为依赖模块路径，value 值为依赖模块源代码）。


require 函数是 web 环境下 加载模块的方法（ require 原本是 node环境 中内置的方法，浏览器并不认识 require，所以main.中需要手动实现一下,webpack打包自动生成__webpack_require__），它接受模块的路径为参数，返回模块导出的内容。

### 核心问题：

如何将需要打包的源代码转换成 dist/main.js 文件？

- 第一步：首先，node ./debugger.js命令，根据配置信息（webpack.config.js）找到入口文件（src/index.js）

- 第二步：找到入口文件所依赖的模块（即src/index.js用到的文件，包括它自身，此处有三个，如下），并收集关键信息：比如路径、源代码、它所依赖的模块等：
```js
var modules = [
{
  id: "./src/name.js",//路径
  dependencies: [], //所依赖的模块
  source: 'module.exports = "不要秃头啊";', //源代码
},
{
  id: "./src/age.js",
  dependencies: [], 
  source: 'module.exports = "99";',
},
{
  id: "./src/index.js",
  dependencies: ["./src/name.js", "./src/age.js"], 
  source:
    'const name = require("./src/name.js");\n' +
    'const age = require("./src/age.js");\n' +
    'console.log("entry文件打印作者信息", name, age);',
},
];
```

- 第三步：根据上一步得到的信息，生成最终输出到硬盘中的文件（dist）：包括 modules 对象、require 模版代码、入口执行文件等

在这过程中，由于浏览器并不认识除 html、js、css 以外的文件格式，所以我们还需要对源文件进行转换 —— **Loader 系统**。

Loader 系统 本质上就是接收资源文件，通过 loader函数 并对其进行转换，最终输出转换后的文件。

除此之外，打包过程中也有一些特定的时机需要处理，比如：

- 在打包前需要校验用户传过来的参数，判断格式是否符合要求
- 在打包过程中，需要知道哪些模块可以忽略编译，直接引用 cdn 链接
- 在编译完成后，需要将输出的内容插入到 html 文件中
- 在输出到硬盘前，需要先清空 dist 文件夹
- ......

这个时候需要一个可插拔的设计，方便给社区提供可扩展的接口 —— **Plugin 系统**。

Plugin 系统 本质上就是一种事件流的机制，到了固定的时间节点就广播特定的事件，用户可以在事件内执行特定的逻辑，类似于生命周期：打包前、打包中、打包成功、打包失败。


## 四、架构设计

建立一套事件流的机制来管控整个打包过程，大致可以分为三个阶段：

- 打包开始前的准备工作
- 打包过程中（也就是编译阶段）
- 打包结束后（包含打包成功和打包失败）

其中又以编译阶段最为复杂，另外还考虑到一个场景：watch mode（当文件变化时，将重新进行编译），因此这里最好将编译阶段（也就是下文中的compilation）单独解耦出来。

在 Webpack 源码中，compiler 就像是一个大管家，它就代表上面说的三个阶段，在它上面挂载着各种生命周期函数，而 compilation 就像专管伙食的厨师，专门负责编译阶段(打包中)相关的工作


### 实现事件流（实现整个打包过程）

这时候就需要借助 Tapable 了！它是一个类似于 Node.js 中的 EventEmitter 的库，但更专注于自定义事件的触发和处理。通过 Tapable 我们可以注册自定义事件，然后在适当的时机去执行自定义事件。

类比到 Vue 和 React 框架中的生命周期函数，它们就是到了固定的时间节点就执行对应的生命周期，tapable 做的事情就和这个差不多，我们可以通过它先注册一系列的生命周期函数，然后在合适的时间点执行。

el:
```js
const { SyncHook } = require("tapable"); //这是一个同步钩子

//第一步：实例化钩子函数，可以在这里定义形参
const syncHook = new SyncHook(["author", "age"]);

//第二步：注册事件1
syncHook.tap("监听器1", (name, age) => {
  console.log("监听器1:", name, age);
});

//第二步：注册事件2
syncHook.tap("监听器2", (name) => {
  console.log("监听器2", name);
});

//第三步：注册事件3
syncHook.tap("监听器3", (name) => {
  console.log("监听器3", name);
});
//第三步：触发事件，这里传的是实参，会被每一个注册函数接收到
syncHook.call("name参数", "99");

//最终按绑定顺序输出
监听器1 name参数 99
监听器2 name参数
监听器3 name参数
```

在 Webpack 中，就是通过 tapable 在 comiler 和 compilation 上像这样挂载着一系列生命周期 Hook，它就像是一座桥梁，贯穿着整个构建过程：

```js
class Compiler {
  constructor() {
    //它内部提供了很多钩子
    this.hooks = {
      run: new SyncHook(), //会在编译刚开始的时候触发此钩子
      done: new SyncHook(), //会在编译结束的时候触发此钩子
    };
  }
}
```

## 五、具体实现
整个实现过程大致分为以下步骤：

- （1）搭建结构，读取配置参数
- （2）用配置参数对象初始化 Compiler 对象
- （3）挂载配置文件中的插件
- （4）执行 Compiler 对象的 run 方法开始执行编译
- （5）根据配置文件中的 entry 配置项找到所有的入口
- （6）从入口文件出发，调用配置的 loader 规则，对各模块进行编译
- （7）找出此模块所依赖的模块，再对依赖模块进行编译
- （8）等所有模块都编译完成后，根据模块之间的依赖关系，组装代码块 chunk
- （9）把各个代码块 chunk 转换成一个一个文件加入到输出列表
- （10）确定好输出内容之后，根据配置的输出路径和文件名，将文件内容写入到文件系统


### 5.1、搭建结构，读取配置参数

debugger2.0.js  webpack.js

### 5.2、用配置参数对象初始化 Compiler 对象

上面提到过，Compiler 它就是整个打包过程的大管家，它里面放着各种你可能需要的编译信息和生命周期 Hook，而且是单例模式。

运行流程：  webpack.js
- webpack build
- 第一步 搭建结构，读取配置参数
- 第二步 上一步的参数初始化 Complier 对象
- Complier中存着  
     - webpack配置信息：this.options
     - 生命周期钩子：this.hooks



### 5.3、挂载配置文件中的插件

先写两个自定义插件配置到 webpack.config.js 中：一个在开始打包的时候执行，一个在打包完成后执行。

Webpack Plugin 其实就是一个普通的函数，在该函数中需要我们定制一个 apply 方法。当 Webpack 内部进行插件挂载时会执行 apply 函数。我们可以在 apply 方法中订阅各种生命周期钩子，当到达对应的时间点时就会执行。

插件定义时必须要有一个 apply 方法，加载插件其实执行 apply 方法。

运行流程：  webpack.js
- webpack build
- 第一步 搭建结构，读取配置参数
- 第二步 上一步的参数初始化 Complier 对象,Complier中存着:
     - webpack配置信息：this.options
     - 生命周期钩子：this.hooks

- 第三步 挂载配置文件中的插件

### 5.4(重点)、执行Compiler对象的run方法开始执行编译

Compiler 中
- run 钩子，表示开始启动编译了；
- 在编译结束后，需要调用 done 钩子，表示编译完成。

compiler运行流程（打包中）：
- 第四步：执行compiler对象的run方法开始执行编译
- （1）在编译前触发run钩子执行，表示开始启动编译
- （2）执行compiler函数启动编译
     - （2.1）compiler内部初始化Compiler
     - （2.2）执行compiler中的build方法开始进行编译
- （3）当编译完成后触发done钩子执行，表示编译完成

### 5.5根据配置文件中的entry配置项找到所有的入口
接下来就正式开始编译了，逻辑均在 Compilation 中。

在编译前我们首先需要知道入口文件，而` 入口的配置方式 `有多种，可以配置成字符串，也可以配置成一个对象，这一步骤就是为了统一配置信息的格式，然后找出所有的入口（考虑多入口打包的场景）。


webpack.js 5.5

### 5.6、从入口文件出发，调用配置的loader规则，对各模块进行编译
Loader 本质上就是一个函数，接收资源文件或者上一个 Loader 产生的结果作为入参，最终输出转换后的结果。

写两个自定义 Loader 配置到 webpack.config.js 中：
```js
// webpack.config.js 
const { loader1, loader2 } = require("./webpack");

module.exports = {
  //省略其他
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [loader1, loader2],
      },
    ],
  },
};
```
```js
//webpack.js
const loader1 = (source) => {
  return source + "//给你的代码加点注释：loader1";
};

const loader2 = (source) => {
  return source + "//给你的代码加点注释：loader2";
};
```
这一步骤将从入口文件出发，然后查找出对应的 Loader 对源代码进行翻译和替换。


主要有三个要点：

- （6.1）把入口文件的绝对路径添加到依赖数组（this.fileDependencies）中，记录此次编译依赖的模块
- （6.2）得到入口模块的的 module 对象 （里面放着该模块的路径、依赖模块、源代码等）
     - （6.2.1）读取模块内容，获取源代码
     - （6.2.2）创建模块对象
     - （6.2.3）找到对应的 Loader 对源代码进行翻译和替换
- （6.3）将生成的入口文件 module 对象 push 进 this.modules 中


### 5.7、找出此模块所依赖的模块，再对依赖模块进行编译
该步骤是整体流程中最为复杂的，一遍看不懂没关系，可以先理解思路。

该步骤经过细化可以将其拆分成十个小步骤：

- （7.1）：先把源代码编译成 AST
- （7.2）：在 AST 中查找 require 语句，找出依赖的模块名称和绝对路径
- （7.3）：将依赖模块的绝对路径 push 到 this.fileDependencies 中
- （7.4）：生成依赖模块的模块 id
- （7.5）：修改语法结构，把依赖的模块改为依赖模块 id
- （7.6）：将依赖模块的信息 push 到该模块的 dependencies 属性中
- （7.7）：生成新代码，并把转译后的源代码放到 module._source 属性上
- （7.8）：对依赖模块进行编译（对 module 对象中的 dependencies 进行递归执行 buildModule ）
- （7.9）：对依赖模块编译完成后得到依赖模块的 module 对象，push 到 this. modules 中
- （7.10）：等依赖模块全部编译完成后，返回入口模块的 module 对象


### 5.8、代码块（chunk）组装

等所有模块都编译完成后，根据模块之间的依赖关系，组装代码块 chunk

现在，我们已经知道了入口模块和它所依赖模块的所有信息，可以去生成对应的代码块了。

一般来说，每个入口文件会对应一个代码块chunk，每个代码块chunk里面会放着本入口模块和它依赖的模块，这里暂时不考虑代码分割。

### 5.9、代码块转换

把各个代码块 chunk 转换成一个一个文件加入到输出列表

这一步需要结合配置文件中的output.filename去生成输出文件的文件名称，同时还需要生成运行时代码：

### 5.10、文件输出

确定好输出内容之后，根据配置的输出路径和文件名，将文件内容写入到文件系统

该步骤就很简单了，直接按照 Compilation 中的 this.status 对象将文件内容写入到文件系统（这里就是硬盘）。

现在，执行 node ./debugger.js，通过我们手写的 Webpack 进行打包，得到输出文件 dist/main.js：

## 【文件可输出】

## 六、实现 watch 模式

看完上面的实现，有些小伙伴可能有疑问了：Compilation 中的 this.fileDependencies（本次打包涉及到的文件）是用来做什么的？为什么没有地方用到该属性？

这里其实是为了实现 Webpack 的 watch 模式[21]：当文件发生变更时将重新编译。

思路：对 this.fileDependencies 里面的文件进行监听，当文件发生变化时，重新执行 compile 函数。

