const child_progress = require('child_process');
const glob = require('glob');
const { resolve, relative } = require('path');
const fs = require('fs');
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  Object.assign(process.env, {
    'EXTEND_ESLINT': true,
    'PUBLIC_URL': '/',
    'GENERATE_SOURCEMAP': false
  });
} else {
  Object.assign(process.env, {
    'BROWSER': 'none',
    'EXTEND_ESLINT': 'true',
    'PUBLIC_URL': '/'
  });
}

const files = glob.sync(resolve(__dirname, './src/views/*'));

const routes = files.map(file => {
  if (!fs.statSync(file).isDirectory()) {
    return null;
  }
  try {
    const route = JSON.parse(
      fs.readFileSync(
        resolve(file, 'route.json')
      ).toString('utf-8')
    );
    return Object.assign({
      filePath: relative(resolve(__dirname, './src'), file)
        .replace(/\\/g, '/')
        .replace(/^\.\//, '')
    }, route);
  } catch (err) {
    console.error(err);
    return null;
  }
}).filter(v => !!v);

Object.assign(process.env, {
  'REACT_APP_ROUTES': JSON.stringify(routes)
});

const progress = child_progress.exec(isProduction ? 'react-scripts build' : 'react-scripts start');
progress.stdout.pipe(process.stdout);
progress.stderr.pipe(process.stderr);
