const {resolve} = require('path');
const postcssNormalize = require('postcss-normalize');
const glob = require('glob');

const source = resolve(__dirname, '../src').replace(/\\/g, '/');
const entry = {};

const files = glob.sync(
  `{${resolve(source, './components/**/{index.tsx,index.ts}')},${resolve(source, './common/**/!(__tests__)/*.ts')}}`
);
console.log(files);
files.forEach(item => {
  entry[item.replace(/(\/)[^/]+$/, '$1index').replace(source, '')] = item;
});

const cssLoaders = (modules = false) => {
  return [{
    loader: 'style-loader'
  }, {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      modules: modules
    }
  }, {
    loader: 'postcss-loader',
    options: {
      // Necessary for external CSS imports to work
      // https://github.com/facebook/create-react-app/issues/2677
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        require('postcss-preset-env')({
          autoprefixer: {
            flexbox: 'no-2009',
          },
          stage: 3
        }),
        // Adds PostCSS Normalize as the reset css with default options,
        // so that it honors browserslist config in package.json
        // which in turn let's users customize the target behavior as per their needs.
        postcssNormalize()
      ],
      sourceMap: false
    }
  }, {
    loader: 'sass-loader'
  }];
};

module.exports = {
  entry: entry,
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
  },
  externals: ['react', 'react-dom', 'react-router-dom', 'rc-field-form', 'react-transition-group'],
  output: {
    path: resolve(__dirname, '../dist/lib'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'windy',
    libraryExport: 'default'
  },
  module: {
    rules: [{
      test: /\.(js|mjs|jsx|ts|tsx)$/,
      include: resolve(__dirname, '../src'),
      use: [{
        loader: 'babel-loader',
        options: {
          presets: ['react-app'],
          plugins: [
            ['@babel/plugin-proposal-class-properties']
          ]
        }
      }]
    }, {
      test: /^((?!module).)+\.scss$/,
      exclude: /node_modules/,
      use: cssLoaders(false)
    }, {
      test: /\.module\.scss$/,
      exclude: /node_modules/,
      use: cssLoaders(true)
    }]
  }
};
