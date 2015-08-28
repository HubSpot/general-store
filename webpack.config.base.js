'use strict';

var webpack = require('webpack');

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
};

module.exports = {
  externals: {
    'react': reactExternal,
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel-loader'],
      exclude: /node_modules/,
    }],
  },
  output: {
    library: 'GeneralStore',
    libraryTarget: 'umd',
    sourcePrefix: '  ',
  },
  resolve: {
    extensions: ['', '.js'],
  },
};
