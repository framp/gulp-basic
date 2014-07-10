var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var dust = require('dustjs-linkedin');
dust.helpers = require('dustjs-helpers').helpers;
require('dustjs-helper-repeat');
var dusthtml = require('gulp-dust-html');
var watch = require('gulp-watch');
var open = require('gulp-open');
var connect = require('gulp-connect');
var fs = require('fs');


var dest = 'public';
var data = require('./data.json');

gulp.task('process-css', function() {
  return gulp.src('css/**/*.scss')
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(gulp.dest(dest + '/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(dest + '/css/'))
    .pipe(connect.reload());
});

gulp.task('process-js', function() {
  return gulp.src('js/**/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest(dest + '/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(dest + '/js/'))
    .pipe(connect.reload());
});

gulp.task('process-img', function () {
  return gulp.src('img/**/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngcrush()]
    }))
    .pipe(gulp.dest(dest + '/img/'));
});

gulp.task('process-html', function () {
  return gulp.src('templates/**/index.dust')
    .pipe(dusthtml({
      basePath: 'templates',
      data: data
    }))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server({
    root: dest,
    livereload: true
  });
});

gulp.task('data', function() {
  fs.readFile('./data.json', function(err, doc){
    data = JSON.parse(doc);
  });
});

gulp.task('open', function(){
  gulp.src('gulpfile.js')
  .pipe(open("",{
    url: 'http://localhost:8080'
  }));
});

gulp.task('watch', function () {
  gulp.watch('js/**/*.js', ['process-js']);
  gulp.watch('css/**/*.scss', ['process-css']);
  gulp.watch('img/**/*', ['process-image']);
  gulp.watch('templates/**/*.dust', ['process-html']);
  gulp.watch('data.json', ['data', 'process-html']);
});

gulp.task('default', ['connect', 'open', 'watch']);
