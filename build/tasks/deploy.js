var app = require('../../app');
var gulp = require('gulp');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var insert = require('gulp-insert');

var deployTasks = [
  'js-prod',
  'css-prod',
  'html-prod',
  'upload-assets',
  'upload-html',
  'upload-config'
];

gulp.task('deploy', function() {
  gulp.start.apply(this, deployTasks);
});

//git init repo
gulp.task('init', function(){
  gulp.start(['update-readme']);
});

gulp.task('update-readme', function(){
  gulp.src(['README.md'])
    .pipe(replace(/.*\n?/g, ''))
    .pipe(insert.append("# " + app.name + "\n"))
    .pipe(insert.append("#### Description: " + app.description + "\n"))
    .pipe(insert.append("#### Client: " + app.client + "\n"))
    .pipe(insert.append("#### Authors: " + app.authors))
    .pipe(gulp.dest('.'));
});