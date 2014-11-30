var fs = require('fs');

var cache = require('gulp-cached');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var remember = require('gulp-remember');
var rename = require('gulp-rename');
var connect = require('gulp-connect');
var vinylPaths = require('vinyl-paths');

module.exports = function(gulp, $){
  gulp.task('process-images', function() {
    return gulp.src('images/**/*')
      .pipe(cache('images'))
      .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{
          removeViewBox: false
        }],
        use: [pngcrush()]
      }))
      .pipe(remember('images'))
      .pipe(rename({
        suffix: '.v' + $.version + '.min'
      }))
      .pipe(gulp.dest($.dest + '/images/'))
      .pipe(connect.reload());
  });
  gulp.task('clean-images', function() {
    return gulp.src('images/**/*', {read: false})
      .pipe(rename({
        suffix: '.v' + $.version + '.min'
      }))
      .pipe(gulp.dest($.dest + '/images/'))
      .pipe(vinylPaths(fs.unlink));
  });
};
