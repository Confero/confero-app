module.exports = function(config) {
	"use strict";

  config.set({
	autoWatch: false,
	basePath: '../../',
	frameworks: ['jasmine'],
	browsers: ['PhantomJS'],
	exclude:[],
	files : [
		'www/lib/angular/angular.js',
		'www/lib/angular-ui-route/angular-route.js',
		'www/lib/angular-resource/angular-resource.js',
		'bower_components/angular-mocks/angular-mocks.js',
		'www/js/**/*.js',
		'test/unit/**/*.js'
    ],
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