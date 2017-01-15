var gulp = require('gulp');
var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var inject = require('gulp-inject-string');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var templateCache = require('gulp-angular-templatecache');
var htmlmin = require('gulp-htmlmin');

var browserSync = require('../lib/browser-sync');
var interceptErrors = require('../lib/intercept-errors');
var paths = require('../paths');
var appConfig = require(paths.app);
var quickbaseConfig = appConfig.baseConfig;

gulp.task('js-dev', ['templates'], function () {
  return bundleJavascript();
});

gulp.task('js-prod', ['templates'], function() {
  return browserify(appConfig.bootstrap)
    .transform(babelify, {presets: ['es2015']})
    .bundle()
    .on('error', interceptErrors)
    .pipe(source(appConfig.name + '-bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest(paths.outputProd));
});

gulp.task('templates', function() {
  return gulp.src(paths.templates)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(templateCache('templates.js', {
      module: 'templates',
      standalone: true
    }))
    .pipe(gulp.dest(paths.outputDev));
});

watchify.args.debug = true;

var bundler = watchify(browserify(appConfig.bootstrap, watchify.args));
bundler.transform(babelify, {presets: ['es2015']});
bundler.on('update', bundleJavascript);

function bundleJavascript() {
  console.log('\t   Compiling JS...');

  var password = quickbaseConfig.password ? quickbaseConfig.password : process.env.GULPPASSWORD;
  var injectedPasswordString = 'password: \"' + password + '\",\n';

  return bundler.bundle()
    .on('error', interceptErrors)
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(inject.before('databaseId:', injectedPasswordString))
    .pipe(gulp.dest(paths.outputDev))
    .pipe(browserSync.stream({once: true}));
}