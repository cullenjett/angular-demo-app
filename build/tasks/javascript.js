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
var notify = require('gulp-notify');
var swPrecache = require('sw-precache');

var paths = require('../paths');
var app = require(paths.app);

function interceptErrors(error) {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};

gulp.task('js-dev', ['templates'], function(){
  return browserify(app.bootstrap, {debug: true})
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .on('error', interceptErrors)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(paths.outputDev));
});

gulp.task('js-prod', ['templates'], function(){
  return browserify(app.bootstrap, {debug: true})
    .transform('babelify', {presets: ['es2015']})
    .bundle()
    .on('error', interceptErrors)
    .pipe(source(app.name + '-bundle.js'))
    .pipe(gulp.dest(paths.outputProd));
});

gulp.task('generate-service-worker', function(callback) {
  swPrecache.write('tmp/service-worker.js', {
    staticFileGlobs: ['tmp/**/*'],
    stripPrefix: 'tmp'
  }, callback);
});