const glob = require('glob');
const fs = require('fs-extra');
const { resolve } = require('path');

const sourceDir = resolve(__dirname, './src').replace(/\\/g, '/');
const targetDir = resolve(__dirname, './dist/es').replace(/\\/g, '/');

glob(resolve(sourceDir, '{common,components}/**/{*.scss,*.css,*.sass,*.less,*.gif,*.png,*.svg,*.jpg,*.jpeg}'), {}, (err, files) => {
  if (err) {
    return console.error(err);
  }
  files.forEach(item => {
    try {
      fs.copySync(item, item.replace(sourceDir, targetDir));
      console.log(`copy ${item}`);
    } catch (e) {
      throw e;
    }
  });
  console.info('ES Module build successfully!');
});

