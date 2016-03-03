'use strict';
var gulp = require('gulp');
var gulpSequence = require('gulp-sequence').use(gulp);
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins({
	pattern: ['gulp-*', 'gulp.*', 'merge-*'], // the glob(s) to search for
	scope: ['dependencies', 'devDependencies', 'peerDependencies'], // which keys in the config to look within
	replaceString: /^gulp(-|\.)/, // what to remove from the name of the module when adding it to the context
	camelize: true, // if true, transforms hyphenated plugins names to camel case
	lazy: true // whether the plugins should be lazy loaded on demand
});
var del = require('del');
var fs = require('fs');

gulp.task('default', function() {
	var angularDob = gulp.src([
			'src/module.js',
			'src/common.js',
			'src/format.js',
			'src/validate.js'
		])
		.pipe($.concat('angular-dob.js'))
		.pipe($.stripDebug())
		.pipe(gulp.dest('lib/'));

	var angularDobMin = gulp.src([
			'src/module.js',
			'src/common.js',
			'src/format.js',
			'src/validate.js'
		])
		.pipe($.concat('angular-dob.min.js'))
		.pipe($.uglify())
		.pipe($.stripDebug())
		.pipe(gulp.dest('lib/'));

	return $.mergeStream(angularDob, angularDobMin);
});