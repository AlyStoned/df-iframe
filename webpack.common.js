const path  = require('path');
const webpack  = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');


const config = require('./config');

module.exports = {
    entry: {
        app: path.resolve(config.SOURCE_DIR, 'js/app.js'),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: 'cache'
                        }
                    }
                ]
            },
            {
                test: /\.(woff2?|ttf)$/i,
                loader: 'file-loader',
                options: {
                    outputPath: function(url, resourcePath, context) {
                        const basename = path.basename(resourcePath);
                        const dirname = path.basename(path.dirname(resourcePath));
                        return path.join('fonts', dirname, basename);
                    },
                    esModule: false
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]',
                }
            }
        ]
    },
    resolve: {
        modules: [config.SOURCE_DIR, "node_modules"],
        alias: {
            'lodash-es': 'lodash',
        }
    },
    plugins: [
        new webpack.ProgressPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: false
        }),
        // new HtmlWebpackPlugin({
        //     filename: 'bets.html',
        //     template: './src/bets.html',
        //     minify: false
        // }),
        new FaviconsWebpackPlugin({
            logo: path.resolve(config.SOURCE_DIR, 'img/favicon.svg'),
            favicons: {
                manifestRelativePaths: true,
            }
        }),
        // new BundleTracker({
        //     filename: path.relative('.', config.js.client_manifest)
        // }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
};
