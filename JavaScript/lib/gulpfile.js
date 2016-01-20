var gulp = require('gulp'),
	gutil = require('gulp-util'),
	concat = require('gulp-concat'),
	babel = require('gulp-babel'); // http://babeljs.io/docs/usage/polyfill/

// Links // Modules

// own script ->
var Classes_Prototype = [
		// Base Classes - Prototype
		'../js/Classes/Prototype/**/*.js'
			];
var Classes_Domain = [
		// All Helpers
		'../js/Classes/Helper/**/*.js'
			];

// concat output
gulp.task('js_live', function () {
	gulp.src(Classes_Prototype.concat(Classes_Domain)).pipe(babel()).pipe(concat('phaser-p2HelperUpdated.js')).pipe(gulp.dest('../'));
});

// tasks to call
gulp.task('output', ['js_live']);