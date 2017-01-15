var gulp = require('gulp');
var insert = require('gulp-insert');
var rename = require('gulp-rename');
var replace = require('gulp-replace');

var paths = require('../paths');
var quickbaseConfig = require(paths.quickbase);
var appConfig = require(paths.app);

gulp.task('html-dev', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.outputDev));
});

gulp.task('html-prod', function() {
	var pageUrl = 'https://' + quickbaseConfig.realm + '.quickbase.com/db/' + quickbaseConfig.databaseId + '?a=dbpage&pagename=' + appConfig.name + '-bundle';

  return gulp.src(paths.html)
  	.pipe(replace(/bundle\.js/, pageUrl + '.js'))
    .pipe(replace(/bundle\.css/, pageUrl + '.css'))
    .pipe(rename(function (path) {
      path.basename = appConfig.name + "-" + path.basename;
      path.dirname = "";
    }))
    .pipe(insert.prepend('<!-- ' + appConfig.origin + ' -->\n'))
    .pipe(gulp.dest(paths.outputProd));
});