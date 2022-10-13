//nodejs运行，所以是commonjs
const path = require('path')
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const os = require('os')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const threads = os.cpus().length
console.log('我的电脑的cpu核数', threads)


const getStyleLoader = (pre) => {
    return [
        // 'style-loader', //将js中的css通过常见style标签添加到html文件中生效
        MiniCssExtractPlugin.loader,
        'css-loader',//将css资源编译成commonjs的模块到js中
        {
            loader: "postcss-loader",
            options: {
                postcssOptions: {
                    plugins: [
                        [
                            "postcss-preset-env", //解决大多数兼容性问题
                        ],
                    ],
                },
            },
        },
        pre
    ].filter(Boolean)
}

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'static/js/main.js',
        //webpack4需要插件实现
        clean: true, //打包前清空dist目录内容
    },
    module: {
        rules: [
            {
                oneOf: [
                    //loader的配置
                    {
                        test: /\.css$/,
                        //执行顺序从右到左
                        use: getStyleLoader()
                    },
                    {
                        test: /\.less$/i,
                        use: getStyleLoader('less-loader')
                    },
                    {
                        test: /\.(png|jpg|gif)$/,
                        type: 'asset', //webpack5内置了loader
                        //对小于10keb的图片转成best64:优点减少请求数量，缺点体积会大一点点
                        parser: {
                            dataUrlCondition: {
                                maxSize: 10 * 1024 // 10kb
                            }
                        },
                        generator: {
                            //输出图片名字
                            //ext后缀名
                            filename: 'static/images/[hash:10][ext][query]'
                        },
                    },
                    {
                        test: /\.(ttf|woff|woff2|mp4)$/,
                        type: 'asset/resource', //原封不动输出
                        generator: {
                            //输出图片名字
                            //ext后缀名
                            filename: 'static/media/[hash:10][ext][query]'
                        },
                    },
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: 'thread-loader', //开启多进程
                                options: {
                                    Work: threads
                                }
                            },
                            {
                                loader: 'babel-loader',
                                options: {
                                    // presets: ['@babel/preset-env']
                                    cacheDirectory: true,//开启Babel缓存
                                    cacheCompression: false//关闭缓存文件压缩
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            // `...`,
            //css文件压缩
            new CssMinimizerPlugin(),
            //开启多进程打包
            new TerserWebpackPlugin({
                parallel: threads
            })
        ],
    },
    plugins: [
        //Eslint配置
        new ESLintPlugin({
            context: path.resolve(__dirname, '../src'),
            cache: true,//开启eslint缓存
            cacheLocation: path.resolve(__dirname, '../node_modules/.cache/eslintcache'),
            threads  //开启多进程
        }),
        //保留之前的dom结构
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../public/index.html')
        }),
        //把css从js中分离出来
        new MiniCssExtractPlugin({
            filename: 'static/css/main.css'
        }),

    ],
    mode: 'production',
    devtool: 'source-map'
}