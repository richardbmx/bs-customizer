const path = require('path')
const glob = require('glob-all')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const PurgecssPlugin = require('purgecss-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const HtmlWebpackInlineSVGPlugin = require('html-webpack-inline-svg-plugin')

let fileName = 'bs-customizer.min'
const paths = {
  src: `${path.join(__dirname, 'src/js/')}*.js`,
  index: `${path.join(__dirname, 'src/')}*.html`
}

module.exports = (env, args) => {
  const prod = args.mode === 'production'

  const conf = {
    entry: './src/js/index.js',
    output: {
      filename: `${fileName}.js`,
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${fileName}.css`,
        chunkFilename: '[id].css'
      }),
      new PurgecssPlugin({
        paths: glob.sync([
          paths.src,
          paths.index,
        ]),
        whitelistPatterns: [
          /^modal/,
        ]
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'src/index.html'),
        filename: path.resolve(__dirname, 'index.html'),
        cache: prod,
      }),
      new HtmlWebpackInlineSVGPlugin(),
      //new WriteFilePlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {}
            },
            'css-loader'
          ]
        },
        {
          test: /\.(html)$/,
          use: {
            loader: 'html-loader',
          },
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'file-loader',
            },
          ]
        },
      ]
    }
  }

  if (prod) {
    conf.optimization = {
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true
        }),
        new OptimizeCSSAssetsPlugin({})
      ]
    }
  } else {
    conf.devtool = 'source-map'
    conf.devServer = {
      publicPath: '/dist/'
    }
  }

  return conf
}
