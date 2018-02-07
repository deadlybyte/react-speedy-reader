/* eslint-disable */
var config = require('./webpack.config.js');

config.resolve.alias['react-speedy-reader'] = '../../src/index';

module.exports = config;
