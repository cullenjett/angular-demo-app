var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var cleanCss = require('gulp-clean-css');

var browserSync = require('../lib/browser-sync');
var interceptErrors = require('../lib/intercept-errors');
var paths = require('../paths');
var appConfig = require(paths.app);

gulp.task('css-dev', function() {
  return gulp.src(paths.css)
    .pipe(sass())
    .on('error', interceptErrors)
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(concat('bundle.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest(paths.outputDev))
    .pipe(browserSync.stream({match: '**/*.{css,scss,sass}'}));
});

gulp.task('css-prod', function() {
  return gulp.src(paths.css)
    .pipe(sass())
    .on('error', interceptErrors)
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(concat(appConfig.name + '-bundle.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest(paths.outputProd));
});