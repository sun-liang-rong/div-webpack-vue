const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  mode: 'development', //开发环境
  devtool: 'inline-source-map', // 开发环境下使用 查看打包后的代码和源代码的映射关系
  entry: './src/index.js', //入口文件
  output: { //出口文件
    filename: '[name].[contenthash].js', //打包后的文件名 name不写默认main  contenthash会自动生成一个hash
    path: path.resolve(__dirname, 'dist') //打包后的文件路径
  },
  //开启代码压缩
  optimization: {
    minimize: true, //是否开启代码压缩
    minimizer: [
      new TerserWebpackPlugin({}) //使用TerserWebpackPlugin插件进行代码压缩
    ]
  },
  //设置别名
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), //设置@为src目录
      'assets': path.resolve(__dirname, 'src/assets'), //设置assets为src/assets目录 
      'utils': path.resolve(__dirname, 'src/utils'), //设置utils为src/utils目录
    }
  },
  //设置开发环境下的服务器
  devServer: {
    static: './dist', //设置静态文件目录
  },
  plugins: [ //插件
    new HtmlWebpackPlugin({ //使用HtmlWebpackPlugin插件
      title: '博客列表',
    }),
    //使用webpack-bundle-analyzer插件 分析打包后的文件 生成一个html文件 里面有打包后的文件的分析 大小
    new WebpackBundleAnalyzer()
  ],
  module: { //模块
    rules: [ //规则
      {
        test: /\.css$/i, //正则匹配所有.css结尾的文件 匹配好的使用use插件进行转换 i标识忽略大小写
        use: ['style-loader', 'css-loader'] //从右向左执行
      },
      {
        test: /\.(jpg|png|gif|svg|jpeg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.js$/i, //正则匹配所有.js结尾的文件 匹配好的使用use插件进行转换 i标识忽略大小写
        exclude: /node_modules/, //排除node_modules文件夹
        use: { //使用babel-loader插件进行转换
          loader: 'babel-loader',
          options: { //使用babel-loader的配置
            presets: [ //使用babel-loader的预设
              '@babel/preset-env', //使用@babel/preset-env预设
            ]
          }
        }
      }
    ]
  }
}