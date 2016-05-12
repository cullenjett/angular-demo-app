var gulp = require('gulp');
var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
var XML = require('pixl-xml');
var foreach = require('gulp-foreach');
var path = require('path');
var notify = require('gulp-notify');
var replace = require('gulp-replace');
var paths = require('../paths');
var app = require(paths.config);

// push to QuickBase App
gulp.task('upload-html', ['upload-assets'], function() {
  return gulp.src(paths.outputProd + '/*.html')
    .pipe(foreach(function(stream, file){
      filename = handleXMLChars(path.basename(file.path));
      contents = handleXMLChars(file.contents.toString());

      var data = buildPage(contents, filename);
      sendQBRequest("API_AddReplaceDBPage", data);

      return stream;
    }))

    .pipe(notify({ message: "Deployment successful.", title: "Gulp"} ));
});

// push to QuickBase App
gulp.task('upload-assets', ['js-prod', 'css-prod', 'html-prod'], function() {
  return gulp.src([paths.outputProd + '/*.css', paths.outputProd + '/*.js'])
    .pipe(foreach(function(stream, file){
      filename = handleXMLChars(path.basename(file.path));
      contents = handleXMLChars(file.contents.toString());

      var data = buildPage(contents, filename);
      sendQBRequest("API_AddReplaceDBPage", data);

      return stream;
    }))
});

gulp.task('upload-config', function() {
  return gulp.src(paths.config)
    .pipe(foreach(function(stream, file){
      var config = JSON.parse(file.contents.toString());
      config = JSON.stringify(config["baseConfig"]);
      contents = handleXMLChars(config);

      var data = buildVar(contents);
      sendQBRequest("API_SetDBvar", data);

      return stream;
    }))
});

function buildVar(contents){
  var data = [];
  data.push("<qdbapi>");
  data.push.apply(data, ["<apptoken>", handleXMLChars(app.baseConfig.token), "</apptoken>"]);
  data.push.apply(data, ["<username>", handleXMLChars(app.username), "</username>"]);

  var password = process.env.GULPPASSWORD;
  if(app.password){
    password = app.password;
  }

  data.push.apply(data, ["<password>", handleXMLChars(password), "</password>"]);
  data.push.apply(data, ["<hours>", "1", "</hours>"]);
  data.push.apply(data, ["<varname>", "quickstart_config", "</varname>"]);
  data.push.apply(data, ["<value>", contents, "</value>"]);
  data.push("</qdbapi>");

  return data.join("");
};

function buildPage(body, name){
  var data = [];
  data.push("<qdbapi>");
  data.push.apply(data, ["<apptoken>", handleXMLChars(app.baseConfig.token), "</apptoken>"]);
  data.push.apply(data, ["<username>", handleXMLChars(app.username), "</username>"]);

  var password = process.env.GULPPASSWORD;
  if(app.password){
    password = app.password;
  }

  data.push.apply(data, ["<password>", handleXMLChars(password), "</password>"]);
  data.push.apply(data, ["<hours>", "1", "</hours>"]);
  data.push.apply(data, ["<pagebody>", body, "</pagebody>"]);
  data.push.apply(data, ["<pagetype>", "1", "</pagetype>"]);
  data.push.apply(data, ["<pagename>", name, "</pagename>"]);
  data.push("</qdbapi>");

  return data.join("");
}

function handleXMLChars(string){
  return string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function sendQBRequest(action, data, mainAPICall){
  var req = new XMLHttpRequest();
  var dbid = mainAPICall ? "main" : app.baseConfig.databaseId;

  var url = "https://" + app.baseConfig.realm + ".quickbase.com/db/" + dbid + "?act=" + action;
  req.open("POST", url, true);
  req.setRequestHeader("Content-Type", "text/xml");
  req.send(data);
}