// Karma configuration
// Generated on Tue Mar 06 2018 16:25:55 GMT+0900 (JST)

var webpackConfig = require('./webpack.config.js');

module.exports = function (config) {
    config.set({
        // いる？
        basePath: '',
        browsers: ['ChromeHeadless'],
        frameworks: [
            'mocha',
            'chai',
        ],
        files: ['src/**/*_test.ts'],
        // いる？
        webpack: {
            devtool: 'eval-source-map',
            // debug: true,
            module: webpackConfig.module,
            resolve: webpackConfig.resolve
        },
        // いる？
        webpackMiddleware: {
            quiet: true,
            stats: {
                colors: true
            }
        },
        // 何これ、すごい冗長じゃね。。。
        plugins: [
            'karma-webpack',
            'karma-mocha',
            'karma-chai',
            'karma-chrome-launcher',
            'karma-notify-reporter',
        ],
        preprocessors: {
            'src/**/*_test.ts': ['webpack']
        },
        logLevel: config.LOG_INFO,
        autoWatch: true,
        reporters: [
            'progress',
            'notify',
        ],
        port: 9876,
        colors: true,
        singleRun: false,
        concurrency: Infinity,
        mime: {
            'text/x-typescript': ['ts', 'tsx']
        },
    })
}