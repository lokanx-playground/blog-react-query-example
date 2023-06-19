const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { LicenseWebpackPlugin } = require('license-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin2');
const { ProvidePlugin } = require('webpack');

const ACCEPTABLE_LICENSE_TYPES = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'BSD-2-Clause', 'ISC', '(MIT AND BSD-3-Clause)'];

module.exports = function (webpackEnv) {
   const isEnvDevelopment = webpackEnv === 'development' || process?.env?.NODE_ENV === 'development';
   const isEnvProduction = webpackEnv === 'production' || process?.env?.NODE_ENV === 'production';
   const targetEnvironment = process?.env?.TARGET || 'production';

   return {
      entry: {
         main: './src/index.tsx',
      },
      output: {
         path: path.join(__dirname, 'build'),
         filename: '[name].bundle.js',
         publicPath: '/',
      },
      mode: process.env.NODE_ENV || 'development',

      resolve: {
         alias: {
            'app-configuration-data$': path.resolve(
               __dirname,
               `src/config/app-configuration-data.${targetEnvironment}.js`,
            ),
         },
         extensions: ['.tsx', '.ts', '.js', '.json'],
      },
      optimization: {
         splitChunks: {
            chunks: 'all',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
               defaultVendors: {
                  test: /[\\/]node_modules[\\/]/,
                  priority: -10,
                  reuseExistingChunk: true,
               },
               default: {
                  minChunks: 2,
                  priority: -20,
                  reuseExistingChunk: true,
               },
            },
         },
         minimize: isEnvProduction,
         minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
      },
      devServer: {
         static: {
            directory: path.join(__dirname, 'public'),
         },
         compress: true,
         port: 3000,
         historyApiFallback: true,
      },
      devtool: 'source-map',
      module: {
         rules: [
            {
               test: /\.(js|jsx)$/,
               exclude: /node_modules/,
               use: ['babel-loader'],
            },
            {
               test: /\.(ts|tsx)$/,
               exclude: /node_modules/,
               use: ['ts-loader'],
            },
            {
               test: /\.(css)$/,
               use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
               test: /\.s[ac]ss$/i,
               use: [
                  // Creates `style` nodes from JS strings
                  'style-loader',
                  // Translates CSS into CommonJS
                  'css-loader',
                  // Compiles Sass to CSS
                  'sass-loader',
               ],
            },
            {
               test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
               use: ['file-loader'],
            },
         ],
      },
      plugins: [
         new ProvidePlugin({
            process: 'process/browser.js',
            Buffer: ['buffer', 'Buffer'],
         }),
         new HtmlWebpackPlugin(
            Object.assign(
               {},
               {
                  template: path.join(__dirname, 'src', 'index.html'),
               },
               isEnvProduction
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
                  : undefined,
            ),
         ),
         new VanillaExtractPlugin(),
         new MiniCssExtractPlugin(),
         new LicenseWebpackPlugin({
            licenseTextOverrides: {
               'react-select': 'MIT',
               '@heroicons/react': 'MIT',
            },
            handleMissingLicenseText: (packageName, licenseType) => {
               console.error('Cannot find license for packageName:', packageName, `(${licenseType})`);
               process.exit(-1);
            },
            unacceptableLicenseTest: (licenseType) => !ACCEPTABLE_LICENSE_TYPES.includes(licenseType),
            handleUnacceptableLicense: (packageName, licenseType) => {
               console.error('Unacceptable license found: packageName=', packageName, ', licenseType=', licenseType);
               process.exit(-1);
            },
            stats: {
               warnings: true,
               errors: true,
            },
         }),
         new Visualizer(),
      ],
   };
};
