var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var paths = require('../paths');
var app = require(paths.config);

var htmlTasks = [ 'html-dev', browserSync.reload ];
var templateTasks = [ 'templates', 'js-dev', browserSync.reload ];
var jsTasks = [ 'js-dev', browserSync.reload ];
var cssTasks = [ 'css-dev' ];
var lambdaTasks = [ 'upload-config' ];

gulp.task('watch', ['local']);

gulp.task('local', function() {
  gulp.start(['html-dev', 'templates', 'css-dev', 'js-dev']);

  browserSync.init({
    open: false,
    server: {
      baseDir: paths.outputDev
    }
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
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest(paths.outputDev))
    .pipe(browserSync.stream());
});