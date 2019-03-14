'use strict';

var path = require('path');
var baseConfig = require('./webpack.config.base');

var config = Object.create(baseConfig);
config.mode = 'development';
config.output = {
  path: path.resolve(__dirname, 'dist'),
  filename: 'general-store.js',
  library: 'GeneralStore',
  libraryTarget: 'umd',
  sourcePrefix: '  ',
};

module.exports = config;
