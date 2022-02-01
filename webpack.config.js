const md5 = require('md5');

module.exports = function () {
  return {
    module: {
      rules: [
        {
          test: /(\.js)$/,
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader', // creates style nodes from JS strings
            },
            {
              loader: 'css-loader', // translates CSS into CommonJS
              options: {
                url: false,
              },
            },
            {
              loader: 'sass-loader', // compiles Sass to CSS
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: 'style-loader', // creates style nodes from JS strings
            },
            {
              loader: 'css-loader', // translates CSS into CommonJS
              options: {
                url: false,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: ({ resource }) => ({
            loader: '@svgr/webpack',
            options: {
              svgoConfig: {
                plugins: [
                  {
                    removeViewBox: false,
                  },
                  {
                    cleanupIDs: {
                      prefix: `ghostkit-${md5(resource)}-`,
                    },
                  },
                ],
              },
            },
          }),
        },
        {
          test: /\.(gif|png|jpe?g)$/i,
          loader: 'base64-inline-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.json'],
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  };
};
