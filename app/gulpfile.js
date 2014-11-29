//General
var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
//Stylesheets
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
//Scripts
var uglify = require('gulp-uglify');
//Images
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
//Templates
require('handlebars-layouts')(require('handlebars'));
var handlebars = require('gulp-handlebars-html')();
//Utilities
var watch = require('gulp-watch');
var open = require('gulp-open');
var connect = require('gulp-connect');
//Destination
var dest = '..';
//Data
var data = require('./data.json');

gulp.task('process-css', function() {
  return gulp.src('css/**/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest + '/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest + '/css/'))
    .pipe(connect.reload());
});

gulp.task('process-js', function() {
  return gulp.src('js/**/main.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.js')) //bowerify
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest + '/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest + '/js/'))
    .pipe(connect.reload());
});

gulp.task('process-image', function () {
  return gulp.src('img/**/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngcrush()]
    }))
    .pipe(gulp.dest(dest + '/img/'));
});

gulp.task('process-html', function () {
  var options = {
    partialsDirectory: ['./templates/partials', './templates/layouts']
  };
  return gulp.src('templates/**/index.hbs')
        .pipe(handlebars(data, options))
        .pipe(rename({extname: ".html"}))
        .pipe(gulp.dest(dest));
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

gulp.task('open', function() {
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

gulp.task('build', ['process-html', 'process-css', 'process-js', 'process-image', 'default']);

gulp.task('default', ['connect', 'open', 'watch']);
