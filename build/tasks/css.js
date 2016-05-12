var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var insert = require('gulp-insert');
var paths = require('../paths');
var app = require(paths.config);

gulp.task('css-prod', function() {
  return gulp.src(paths.css)
    .pipe(sass())
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(concat(app.name + '-bundle.css'))
    .pipe(insert.prepend('/*' + app.origin + '*/\n'))
    .pipe(gulp.dest(paths.outputProd));
});