var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var notify = require('gulp-notify');

var paths = require('../paths');
var app = require(paths.app);

var htmlTasks = [ 'html-dev', browserSync.reload ];
var templateTasks = [ 'templates', 'js-dev', 'html-dev', browserSync.reload ];
var jsTasks = [ 'js-dev', browserSync.reload ];
var cssTasks = [ 'css-dev' ];
var lambdaTasks = [ 'upload-config' ];

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

gulp.task('watch', ['local']);

gulp.task('local', ['html-dev', 'templates', 'css-dev', 'js-dev'], function() {
  browserSync.init({
    open: true,
    notify: false,
    server: paths.outputDev
  });

  gulp.watch(paths.html, htmlTasks);
  gulp.watch(paths.templates, templateTasks);
  gulp.watch(paths.javascript, jsTasks);
  gulp.watch(paths.css, cssTasks);
  gulp.watch(paths.config, lambdaTasks);
});

gulp.task('css-dev', function() {
  return gulp.src(paths.css)
    .pipe(sass())
    .on('error', interceptErrors)
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(paths.outputDev))
    .pipe(browserSync.stream());
});