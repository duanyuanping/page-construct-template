const path = require('path');
const minimist = require('minimist');
const TerserPlugin = require('terser-webpack-plugin');
const { devPlugins, proPlugins } = require('./plugins');

const env = process.env.NODE_ENV;
const isProduction = env === 'production';
const buildName = isProduction ? minimist(process.argv.slice(2)).e : 'dev';
const outputPath = path.resolve(__dirname, buildName);
const plugins = isProduction ? proPlugins : devPlugins;
const optimization = isProduction && buildName === 'pro' ? {
    minimizer: [
      new TerserPlugin({
        exclude: /node_modules/,
      }),
    ],
} : {}

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
    stats: isProduction && buildName === 'pro' ? 'errors-warnings' : 'normal',
    optimization,
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
                exclude: /node_modules/,
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