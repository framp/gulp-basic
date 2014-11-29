//General
var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var cache = require('gulp-cached');
var remember = require('gulp-remember');
var watch = require('gulp-watch');
var open = require('gulp-open');
var connect = require('gulp-connect');
var data = require('gulp-data');
//Stylesheets
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var please = require('gulp-pleeease');
//Scripts
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
//Images
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
//Templates
var Handlebars = require('handlebars');
require('handlebars-layouts')(Handlebars);
Handlebars.registerHelper('version', function(){
  return version;
});
Handlebars.registerHelper('environment', function(){
  return version;
});
var handlebars = require('gulp-handlebars-html')();

var dest = '..';
var version = 0;

if (fs.existsSync(dest + '/build'))
  version = fs.readFileSync(dest + '/build');

gulp.task('increment-version', function() {
  version += 1;
  fs.writeFileSync(dest + '/build', version);
});

gulp.task('process-stylesheets', function() {
  return gulp.src('stylesheets/**/index.scss')
    .pipe(cache('stylesheets-sass'))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(remember('stylesheets-sass'))
    .pipe(gulp.dest(dest + '/stylesheets'))
    .pipe(rename({suffix: '.v' + version + '.min'}))
    .pipe(cache('stylesheets-please'))
    .pipe(please())
    .pipe(remember('stylesheets-please'))
    .pipe(gulp.dest(dest + '/stylesheets/'))
    .pipe(connect.reload());
});

gulp.task('process-scripts', function() {
  return gulp.src('scripts/**/index.js')
    .pipe(cache('scripts-browserify'))
    .pipe(browserify({
      transform: ['debowerify'],
      debug: true
    }))
    .pipe(remember('scripts-browserify'))
    .pipe(gulp.dest(dest + '/scripts'))
    .pipe(rename({suffix: '.v' + version + '.min'}))
    .pipe(cache('scripts-uglify'))
    .pipe(uglify())
    .pipe(remember('scripts-uglify'))
    .pipe(gulp.dest(dest + '/scripts/'))
    .pipe(connect.reload());
});

gulp.task('process-images', function () {
  return gulp.src('images/**/*')
    .pipe(cache('images'))
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngcrush()]
    }))
    .pipe(remember('images'))
    .pipe(rename({suffix: '.v' + version + '.min'}))
    .pipe(gulp.dest(dest + '/images/'))
    .pipe(connect.reload());

});

gulp.task('process-templates', function () {
  var options = {
    partialsDirectory: ['./templates/partials', './templates/layouts']
  };
  return gulp.src('templates/**/index.hbs')
        .pipe(cache('templates'))
        .pipe(data(function(file) {
          var content = './content/en-US/' + path.basename(file.path) + '.json';
          return JSON.parse(fs.readFileSync(content));
        }))
        .pipe(handlebars(data, options))
        .pipe(remember('templates'))
        .pipe(rename({extname: ".html"}))
        .pipe(gulp.dest(dest))
        .pipe(connect.reload());
});

gulp.task('connect', function() {
  connect.server({
    root: dest,
    livereload: true
  });
});

gulp.task('open', function() {
  gulp.src('gulpfile.js')
  .pipe(open("",{
    url: 'http://localhost:8080'
  }));
});

gulp.task('watch', function () {
  gulp.watch('js/**/*.js', ['process-scripts']);
  gulp.watch('css/**/*.scss', ['process-stylesheets']);
  gulp.watch('img/**/*', ['process-images']);
  gulp.watch('templates/**/*.dust', ['process-templats']);
  gulp.watch('content/**/*.json', ['process-templates']);
});
gulp.task('clean-all', function(){
  
});
gulp.task('process-all', ['process-templates', 'process-stylesheets', 'process-scripts', 'process-images']);
gulp.task('build', ['process-all', 'default']);
gulp.task('deploy', ['clean-all', 'increase-version', 'process-all']);
gulp.task('default', ['connect', 'open', 'watch']);
