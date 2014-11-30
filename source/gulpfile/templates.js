var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var async = require('async');
var topl = require('topl');
var Handlebars = require('handlebars');
require('handlebars-layouts')(Handlebars);
require('handlebars-tr')(Handlebars);

var data = require('gulp-data');
var handlebars = require('gulp-handlebars-html')();
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var vinylPaths = require('vinyl-paths');

module.exports = function(gulp, $){ 
  var languages = fs.readdirSync('./contents');
  var defaultLanguage = languages[0];
  languages.forEach(function(language, key){
    if (language[0]==='_')
      defaultLanguage = language;
  });
  
  gulp.task('process-templates', function(cb) {
    var options = {
      partialsDirectory: ['./templates/partials', './templates/layouts']
    };
    var context = {
      __version: $.version,
      __debug: $.environment !== 'production'
    }
    async.map(languages, function(language, done){
      var languageDest = $.dest + (language !== defaultLanguage ? '/' + language : '');
      gulp.src('templates/**/index.hbs')
        .pipe(data(function(file) {
          var name = path.basename(file.path, path.extname(file.path));
          var data = './data/' + name + '.json';
          var result = JSON.parse(fs.readFileSync(data));
          var contentPartials = './contents/' + language + '/partials.toml';
          var content = './contents/' + language + '/' + name + '.toml';
          result.__language = topl.parse(fs.readFileSync(contentPartials));
          _.merge(result.__language, topl.parse(fs.readFileSync(content)));
          return result;
        }))
        .pipe(handlebars(context, options))
        .pipe(rename({
          extname: ".html"
        }))
        .pipe(gulp.dest(languageDest))
        .pipe(connect.reload())
        .on('data', function() {})
        .on('end', done);
    }, cb);
  });
  gulp.task('clean-templates', function(cb) {
    async.map(languages, function(language, done){
      var languageDest = $.dest + (language !== defaultLanguage ? '/' + language : '');
      gulp.src('templates/**/index.hbs', {read: false})
        .pipe(rename({
          extname: ".html"
        }))
        .pipe(gulp.dest(languageDest))
        .pipe(vinylPaths(fs.unlink))
        .on('data', function() {})
        .on('end', done);
    }, cb);
  });
};