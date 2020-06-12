const webpack = require('webpack');
const conf = require('./webpack.base.conf');
const merge = require('webpack-merge');
const prodConf = require('./webpack.prod.conf');

webpack(merge(conf, prodConf), (err, stats) => {
  if (err) throw err;
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
    chunks: false,
    chunkModules: false
  }) + '\n\n');
});
