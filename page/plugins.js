const path = require('path');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HappyPack = require('happypack');

// 通用plugin配置
const commonPlugins = [
    new HtmlWebpackPlugin({
        template: path.join(__dirname, './index.html'),
        filename: `index.html`,
        minify: {
            removeComments: true,
            collapseWhitespace: true
        },
        inlineSource: '.(js|css)$',
        // chunks: [pageName],
        // assetsPrefix: `${assetsPrefix}/`,
    }),
    new HtmlWebpackInlineSourcePlugin()
];

// 开发环境plugin配置
const devPlugins = [
    ...commonPlugins
];

// 生产环境plugin配置
const proPlugins = [
    ...commonPlugins,
    // new UglifyJsPlugin({
    //     exclude: /node_modules/,
    //     cache: true,
    //     parallel: true
    // }),

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