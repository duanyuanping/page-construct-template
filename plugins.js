const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');

// 通用plugin配置
const commonPlugins = [
    new HtmlWebpackPlugin({
        template: path.join(__dirname, './index.html'),
        filename: `index.html`,
        // chunks: [pageName],
        // assetsPrefix: `${assetsPrefix}/`,
        inject: 'false'
    }),

    new HtmlWebpackExternalsPlugin({
        externals: [
            {
                module: 'react',
                entry: 'https://11.url.cn/now/lib/16.8.6/react.min.js?_bid=3123',
                global: 'React'
            }, {
                module: 'react-dom',
                entry: 'https://11.url.cn/now/lib/16.8.6/react-dom.min.js?_bid=3123',
                global: 'ReactDOM'
            }
        ]
    })
];

// 开发环境plugin配置
const devPlugins = [...commonPlugins];

// 生产环境plugin配置
const proPlugins = [
    ...commonPlugins,
    new UglifyJsPlugin({
        exclude: /node_modules/,
        cache: true,
        parallel: true
    }),

    new HappyPack({
        id: 'html',
        loaders: [{
            loader: 'html-loader'
        }]
    }),

    new HappyPack({
        id: 'babel',
        threads: 4,
        loaders: [{
            loader: 'babel-loader',
            options: {
                configFile: path.join(process.cwd(), './.babelrc'),
                cacheDirectory: true
            }
        }]
    }),

    new HappyPack({
        id: 'css-pack',
        threads: 4,
        loaders: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    config: {
                        path: path.join(__dirname, './postcss.config.js')
                    }
                }
            },
            'less-loader'
        ]
    })
];

module.exports = {
    commonPlugins,
    devPlugins,
    proPlugins
}