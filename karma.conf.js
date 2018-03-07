// Karma configuration
// Generated on Tue Mar 06 2018 16:25:55 GMT+0900 (JST)

module.exports = function (config) {
    config.set({
        // いる？
        basePath: '',
        browsers: ['ChromeHeadless'],
        frameworks: [ 'mocha', 'chai' ],
        files: [ 'src/**/*_test.js' ],
        // いる？
        webpack: {
            devtool: 'eval-source-map',
            debug: true,
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
        plugins: [
            'karma-webpack',
            'karma-mocha',
            'karma-chrome-launcher'
        ],
        preprocessors: {
            'src/**/*_test.js': ['webpack']
        },
        logLevel: config.LOG_INFO,
        autoWatch: true,
        reporters: ['progress'],
        port: 9876,
        colors: true,
        singleRun: false,
        concurrency: Infinity
    })
}
