const path  = require('path');
const { merge } = require('webpack-merge');
const pixrem = require('pixrem');
const urlParse = require('url-parse');
const postcssUrl = require('postcss-url');
const autoprefixer = require('autoprefixer');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const wp_common = require('./webpack.common.js');
const config = require('./config');


module.exports = [
    merge(wp_common, {
        devtool: 'source-map',
        mode: 'production',
        output: {
            path: path.resolve(`${config.DIST_DIR}`),
            publicPath: `${config.DIST_URL}`,
            filename: '[name]-[chunkhash].bundle.min.js',
            chunkFilename: '[name]-[chunkhash].chunk.min.js'
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [{
                        loader: MiniCssExtractPlugin.loader,
                    }, {
                        loader: 'fast-css-loader'
                    }]
                },
                {
                    test: /\.scss$/,
                    use: [{
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'fast-css-loader',
                        options: {
                            importLoaders: 1,
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                pixrem(),
                                autoprefixer(),
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
                    },
                    {
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
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: `[name].min.css`,
                chunkFilename: '[name].chunk.min.css',
            }),
            new CleanWebpackPlugin(),
            ...(config.bundleAnalyzerReport ? [new BundleAnalyzerPlugin()] : [])
        ],
        optimization: {
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    cache: 'cache',
                    sourceMap: true,
                    extractComments: true,
                }),
                new OptimizeCSSAssetsPlugin({

                })
            ]
        }
    })
];
