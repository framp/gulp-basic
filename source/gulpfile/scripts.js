var fs = require('fs');

var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var cache = require('gulp-cached');
var uglify = require('gulp-uglify');
var remember = require('gulp-remember');
var connect = require('gulp-connect');
var vinylPaths = require('vinyl-paths');

module.exports = function(gulp, $){
  gulp.task('process-scripts', function() {
    return gulp.src('scripts/**/index.js')
      .pipe(browserify({
        transform: ['debowerify'],
        debug: true
      }))
      .pipe(gulp.dest($.dest + '/scripts'))
      .pipe(rename({
        suffix: '.v' + $.version + '.min'
      }))
      .pipe(cache('scripts-uglify'))
      .pipe(uglify())
      .pipe(remember('scripts-uglify'))
      .pipe(gulp.dest($.dest + '/scripts/'))
      .pipe(connect.reload());
  });
  gulp.task('clean-scripts', function() {
    return gulp.src('scripts/**/index.js', {read: false})
      .pipe(gulp.dest($.dest + '/scripts'))
      .pipe(vinylPaths(fs.unlink))
      .pipe(rename({
        suffix: '.v' + $.version + '.min'
      }))
      .pipe(vinylPaths(fs.unlink));
  });
};
