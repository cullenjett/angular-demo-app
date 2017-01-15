var gulp = require('gulp');
var del = require('del');
var fs = require('fs');

var browserSync = require('../lib/browser-sync');
var paths = require('../paths');
var QuickbaseApi = require('../lib/api-client');

gulp.task('local', ['watch']);
gulp.task('watch', ['clean-dev', 'upload-config', 'html-dev', 'css-dev', 'js-dev'], function () {
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
  gulp.watch('config/quickbase.config.js', ['upload-config']);
});

gulp.task('clean-dev', function() {
  return del.sync(paths.outputDev);
});

gulp.task('upload-config', function() {
  // We have to delete the cached version of the config and read it at runtime.
  delete require.cache[require.resolve(paths.quickbase)];
  var quickbaseConfig = require(paths.quickbase);

  var configCopy = JSON.parse(JSON.stringify(quickbaseConfig))
  configCopy.password = configCopy.password || process.env.GULPPASSWORD;

  var quickbaseClient = new QuickbaseApi(configCopy);

  quickbaseClient.uploadVariable(JSON.stringify(quickbaseConfig))
    .then(res => console.log(`\t   Config variable uploaded`))
    .catch(err => console.error(`\t   Error uploading config variable:\n${err}`));

  this.emit('end');
});