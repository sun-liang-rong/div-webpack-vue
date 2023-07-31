const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const WebpackBundleAnalyzer =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { VueLoaderPlugin } = require("vue-loader");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
/**
 * 多线程打包
 */
const Happypack = require("happypack");
/**
 * 基本的系统操作函数
 */
const os = require("os");
const happyThreadPool = Happypack.ThreadPool({
  size: os.cpus().length,
});
module.exports = {
  mode: "development", //开发环境
  devtool: "inline-source-map", // 开发环境下使用 查看打包后的代码和源代码的映射关系
  entry: "./src/main.js", //入口文件
  output: {
    //出口文件
    filename: "js/[name].js", //打包后的文件名 name不写默认main  contenthash会自动生成一个hash
    path: path.resolve(__dirname, "dist"), //打包后的文件路径
  },
  //开启代码压缩
  optimization: {
    minimize: process.env.NODE_ENV === "production" ? true : false, //为了不影响dev时的构建速度, //是否开启代码压缩
    minimizer: [
      new TerserWebpackPlugin({
        parallel: true, //使用多进程并发运行以提高构建速度 Boolean|Number 默认值： true
        terserOptions: {
          compress: {
            drop_console: true, //移除所有console相关代码；
            drop_debugger: true, //移除自动断点功能；
            pure_funcs: ["console.log", "console.error"], //配置移除指定的指令，如console.log,alert等
          },
          format: {
            comments: false, //删除注释
          },
        },
        extractComments: false, //是否将注释提取到一个单独的文件中
      }), //使用TerserWebpackPlugin插件进行代码压缩
    ],
  },
  //设置别名
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), //设置@为src目录
      assets: path.resolve(__dirname, "src/assets"), //设置assets为src/assets目录
      utils: path.resolve(__dirname, "src/utils"), //设置utils为src/utils目录
    },
  },
  //设置开发环境下的服务器
  devServer: {
    static: "./dist", //设置静态文件目录
    port: 3000, //设置端口号
  },
  plugins: [
    //插件
    new HtmlWebpackPlugin({
      //使用HtmlWebpackPlugin插件
      title: "博客列表",
      template: path.resolve(__dirname, "public/index.html"), //使用public/index.html作为模板
      chunks: ["main"], // 与入口文件对应的模块名
    }),
    //使用webpack-bundle-analyzer插件 分析打包后的文件 生成一个html文件 里面有打包后的文件的分析 大小
    new WebpackBundleAnalyzer({
      analyzerHost: "127.0.0.1",
      // 打开的端口
      analyzerPort: 8080,
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      // 这里的配置和webpackOptions.output中的配置相似
      // 即可以通过在名字前加路径，来决定打包后的文件存在的路径
      filename: "css/[name].css",
      chunkFilename: "css/[id].css",
    }),
    //多线程打包
    //不要上来就开启多进程打包，一般遇到性能瓶颈或者明确需要优化打包速度时，可以考虑采用这两种方案。因为多进程也有有开销的，如进程的启动，销毁，通信等。
    new Happypack({
      //和 loader 对应的 id 标识
      id: "happybabel",
      // 用法和 loader 配置一样 注意这里是 loaders
      loaders: [
        {
          //
          loader: "babel-loader",
          //
          options: {
            presets: ["@babel/preset-env"],
          },
          cacheDirectory: true,
        },
      ],
      // 共享进程池
      threadPool: happyThreadPool,
    }),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require("./vendor-manifest.json"),
    }),
    // 拷贝生成的文件到dist目录 这样每次不必手动去cv
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "static"),
          to: path.resolve(__dirname, "dist"),
        },
      ],
    }),
  ],
  module: {
    //模块
    rules: [
      //规则
      {
        test: /\.css$/i, //正则匹配所有.css结尾的文件 匹配好的使用use插件进行转换 i标识忽略大小写
        use: [MiniCssExtractPlugin.loader, "css-loader"], //从右向左执行
      },
      {
        test: /\.(jpg|png|gif|svg|jpeg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.less$/i, //正则匹配所有.less结尾的文件 匹配好的使用use插件进行转换 i标识忽略大小写
        use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"], //从右向左执行
      },
      {
        test: /\.vue$/i, //正则匹配所有.vue结尾的文件 匹配好的使用use插件进行转换 i标识忽略大小写
        exclude: /node_modules/, //排除node_modules文件夹
        use: [
          {
            loader: "vue-loader",
            options: {
              hotReload: false,
            },
          },
        ], //从右向左执行
      },
      {
        test: /\.js$/i, //正则匹配所有.js结尾的文件 匹配好的使用use插件进行转换 i标识忽略大小写
        exclude: /node_modules/, //排除node_modules文件夹
        use: {
          //使用babel-loader插件进行转换
          loader: "babel-loader",
          options: {
            //使用babel-loader的配置
            presets: [
              //使用babel-loader的预设
              "@babel/preset-env", //使用@babel/preset-env预设
            ],
          },
        },
      },
    ],
  },
};
