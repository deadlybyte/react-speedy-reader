/* eslint-disable */

var webpack = require('webpack');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: [
    'react-hot-loader/patch',
    './index.js',
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'index.js',
  },
  devServer: {
    contentBase: './',
    port: 9001,
    publicPath: '/dist/'
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/, options: { babelrc: false, plugins: [
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-function-bind",
        "@babel/plugin-proposal-object-rest-spread",
        "react-hot-loader/babel"
      ], "presets": [
        "@babel/preset-react"
      ] } },
      { test: /\.js$/, loader: 'eslint-loader', exclude: [/node_modules/, /dist/] },
    ],
  },
  resolve: {
    alias: {
      'react-speedy-reader': '../../dist/index',
    },
  },
  plugins: [
    new OpenBrowserPlugin({ url: 'http://localhost:9001'})
  ],
};
