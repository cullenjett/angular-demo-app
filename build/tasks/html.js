var gulp = require('gulp');
var insert = require('gulp-insert');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var templateCache = require('gulp-angular-templatecache');

var paths = require('../paths');
var app = require(paths.app);

gulp.task('html-dev', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(paths.outputDev));
});

gulp.task('html-prod', ['js-prod', 'css-prod'], function() {
	var pageUrl = 'https://'+app.baseConfig.realm+'.quickbase.com/db/'+app.baseConfig.databaseId+'?a=dbpage&pagename='+app.name+'-bundle.'

  return gulp.src(paths.html)
  	.pipe(replace(/bundle\.js/, pageUrl + 'js'))
    .pipe(replace(/bundle\.css/, pageUrl + 'css'))
    .pipe(rename(function (path) {
      path.basename = app.name + "-" + path.basename;
      path.dirname = "";
    }))
    .pipe(insert.prepend('<!-- '+app.origin+' -->\n'))
    .pipe(gulp.dest(paths.outputProd));
});

gulp.task('templates', function() {
  return gulp.src(paths.templates)
    .pipe(templateCache("templates.js", {
      module: "templates",
      standalone: true
    }))
    .pipe(gulp.dest('tmp/'));
});