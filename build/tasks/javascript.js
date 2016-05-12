var app = require('../../app');
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var insert = require('gulp-insert');
var replace = require('gulp-replace');
var inject = require('gulp-inject-string');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var paths = require('../paths');

gulp.task('js-dev', ['templates'], function(){
  return browserify(app.bootstrap, {debug: true})
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(paths.outputDev));
});

gulp.task('js-prod', ['templates'], function(){
  return browserify(app.bootstrap, {debug: true})
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .pipe(source(app.name + '-bundle.js'))
    .pipe(gulp.dest(paths.outputProd));
});

