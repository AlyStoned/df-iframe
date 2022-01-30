const path  = require('path');
const { merge } = require('webpack-merge');
const pixrem = require('pixrem');
const urlParse = require('url-parse');
const postcssUrl = require('postcss-url');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const wp_common = require('./webpack.common.js');
const config = require('./config');


module.exports = [
    merge(wp_common, {
        mode: 'development',
        output: {
            path: path.resolve(`${config.DIST_DIR}`),
            publicPath: `${config.DIST_URL}`,
            filename: '[name]-[hash].bundle.min.js',
            chunkFilename: '[name]-[hash].chunk.min.js'
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [{
                        loader: MiniCssExtractPlugin.loader
                    }, {
                        loader: 'fast-css-loader'
                    }]
                },
                {
                    test: /\.scss$/,
                    use: [{
                        loader: MiniCssExtractPlugin.loader,
                    }, {
                        loader: 'fast-css-loader'
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                pixrem(),
                                postcssUrl({
                                    url: function(asset, dir) {
                                        const parsed = urlParse(asset.url);
                                        if (parsed.pathname && parsed.pathname[0] == '/' && !parsed.slashes) {
                                            return config.DIST_URL + asset.url.slice(1);
                                        }
                                        return asset.url;
                                    }
                                })
                            ],
                            sourceMap: true
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions :{
                                includePaths: [
                                    path.resolve(`${config.SOURCE_DIR}/css/`)
                                ]
                            }
                        }
                    }]
                },
                {
                    enforce: 'pre',
                    test: /\.(js|jsx)$/,
                    include: `${config.SOURCE_DIR}/js/`,
                    loader: 'eslint-loader',
                    options: {
                        cache: 'cache'
                    },
                },
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: `[name]-[chunkhash].min.css`,
                chunkFilename: '[name]-[chunkhash].chunk.min.css',
            })
        ],
        optimization: {

        },
        devServer: {
            open: true,
            contentBase: './dist',
            hot: true,
            historyApiFallback: true,
            host: '127.0.0.1',
            // host: '0.0.0.0',
            port: 3001,
            // useLocalIp: true,
            // allowedHosts: [
            //     '192.168.0.102'
            // ]
        }
    })
];
