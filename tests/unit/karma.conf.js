module.exports = function(config) {
	"use strict";

  config.set({
	autoWatch: false,
	basePath: '../../',
	frameworks: ['jasmine'],
	browsers: ['PhantomJS'],
	exclude:[],
	junitReporter: {
		outputFile: 'output/tests/unit.xml',
		suite: 'unit'
	},
	plugins: [
		'karma-chrome-launcher',
		'karma-coverage',
		'karma-jasmine',
		'karma-junit-reporter',
		'karma-firefox-launcher',
		'karma-phantomjs-launcher',
		'karma-script-launcher'
	],
	reporters: ['progress', 'junit', 'coverage']
  });
};