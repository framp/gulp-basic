var fs = require('fs');

var gulpif = require('gulp-if');
var debug = require('gulp-debug');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var cache = require('gulp-cached');
var please = require('gulp-pleeease');
var remember = require('gulp-remember');
var connect = require('gulp-connect');
var vinylPaths = require('vinyl-paths');

module.exports = function(gulp, $){
  gulp.task('process-stylesheets', function() {
    return gulp.src('stylesheets/**/index.scss')
      .pipe(gulpif($.debug, debug({title: 'stylesheets', verbose: true})))      
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest($.dest + '/stylesheets'))
      .pipe(rename({
        suffix: '.v' + $.version + '.min'
      }))
      .pipe(cache('stylesheets-please'))
      .pipe(please())
      .pipe(remember('stylesheets-please'))
      .pipe(gulp.dest($.dest + '/stylesheets/'))
      .pipe(connect.reload());
  });
  gulp.task('clean-stylesheets', function() {
    return gulp.src('stylesheets/**/index.scss', {read: false})
      .pipe(gulpif($.debug, debug({title: 'stylesheets', verbose: true})))      
      .pipe(rename({
        extname: ".css"
      }))
      .pipe(gulp.dest($.dest + '/stylesheets'))
      .pipe(vinylPaths(fs.unlink))
      .pipe(rename({
        suffix: '.v' + $.version + '.min',
      }))
      .pipe(vinylPaths(fs.unlink));
  });
};