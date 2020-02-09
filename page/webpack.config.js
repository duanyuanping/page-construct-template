const path = require('path');
const fs = require('fs');
const glob = require('glob');
const { devPlugins, proPlugins } = require('./plugins');

const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const outputPath = path.resolve(__dirname, isProduction ? 'pro' : 'dev');
const plugins = isProduction ? proPlugins : devPlugins;

const entryConfig = {
    main: path.resolve(__dirname, 'main.js'),
};

module.exports = {
    mode: env,
    entry: entryConfig,
    output: {
        filename: '[name].js',
        path: outputPath,
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dev'),
        setup(app) {
            app.post('*', (req, res) => {
                res.redirect(req.originalUrl);
            });
        }
    },
    plugins,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        configFile: path.join(__dirname, './.babelrc'),
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /\.(css|less)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    {
                        loader:'px2rem-loader',
                        options: {
                            remUnit: 75,
                            remPrecision: 8
                        }
                    },
                    'postcss-loader',
                    'less-loader',
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                loader: 'url-loader',
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'file-loader'
            },
            {
                test: /[\/\\]data[\/\\][^\/\\]+\.(json)(\?.*)?$/,
                type: 'javascript/auto',
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                        },
                    },
                ]
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            }
        ]
    }
};
