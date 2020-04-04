module.exports = function (config) {
  const configuration = {
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    frameworks: ['jasmine', 'karma-typescript'],

    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-spec-reporter'),
      require('karma-typescript'),
    ],

    files: [
      './index.ts',
      './public_api.ts',
      './base.spec.ts',
      './src/**/*.ts',
      './validation/**/*.ts',
    ],

    exclude: [
    ],

    preprocessors: {
      './index.ts': ['karma-typescript'],
      './public_api.ts': ['karma-typescript'],
      './base.spec.ts': ['karma-typescript'],
      './src/**/*.ts': ['karma-typescript'],
      './validation/src/**/*.ts': ['karma-typescript'],
    },

    karmaTypescriptConfig: {
      bundlerOptions: {
        entrypoints: /\.spec\.(ts|tsx)$/,
        resolve: {
          extensions: ['.js', '.json', '.ts'],
          directories: ['node_modules', '.']
        },
        transforms: [require('karma-typescript-es6-transform')()],
        validateSyntax: true,
      },
      tsconfig: './tsconfig.spec.json',
      reports:
      {
        lcovonly: {
          directory: 'coverage',
          filename: 'lcov.info',
          subdirectory: 'lcov'
        },
        html: 'coverage',
        'text-summary': ''
      }
    },

    reporters: ['progress', 'karma-typescript'],

    specReporter: {
      maxLogLines: 10,
      suppressErrorSummary: true,
      suppressFailed: false,
      suppressPassed: true,
      suppressSkipped: true,
      showSpecTiming: false,
      failFast: false,
    },

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,
  };

  config.set(configuration);
};

