const root = require('./helpers').root;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {

  resolve: {
    extensions: [
      '.ts', '.js'
    ],
    alias: {
      App: root('src/client/app')
    }
  },

  entry: {
    app: root('src/client/main.ts'),
    polyfills: root('src/client/polyfills.ts'),
    vendor: root('src/client/vendor.ts')
  },

  module: {

    rules: [{

      test: /\.ts$/,
      include: root('src/client'),
      exclude: root('src/server'),
      use: [{
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: root('src/client/tsconfig.json')
        }
      }, {
        loader: 'angular2-template-loader'
      }]

    }, {

      test: /\.scss$/,
      include: root('src/client/app'),
      use: [{
        loader: 'raw-loader'
      }, {
        loader: 'sass-loader'
      }]

    }, {

      test: /\.scss$/,
      exclude: root('src/client/app'),
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader'
        }, {
          loader: 'sass-loader'
        }]
      })

    }, {

      test: /\.html$/,
      use: [{
        loader: 'html-loader'
      }]

    }]

  },

  plugins: [

    new CleanWebpackPlugin([
      root('bin/client')
    ], {
      root: root()
    }),

    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      root('src/client')
    ),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),

    new HtmlWebpackPlugin({
      template: root('src/client/index.html')
    })
  ]

};