const path = require('path');
const webpack = require('webpack')
const config = require('./config')
const debug = require('debug')('app:config')
const fs = require('fs-extra')
var HtmlWebpackPlugin = require('html-webpack-plugin');

debug('Copying static assets to dist folder.')
fs.copySync(config.dir_static, config.dir_dist)

module.exports = {
    entry: {
        app: config.dir_client + '/main.js',      
        vendor: config.compiler_vendors
    },
    output: {
        path: path.resolve(config.dir_dist),
        filename: '[name].bundle.js',
        publicPath : config.compiler_public_path
    },
    resolve: {
        extensions: ['.js']
    },
    plugins: [
        // new webpack.NoEmitOnErrorsPlugin()    
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new HtmlWebpackPlugin({
            template : config.dir_client + '/index.html',
            hash     : false,
            favicon  : config.dir_static + '/favicon.ico',
            filename : 'index.html',
            inject   : 'body',
            minify   : {
                collapseWhitespace : true
            }
        })
    ], 
    module: {
        rules: [   
            {
                test    : /\.(js|jsx)$/,
                exclude : /node_modules/,
                loader  : 'babel-loader',
                query   : config.compiler_babel
            }, {
                test   : /\.json$/,
                loader : 'json-loader'
                },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            minimize: true || {/* CSSNano Options */}
                        }
                    }                    
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                'file-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000
                }
            }
        ]      
    }
}
