### webpack
+ webpack本身功能比较少，只能处理js资源
```js
npm init -y

npm install webpack webpack-cli -D

npx webpack ./src/main.js --mode=development  //开发模式只编译不压缩

npx webpack ./src/main.js --mode=production  //生产模式：自执行函数,会编译会压缩代码
```

### webpack的五个核心概念
+ entry（入口）
+ output（出口）
+ loader（加载器）
+ plugins（插件）
+ mode（模式）
```js
//写了配置文件就可以直接执行npx webpack 去读取相应的配置
npx webpack 
```
```js
//开发模式
// 1、编译代码，使得浏览器能识别运行
// 2、代码质量检查，树立代码规范
//生产模式
```

### 处理css资源
```
npm install --save-dev css-loader
npm install style-loader --save-dev
```

### 处理less
```
npm install less less-loader --save-dev
```

### 对图片资源处理
+ webpack5内置了处理
```js
 {
    test: /\.(png|jpg|gif)$/,
    type:'asset'
}
```
+ 对图片处理进行优化
```js
//对小于10keb的图片转成best64:优点减少请求数量，缺点体积会大一点点

```

### 打包前自动清空dist文件目录

### 对字体图标资源处理
+ 阿里矢量图标库下载图标
```css
@font-face {
  font-family: "iconfont"; /* Project id 3694127 */
  src: url('../fonts/iconfont.woff2?t=1665316229938') format('woff2'),
       url('../fonts/iconfont.woff?t=1665316229938') format('woff'),
       url('../fonts/iconfont.ttf?t=1665316229938') format('truetype');
}
```
+ 优化打包路径
```js
 {
    test: /\.(ttf|woff|woff2)$/,
    type: 'asset/resource', //原封不动输出
    generator: {
        //输出图片名字
        //ext后缀名
        filename: 'static/media/[hash:10][ext][query]'
    },
}
```

### 对其他资源进行处理
```js
{
    test: /\.(ttf|woff|woff2|mp4)$/,
    type: 'asset/resource', //原封不动输出
    generator: {
        //输出图片名字
        //ext后缀名
        filename: 'static/media/[hash:10][ext][query]'
    },
}
```

### 处理js资源
```js
//webpack只便于js中的ES模块化语法；不能编译其他语法，导致不能在ie等浏览器中运行
//1、针对js兼容性处理，我们使用babel来完成
//2、针对代码格式，我们使用eslint来完成
//先进行esLint检查，检测代码格式无误后，最后由babel做代码兼容性处理
```


### Eslint：可组装的javaScript和JSX检查工具
+ 配置文件有很多写法
```js
npm install eslint-webpack-plugin --save-dev
npm install eslint --save-dev
// .eslintrc
// .eslintrc.js
// .eslintrc.json
//在package.json中eslintConfig：不需要创建文件，在原有文件基础上写
```
+ 配置
```js
plugins: [
        //plugin的配置
        new ESLintPlugin({
            context:path.resolve(__dirname,'src')
        })
    ],
```
+ .eslintignore


### Babel
```js
npm install -D babel-loader @babel/core @babel/preset-env
//将ee6语法编写的代码转换向后兼容的javascript语法，以便能够运行在当前和旧版本的浏览器或环境中  
//babel.config.js
//babel.config.json
//.babelrc
//.babelrc.js
//.babelrc.json
//在package.json中babel：不需要创建文件，在原有文件基础上写
```

### html自动引入js文件
```js
// npm install --save-dev html-webpack-plugin
plugins: [
        //保留之前的dom结构
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'public/index.html')
        })
    ],

```

### 开发服务器
```js
npm install --save webpack-dev-server
//变成这样的命令，自动监视src下面的文件变化，自动编译
npm webpack server
```
```js
//npm webpack执行这个命令这些配置不生效
//开发服务器
    devServer:{
        host:'localhost',
        port:'3000',
        open:true
    },
```

## 以上完成了开发模式的配置

### 生产模式
+ 改造配置文件
```js
// npx webpack server --config ./config/webpack.dev.js

// npx webpack --config ./config/webpack.prod.js

//可以省略npx
"scripts": {
    "start":"npm run dev",
    "dev":"webpack server --config ./config/webpack.dev.js",
    "build":"webpack --config ./config/webpack.prod.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
```

### 提取css为单独的文件
```js
//webpack5的新插件
npm install --save-dev mini-css-extract-plugin
```


### css样式兼容性处理
```js
//css样式兼容性处理
npm install postcss-loader postcss postcss-preset-env -D
```
+ package.json
```
"browserslist":[
    "last 2 version",
    "> 1%",
    "not dead"
  ]
```

### css压缩
```js
//webpack5的新插件
npm install css-minimizer-webpack-plugin --save-dev
```

### html和js在开启生产模式时默认就是压缩的

### sourceMap
+ 源代码映射：是一个用来生产源代码与构建后代码---映射文件的方案
```js
为什么
是什么
怎么用
// 增强调试，解决bug快速
```
+ devtool:'cheap-module-source-map'
```
只映射行
```
+ devtool:'source-map'
```
映射行、列
```

### 提升打包构建速度
+ 热模块替换：HotModuleReplacement
```js
//在程序运行中，替换。添加或删除模块，则无需重写加载整个页面 

//更改其中一个模块，所有的模块都会重新打包

hot:true
//开启hmr功能，只能用于开发环境，生产环境不需要

if(module.hot){
    //判断是否支持热模块替换功能
    module.hot.accept('./js/sum')
    // vue-loader、react-hot-loader帮助我们实现了热模块替换功能
}
```

### oneOf
```
只匹配一个loader，剩下的就不匹配了
```

### Include/Exclude
```
在对js文件处理时，因为使用的第三方库不需要我们在做处理了
```

### Eslint和Babel编译速度慢
```js
提升的是第二次，第三次打包速度，缓存起来
// 通过配置项去配置
```

### eslint/babel/thead
+ 多进程打包：开启电脑的多个进程干同一件事情，速度更快
```
npm install thread-loader -D
```