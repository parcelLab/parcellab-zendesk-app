const { DefinePlugin } = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TranslationsPlugin = require('./webpack/translations-plugin')

const externalAssets = {
  js: [
    'https://static.zdassets.com/zendesk_app_framework_sdk/2.0/zaf_sdk.min.js'
  ]
}

const APP_VERSION = require('./package.json').version

module.exports = {
  entry: {
    app: [
      './src/index.js',
      './src/index.css'
    ]
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/assets')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|dist|coverage)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        include: path.resolve(__dirname, './src/translations'),
        use: './webpack/translations-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.svg/,
        use: '@svgr/webpack'
      }
    ]
  },

  plugins: [
    // Empties the dist folder
    new CleanWebpackPlugin(),

    // set globals
    new DefinePlugin({
      APP_VERSION
    }),

    // Copy over static assets
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/manifest.json',
          to: '../',
          flatten: true,
          transform: content => content.toString().replace('APP_VERSION', APP_VERSION)
        },
        { from: 'src/images/*', to: '.', flatten: true }
      ]
    }),

    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),

    new TranslationsPlugin({
      path: path.resolve(__dirname, './src/translations')
    }),

    new HtmlWebpackPlugin({
      warning: 'AUTOMATICALLY GENERATED FROM ./src/templates/iframe.html - DO NOT MODIFY THIS FILE DIRECTLY',
      vendorJs: externalAssets.js,
      template: './src/templates/iframe.html',
      filename: 'iframe.html'
    })
  ]
}
