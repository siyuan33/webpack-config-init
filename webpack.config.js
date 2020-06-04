/*
  
  webpack.config.js 里面加载的配置
  基于node 
  所有用 commonjs

*/
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');  //a Class
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

// 设置 node 的环境变量
process.env.NODE_ENV = "development"
// process.env.NODE_ENV = "production"
console.log(process.env.NODE_ENV, "process.env.NODE_ENV")

module.exports = {
  // webpack 配置
  // 入口起点
  entry: ["./src/index.js", "./src/index.html"], //html 只有一个 不需要 HMR 功能
  output: {
    filename: "js/bundle[name][chunkhash:10].js",
    path: path.resolve(__dirname, "build"),
  },
  module: {
    rules: [
      //详细的loader
      {
        // 匹配哪些文件
        test: /\.css$/,
        use: [
          // 必须按照处理的顺序从右到左排列

          //  使用 MiniCssExtractPlugin 插件中的 loader 这样css 就不会被打包到js 中 而是被 单独提取成 css 文件
          // 这样 style 在 html 中就不是一个插入的 <style>标签了  而是一个 <link> 的链接
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it use publicPath in webpackOptions.output
              publicPath: '../'
            }
          },
          //将 css 文件变成commonjs 模块加载到js中 里面的内容是样式的字符串
          "css-loader",

          /*
            css 兼容性处理 使用postcss-loader
            依赖了  postcss-loader  postcss-preset-env 两个库
          */
          // {
          //   loader: "postcss-loader",
          //   options: {
          //     ident: "postcss",
          //     plugins: () => {
          //       //postcss 的插件

          //       // "browserslist": {
          //       //   "development": [
          //       //     "last 1 chrome version",
          //       //     "last 1 firefox version",
          //       //     "last 1 safari version"
          //       //   ],
          //       //   "production": [
          //       //     "> 0.2%",
          //       //     "not dead",
          //       //     "not op_mini all"
          //       //   ]
          //       // }
          //       require('postcss-preset-env')()
          //     }
          //   }
          // }
        ]
      },
      { // 注意是sass loader
        test: /\.scss$/,
        use: [

          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        // 样式中图片loader   依赖了 file-loader
        // 缺点 不能处理 html 中的 url 引用
        test: /\.(jpg|png|gif|jpeg)$/i,
        loader: "url-loader",
        options: {
          // 图片大小小于 40KB 就会被base64 处理
          // 优点 ： 减少请求数量 减少服务器压力  |  缺点： 文件会变大
          limit: 10 * 1024,
          // 关闭 es6 使用 commonjs
          esModule: false,
          // 图片取hash 前10位值
          name: "[hash:10].[ext]",
          outputPath: "image"
        },
      },
      {
        // 处理html 中引入图片路径的问题
        test: /\.html$/,
        loader: "html-loader",
      },
      // {
      //   // js 兼容性处理 babel-loader
      //   // 依赖 babel-loader   @babel/preset-env @babel/core
      //   // 依赖 corejs 去按需加载兼容的代码
      //   test: /\.js$/,
      //   exclude: /node_modules/i,
      //   loader: "babel-loader",
      //   options: {
      //     // 预设 babel 做兼容处理
      //     presets: [
      //       "@babel/preset-env",
      //       {
      //         useBuiltIns: true,
      //         corejs: {
      //           version: 3
      //         },
      //         targets: {
      //           chrome: "60",
      //           firefox: "60",
      //           ie: "8"
      //         }
      //       }
      //     ]
      //   }
      // },
    ]
  },
  plugins: [
    // 详细的plugins

    //功能:默认创建一个空壳HTML 引入打包后的bundle.js
    //传入参数是的空壳HTML 变成自定义的结构
    new htmlWebpackPlugin({
      template: path.resolve(__dirname, "src/index.html"),
      minify: {
        // 移除空格
        collapseInlineTagWhitespace: true,
        // 移除注释
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "css/main.css",
      chunkFilename: "[id].css"
    }),
    new OptimizeCSSAssetsPlugin({}),
  ],
  mode: "development",
  // mode : "production",

  // 开发服务器 自动编译 打开浏览器 自动刷新

  // 特点 只会在内存中编译打包 不会有任何输出
  // 启动 DevServer 的指令为 npx webpack-dev-server
  devServer: {
    contentBase: path.resolve(__dirname, "build"),
    // 启用 gzip 压缩 代码体积会更小
    compress: true,
    port: 3000,
    hot: true,  // 样式文件可以使用 HMR 功能  因为 style-loader 内部实现了 所以development 最好使用style-loader 作为最后一个样式loader
    //  product 环境还是使用压缩css 的配置
    // 但是 js 这个并不能热更新
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
            drop_debugger: true,
            drop_console: true
          }
        }
      })
    ]
  },
  devtool: "eval-source-map",   //process.env.NODE_ENV === "development"
  // devtool: "hidden-source-map",  //process.env.NODE_ENV === "production"
  /*
  source-map 打包后代码 可以 映射到源代码 适合调试
  但是这样打包速度会变慢
  [inline-|hidden-|eval-][nosources-][cheap-[modules-]]source-map

  inline-source-map    //不在外部生产 map 文件 直接内联在 js 文件中只生成一个内联的source-map   构建速度更快
  hidden-source-map    // 会生成外部的 map 文件
  eval-source-map      // 也是内联 但是在每一个文件都生成 source-map  放到 eval函数中 

  nosources-source-map   // 生成外部
  ......

  */
};

