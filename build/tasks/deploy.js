var gulp = require('gulp');
var foreach = require('gulp-foreach');
var request = require('request');
var path = require('path');
var del = require('del');

var paths = require('../paths');
var quickbaseConfig = require(paths.app).baseConfig;
var QuickbaseApi = require('../lib/api-client');

gulp.task('deploy', ['clean-prod', 'upload-to-quickbase']);

gulp.task('clean-prod', function() {
  return del.sync(paths.outputProd);
});

gulp.task('upload-to-quickbase', ['html-prod', 'css-prod', 'js-prod'], function() {
  var password = quickbaseConfig.password || process.env.GULPPASSWORD;
  quickbaseConfig.password = password;

  var quickbaseClient = new QuickbaseApi(quickbaseConfig);

  return gulp.src(paths.outputProd + '/*.{html,css,js}')
    .pipe(foreach(function(stream, file){
      var filename = path.basename(file.path);
      var contents = file.contents.toString();

      quickbaseClient.uploadPage(filename, contents)
        .then(res => console.log("\t   File uploaded:", filename))
        .catch(err => console.error(`\t   Error uploading ${filename}:\n${err}`))

      return stream;
    }));
});