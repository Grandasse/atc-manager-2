const pkg = require('./package.json');
const webpack = require('webpack');
const preactCliSwPrecachePlugin = require('preact-cli-sw-precache');
const path = require('path');
const asyncPlugin = require('preact-cli-plugin-fast-async');

export default function (config, env, helpers) {
  const loader = config.module.loaders.find(x => x.loader === 'babel-loader');
  loader.options.plugins.push('recharts');
  if (env.isProd) {
    config.devtool = false; // disable sourcemaps
    loader.options.compact = true;
    config.output.publicPath = '';
  }

  const { loader: cssLoader } =
    helpers.getLoadersByName(config, 'css-loader')[0];
  cssLoader.options.modules = false;

  asyncPlugin(config);

  const precacheConfig = {
    importScripts: [
      // assume this js file is written manually outside of webpack
      { filename: 'assets/push-notifications.js' }
    ]
  };
  config = preactCliSwPrecachePlugin(config, precacheConfig);
  return config;
}

require('./node_modules/postcss');