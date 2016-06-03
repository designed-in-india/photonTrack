var $ = require('gulp');
$.htmlmin = require('gulp-htmlmin');
$.del = require('del');
$.useref = require('gulp-useref');
$.uglify = require('gulp-uglify');
$.htmlmin = require('gulp-htmlmin');
$.if = require('gulp-if');
$.bump = require('gulp-bump');
$.runSeq = require('run-sequence');
$.removeCode = require('gulp-remove-code');
$.zip = require('gulp-zip');

var callback = function(){
	console.log('ALL DONE BOSS');
}

var clean = function(cb){
	return $.del(['dist','prod.zip','prod'], cb);
};

var htmlAndJs = function(){
	return $.src('app/popup.html')
		.pipe($.useref())
		.pipe($.if('*.js', $.removeCode({ production: true })))
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))
		.pipe($.dest('dist/app'))
};

var copy = function(){
	return $.src([
		'manifest.json',
		'app/images/prod_*.png',
		'app/themes/*.*',
		'app/js/injector.js'
		],{base:'.'})
		.pipe($.dest('dist'))
};

var bump = function(){
	return $.src('manifest.json')
		.pipe($.bump())
		.pipe($.dest('.'))
		.pipe($.removeCode({ production: true }))
		.pipe($.dest('dist'))
};

var zip = function(){
	return $.src(['dist/*', 'dist/**/**/*'])
		.pipe($.zip('prod.zip'))
		.pipe($.dest('.'))
};

var defaultTask = function(callback){
	return $.runSeq('clean',['hjs', 'copy', 'bump'], 'zip', callback);
};

//hjs = html and js
$.task('clean', clean);
$.task('hjs', htmlAndJs);
$.task('copy', copy);
$.task('bump', bump);
$.task('zip', zip);
$.task('prod', defaultTask(callback));

