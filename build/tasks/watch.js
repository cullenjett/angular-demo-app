var gulp = require('gulp');
var del = require('del');
var fs = require('fs');

var browserSync = require('../lib/browser-sync');
var paths = require('../paths');
var QuickbaseApi = require('../lib/api-client');

gulp.task('local', ['watch']);
gulp.task('watch', ['clean-dev', 'html-dev', 'css-dev', 'js-dev'], function () {
  browserSync.init({
    open: false,
    reloadOnRestart: true,
    server: paths.outputDev,
    notify: false,
    ui: false
  });

  gulp.watch(paths.html, ['html-dev'], browserSync.reload);
  gulp.watch(paths.templates, ['templates'], browserSync.reload);
  gulp.watch(paths.css, ['css-dev']);
});

gulp.task('clean-dev', function() {
  return del.sync(paths.outputDev);
});