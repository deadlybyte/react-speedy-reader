/* eslint-disable */

var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    'react-hot-loader/patch',
    './src/index.js',
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'index.js',
    publicPath: '/',
    libraryTarget: 'umd',
    library: 'ReactSpeedyReader',
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react'
    }
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.js$/, loader: 'eslint-loader', exclude: [/node_modules/, /dist/] },
    ],
  },
};
