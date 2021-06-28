const path = require('path');
const webpack = require('webpack');
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const replaceLib = require('antd-tools/lib/replaceLib');
const pkg = require('../package.json');

const useReact = process.env.DEMO_ENV === 'react';
const isDev = process.env.NODE_ENV === 'development';

function alertBabelConfig(rules) {
  rules.forEach((rule) => {
    if (rule.loader && rule.loader === 'babel-loader') {
      rule.options.plugins.push(replaceLib);
    } else if (rule.use) {
      alertBabelConfig(rule.use);
    }
  });
}

const reactExternals = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'react-router': 'ReactRouter',
};

const preactExternals = {
  preact: 'preact',
};

const preactAlias = {
  react: 'preact-compat',
  'react-dom': 'preact-compat',
  'create-react-class': 'preact-compat/lib/create-react-class',
  preact$: 'preact/dist/preact.js', // https://github.com/developit/preact/issues/924
};

const prodExternals = useReact ? reactExternals : preactExternals;

module.exports = {
  filePathMapper(filePath) {
    if (filePath === '/index.html') {
      return ['/index.html'];
    }
    if (filePath.endsWith('/index.html')) {
      return [filePath, filePath.replace(/\/index\.html$/, '-cn/index.html')];
    }
    if (filePath !== '/404.html' && filePath !== '/index-cn.html') {
      return [filePath, filePath.replace(/\.html$/, '-cn.html')];
    }
    return filePath;
  },
  // webpack相关配置
  webpackConfig(config) {
    config.externals = {
      history: 'History',
      'babel-polyfill': 'this', // hack babel-polyfill has no exports
    };
    // dev 环境下统一不 external 因为 preact/devtools 未提供 umd
    if (!isDev) {
      config.externals = Object.assign(config.externals, prodExternals);
    } else {
      config.devtool = 'source-map';
    }

    alertBabelConfig(config.module.rules);
    config.plugins.push(new CSSSplitWebpackPlugin({ size: 4000 }));

    // 文档展示的组件指向components/*
    config.resolve.alias = {
      [`${pkg.name}/lib`]: path.join(process.cwd(), 'components'),
      [`${pkg.name}`]: process.cwd(),
      site: path.join(process.cwd(), 'site'),
    };
    if (!useReact) {
      config.resolve.alias = Object.assign(config.resolve.alias, preactAlias);
    }


    config.plugins.push(new webpack.DefinePlugin({
      PREACT_DEVTOOLS: isDev && !useReact,
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }));

    // fix webpack-dev-server "SyntaxError: Use of const in strict mode." ref https://github.com/mrdulin/blog/issues/35
    // https://github.com/webpack/webpack/issues/2031#issuecomment-339336830
    config.module.rules.push({
      test: /webpack-dev-server|to-fast-properties/,
      loader: 'babel-loader',
    });
    return config;
  },
  htmlTemplateExtraData: {
    isDev,
    useReact,
    useHD: process.env.HD_ENV === 'hd',
  },
  themeConfig: {
    siteTitle: 'Lbk Component',
    siteSubTitle: '录播课移动端组件库',
    indexDemos: ['drawer'], // for kitchen 这些组件每个 demo 都需要全屏展示，首页直接放其各个 demo 链接
    subListDemos: ['list-view', 'pull-to-refresh', 'tab-bar'], // for kitchen 这些组件每个 demo 都需要全屏展示，首页直接放其各个 demo 链接
    hashSpliter: '-demo-', // for kitchen URL 中记录到 hash 里的特殊标记
    // 组件分类
    categoryOrder: [
      'Base Components',
      'Business Components',
    ],
    // 分类名称
    cateChinese: {
      'Base Components': '基础组件',
      'Business Components': '业务组件',
    },
  },
  devServerConfig: {
    disableHostCheck: true,
  },
};
