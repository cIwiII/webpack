/** 
 * webpack 内部实现
 * 
 * 当前弊端，不能自动创建dist/main.js文件，手动创建后打包
 */

const { SyncHook } = require("tapable");//打包触发钩子函数
const path = require("path");
const fs = require("fs");

// 5.7 找出深层模块依赖-，再对依赖模块编译--分10步-------
const parser = require("@babel/parser");
let types = require("@babel/types"); //用来生成或者判断节点的AST语法树的节点
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;

// 5.7 获取文件路径
function tryExtensions(modulePath, extensions) {
  if (fs.existsSync(modulePath)) {
    return modulePath;
  }
  for (let i = 0; i < extensions?.length; i++) {
    let filePath = modulePath + extensions[i];
    if (fs.existsSync(filePath)) {
      return filePath;
    }
  }
  throw new Error(`无法找到${modulePath}`);
}

// 5.6.1  考虑系统兼容性，将路径 \ 都替换成 /
function toUnixPath(filePath) {
  return filePath.replace(/\\/g, "/");
}

// 5.6.1 获取工作目录，在哪里执行命令就获取哪里的目录，要替换成/
const baseDir = toUnixPath(process.cwd());


// 5.9 chunk代码块 转换为文件，生成运行时代码，最终main.js大致文件
/** chunk是打包信息，    chunk.modules是文件模块信息，
 *  module 是单个文件模块，module.id 文件id，也就是路径名
 *  mudule._source 是文件暴露模块的内容（源码）
 * 
 *  chunk.entryModule._source： 入口文件源码
 *  */
function getSource(chunk) {
  return `
    (() => {
     var modules = {
       ${chunk.modules.map(
    (module) => `
           "${module.id}": (module) => {
             ${module._source}
           }
          `
  )}  
     };
     var cache = {};
     function require(moduleId) {
       var cachedModule = cache[moduleId];
       if (cachedModule !== undefined) {
         return cachedModule.exports;
       }
       var module = (cache[moduleId] = {
         exports: {},
       });
       modules[moduleId](module, module.exports, require);
       return module.exports;
     }
     var exports ={};
     ${chunk.entryModule._source}
   })();
    `;
}


// 5.4  执行Compiler对象的run方法开始执行编译-
/**
 * 编译这个阶段需要单独解耦出来，通过 Compilation 来完成，定义Compilation 大致结构
 */
class Compilation {
  constructor(webpackOptions) {
    this.options = webpackOptions;
    this.modules = []; //本次编译所有生成出来的模块
    this.chunks = []; //本次编译产出的所有代码块，入口模块和依赖的模块打包在一起为代码块
    this.assets = {}; //本次编译产出的资源文件
    this.fileDependencies = []; //本次打包涉及到的文件，这里主要是为了实现watch模式下监听文件的变化，文件发生变化后会重新编译
  }

  // 5.6.2 当编译模块的时候，name：这个模块是属于哪个代码块chunk的，modulePath：模块绝对路径
  buildModule(name, modulePath) {

    //6.2.1 读取模块内容，获取源代码
    let sourceCode = fs.readFileSync(modulePath, "utf8");
    
    //buildModule最终会返回一个modules模块对象，每个模块都会有一个id,id是相对于根目录的相对路径
    let moduleId = "./" + path.posix.relative(baseDir, modulePath); //模块id:从根目录出发，找到与该模块的相对路径（./src/index.js）

    //5.6.2.2 创建模块对象
    let module = {
      id: moduleId,
      names: [name], //names设计成数组是因为代表的是此模块属于哪个代码块，可能属于多个代码块
      dependencies: [], //它依赖的模块
      _source: "", //该模块的代码信息
    };

    // 5.6.2.3 找到对应的 `Loader` 对源代码进行翻译和替换
    let loaders = [];
    let { rules = [] } = this.options.module;
    rules.forEach((rule) => {
      let { test } = rule;
      //如果模块的路径和正则匹配，就把此规则对应的loader添加到loader数组中
      if (modulePath.match(test)) {
        loaders.push(...rule.use);
      }
    });
    //自右向左对模块进行转译
    sourceCode = loaders.reduceRight((code, loader) => {
      return loader(code);
    }, sourceCode);

    //通过loader翻译后的内容一定得是js内容，因为最后得走我们babel-parse，只有js才能成编译AST
    //第七步：找出此模块所依赖的模块，再对依赖模块进行编译
    //7.1：先把源代码编译成 [AST](https://astexplorer.net/)
    let ast = parser.parse(sourceCode, { sourceType: "module" });
    traverse(ast, {
      CallExpression: (nodePath) => {
        const { node } = nodePath;
        //7.2：在 `AST` 中查找 `require` 语句，找出依赖的模块名称和绝对路径
        if (node.callee.name === "require") {
          let depModuleName = node.arguments[0].value; //获取依赖的模块
          let dirname = path.posix.dirname(modulePath); //获取当前正在编译的模所在的目录
          let depModulePath = path.posix.join(dirname, depModuleName); //获取依赖模块的绝对路径
          let extensions = this.options.resolve?.extensions || [".js"]; //获取配置中的extensions
          depModulePath = tryExtensions(depModulePath, extensions); //尝试添加后缀，找到一个真实在硬盘上存在的文件
          //7.3：将依赖模块的绝对路径 push 到 `this.fileDependencies` 中
          this.fileDependencies.push(depModulePath);
          //7.4：生成依赖模块的`模块 id`
          let depModuleId = "./" + path.posix.relative(baseDir, depModulePath);
          //7.5：修改语法结构，把依赖的模块改为依赖`模块 id` require("./name")=>require("./src/name.js")
          node.arguments = [types.stringLiteral(depModuleId)];
          //7.6：将依赖模块的信息 push 到该模块的 `dependencies` 属性中
          module.dependencies.push({ depModuleId, depModulePath });
        }
      },
    });

    //7.7：生成新代码，并把转译后的源代码放到 `module._source` 属性上
    let { code } = generator(ast);
    module._source = code;
    //7.8：对依赖模块进行编译（对 `module 对象`中的 `dependencies` 进行递归执行 `buildModule` ）
    module.dependencies.forEach(({ depModuleId, depModulePath }) => {
      //考虑到多入口打包 ：一个模块被多个其他模块引用，不需要重复打包
      let existModule = this.modules.find((item) => item.id === depModuleId);
      //如果modules里已经存在这个将要编译的依赖模块了，那么就不需要编译了，直接把此代码块的名称添加到对应模块的names字段里就可以
      if (existModule) {
        //names指的是它属于哪个代码块chunk
        existModule.names.push(name);
      } else {
        //7.9：对依赖模块编译完成后得到依赖模块的 `module 对象`，push 到 `this.modules` 中
        let depModule = this.buildModule(name, depModulePath);
        this.modules.push(depModule);
      }
    });

    //7.10：等依赖模块全部编译完成后，返回入口模块的 `module` 对象
    return module;
  }



  build(callback) {
    // 5.5 entry配置项找到所有的入口 ---
    //第五步：根据配置文件中的`entry`配置项找到所有的入口
    let entry = {};
    if (typeof this.options.entry === "string") {
      entry.main = this.options.entry; //如果是单入口，将entry:"xx"变成{main:"xx"}，这里需要做兼容
    } else {
      entry = this.options.entry;
    }

    // 5.6.1 第六步：从入口文件出发，调用配置的 `loader` 规则，对各模块进行编译
    for (let entryName in entry) {
      //entryName="main" entryName就是entry的属性名，也将会成为代码块的名称
      let entryFilePath = path.posix.join(baseDir, entry[entryName]); //path.posix为了解决不同操作系统的路径分隔符,这里拿到的就是入口文件的绝对路径
      //5.6.1 把入口文件的绝对路径添加到依赖数组（`this.fileDependencies`）中，记录此次编译依赖的模块
      this.fileDependencies.push(entryFilePath);

      //5.6.2 得到入口模块的的 `module` 对象 （里面放着该模块的路径、依赖模块、源代码等）
      let entryModule = this.buildModule(entryName, entryFilePath);

      //5.6.3 将生成的入口文件 `module` 对象 push 进 `this.modules` 中
      this.modules.push(entryModule);


      //5.8 第八步：等所有模块都编译完成后，根据模块之间的依赖关系，组装代码块 `chunk`（一般来说，每个入口文件会对应一个代码块`chunk`，每个代码块`chunk`里面会放着本入口模块和它依赖的模块）
      let chunk = {
        name: entryName, //entryName="main" 代码块的名称
        entryModule, //此代码块对应的module的对象,这里就是src/index.js 的module对象
        modules: this.modules.filter((item) => item.names.includes(entryName)), //找出属于该代码块的模块
      };
      this.chunks.push(chunk);
    }

    // 5.9 第九步：把各个代码块 `chunk` 转换成一个一个文件加入到输出列表
    this.chunks.forEach((chunk) => {
      let filename = this.options.output.filename.replace("[name]", chunk.name);
      this.assets[filename] = getSource(chunk);
    });

    //编译成功执行callback
    // 5.9 完成时执行，至此，Compilation 的逻辑就走完了
    callback(
      null,
      {
        chunks: this.chunks,
        modules: this.modules,
        assets: this.assets,
      },
      this.fileDependencies
    )
  }
}


//Compiler其实是一个类，它是整个编译过程的大管家，而且是单例模式
class Compiler {
  // 5.2、用配置参数对象初始化 Compiler 对象
  constructor(webpackOptions) {
    this.options = webpackOptions; //存储配置信息
    //它内部提供了很多钩子
    this.hooks = {
      run: new SyncHook(), //编译刚开始触发run钩子
      done: new SyncHook(), //编译结束触发此done钩子
    };
  }

  // 5.4、执行Compiler对象的run方法开始执行编译---
  compile(callback) {
    //虽然webpack只有一个Compiler，但是每次编译都会产出一个新的Compilation，
    //这里主要是为了考虑到watch模式，它会在启动时先编译一次，然后监听文件变化，如果发生变化会重新开始编译
    //每次编译都会产出一个新的Compilation，代表每次的编译结果
    let compilation = new Compilation(this.options);
    compilation.build(callback); //执行compilation的build方法进行编译，编译成功之后执行回调
  }
  // 5.4 第四步：执行`Compiler`对象的`run`方法开始执行编译
  run(callback) {
    this.hooks.run.call(); //在编译前触发run钩子执行，表示开始启动编译了
    const onCompiled = (err, stats, fileDependencies) => {

      // 5.10 第十步：确定好输出内容之后，根据配置的输出路径和文件名，将文件内容写入到文件系统（这里就是硬盘）
      for (let filename in stats.assets) {
        let filePath = path.join(this.options.output.path, filename);
        fs.writeFileSync(filePath, stats.assets[filename], "utf8");//此处暂时不能自动创建输出文件
      }

      callback(err, {
        toJson: () => stats,
      });

        // 5.10后，可以输出文件

      this.hooks.done.call(); //当编译成功后会触发done这个钩子执行
    };
    this.compile(onCompiled); //开始编译，成功之后调用onCompiled
  }

}

//第一步：搭建结构，读取配置参数，这里接受的是webpack.config.js中的参数
function webpack(webpackOptions) {

  // 第二步：用配置参数对象初始化 Compiler 对象
  const compiler = new Compiler(webpackOptions)

  // 5.3、挂载配置文件中的插件-----webpack.config.js --- Plugin 新增-------
  //第三步：挂载配置文件中的插件
  const { plugins } = webpackOptions;

  // 插件定义时必须要有一个 apply 方法，加载插件其实执行 apply 方法。
  for (let plugin of plugins) {
    plugin.apply(compiler);
  }

  return compiler;
}

// 5.3、挂载配置文件中的插件 

// 自定义插件WebpackRunPlugin
class WebpackRunPlugin {
  apply(compiler) {
    compiler.hooks.run.tap("WebpackRunPlugin", () => {
      console.log("开始编译");
    });
  }
}

// 自定义插件WebpackDonePlugin，compiler.hooks.done指定了插件的执行时机，为done时打印结束编译
class WebpackDonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap("WebpackDonePlugin", () => {
      console.log("结束编译");
    });
  }
}

// 5.5 写两个自定义 Loader 配置，source是源码，即在每个模块后加上指定的内容
const loader1 = (source) => {
  return source + "//给你的代码加点注释：loader1";
};

const loader2 = (source) => {
  return source + "//给你的代码加点注释：loader2";
};

module.exports = {
  webpack,
  WebpackRunPlugin,
  WebpackDonePlugin,
  loader1,
  loader2
};
