const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = function (_env, argv) {
  const isProduction = argv.mode === 'production'

  return {
    entry: path.resolve(__dirname, 'src/index.tsx'),
    mode: isProduction ? 'production' : 'development',
    devtool: !isProduction && 'eval-source-map',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction
        ? 'static/js/[name].js'
        : 'static/js/[name].chunk.js',
      publicPath: '/',
    },
    devServer: {
      compress: true,
      client: {
        overlay: true,
      },
      static: {
        directory: path.join(__dirname, 'public'),
      },
      port: 4030,
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              compact: isProduction,
              envName: isProduction ? 'production' : 'development',
            },
          },
        },
        {
          test: /\.(ts|tsx)?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 10000,
              },
            },
          ],
        },
        {
          test: /\.(jpg|png)$/i,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'static/media/[name].[hash:8].[ext]',
            },
          },
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'fonts/',
              },
            },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      alias: {
        stream: 'stream-browserify',
        buffer: 'buffer',
      },
      fallback: {
        http: false,
        https: false,
      },
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: path.resolve(__dirname, 'public/index.html'),
          },
          isProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, 'public'),
            to: '[name][ext]',
            globOptions: {
              ignore: ['**/*.html'],
            },
          },
        ],
      }),
    ],
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
      runtimeChunk: 'single',
    },
  }
}
