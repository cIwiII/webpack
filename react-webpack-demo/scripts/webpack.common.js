const path = require('path')
const WebpackBar = require('webpackbar')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const {PROJECT_PATH} = require('./constant')
const {isDev, isProd} = require('./config/env')

const getCssLoaders = () => {
  
  const cssLoaders  = [
    isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: isDev
      }
    }
  ]

  isProd && cssLoaders.push({
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          ['postcss-preset-env', {
            autoprefixer: {
              grid: true
            }
          }]
        ]
      }
    }
  })

  return cssLoaders
}

module.exports = {
  entry: {
    app: path.resolve(PROJECT_PATH, './src/index.tsx')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(PROJECT_PATH, './public/index.html')
    }),
    new WebpackBar({
      name: 'Compiling...', 
      color: '#AE57A4'
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: path.resolve(PROJECT_PATH, './tsconfig.json'),
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(PROJECT_PATH, './public'),
          to: path.resolve(PROJECT_PATH, './dist/public'), 
          toType: 'dir',
          globOptions: {
            dot: true,
            gitignore: true,
            ignore: ['**/index.html'],		// **表示任意目录下
          },
        },
      ],
    }),
    new CleanWebpackPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: getCssLoaders()
      },
      {
        test: /\.less$/,
        use: [
          ...getCssLoaders(),
          {
            loader: 'less-loader',
            options: {
              sourceMap: isDev,
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          ...getCssLoaders(),
          {
            loader: 'sass-loader',
            options: {
              sourceMap: isDev,
            }
          }
        ]
      },
      {
        test: /\.(tsx?|js)$/,
        loader: 'babel-loader',
        options: {cacheDirectory: true},
        exclude: /node_modules/
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 4 * 1024,
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2?)$/,
        type: 'asset/resource',
      }
    ]
  },
  resolve: {
    alias: {
      'src': path.resolve(PROJECT_PATH, './src'),
      'components': path.resolve(PROJECT_PATH, './src/components'),
      'containers': path.resolve(PROJECT_PATH, './src/containers'),
      'utils': path.resolve(PROJECT_PATH, './src/utils'),
    },
    extensions: ['.tsx', '.ts', '.js', '.json']
  },
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    }
  }
}
