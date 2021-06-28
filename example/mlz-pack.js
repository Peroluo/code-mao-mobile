const path = require('path');
const pxtorem = require('postcss-pxtorem');
const config = require('./config');
const theme = require('./package.json').theme;

module.exports = {
  webpack: {
    publicPath: config.buildtime.cdn_path || '/',
    rootPath: __dirname,
    entryPath: [path.join(__dirname, './src/index.tsx')],
    htmlPlugin: {
      filename: 'index.html',
      template: path.join(__dirname, 'src/index.ejs'),
      favicon: path.join(__dirname, '/favicon.ico'),
      front_config: config.env === 'local' ? `<script>window.CODEMAOCONFIG = ${JSON.stringify(config.runtime)}</script>` : '',
    },
    definePlugin: {
      Debug: false,
    },
    analyzePlugin: config.buildtime.analyze,
    devServer: {
      port: config.buildtime.originServer.port,
      https: config.buildtime.https,
      hot: config.buildtime.hot,
      disableHostCheck: true,
    },
    loaderOptions: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => {
                const plugin = [
                  pxtorem({
                    rootValue: 100,
                    propList: [
                      '*',
                      '!min-width',
                      '!border',
                      '!border-left',
                      '!border-right',
                      '!border-top',
                      '!border-bottom',
                    ],
                    selectorBlackList: ['no_rem'],
                  }),
                ];
                return plugin;
              },
            },
          },
          { loader: 'less-loader', options: { modifyVars: theme } },
        ],
        include: /node_modules/,
      },
    ],
    babel: {
      plugins: [['import', {
        libraryName: 'lbk-common-components',
        style: true,
      }, 'lbk-common-components'],
      ],
    },
  },
};
