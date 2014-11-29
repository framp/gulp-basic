//General
var fs = require('fs');
var path = require('path');
var del = fs.unlink;
var argv = require('minimist')(process.argv);
var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var cache = require('gulp-cached');
var remember = require('gulp-remember');
var watch = require('gulp-watch');
var open = require('gulp-open');
var connect = require('gulp-connect');
var data = require('gulp-data');
var vinylPaths = require('vinyl-paths');
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
var handlebars = require('gulp-handlebars-html')();

var dest = argv['dest'] || '..';
var version = argv['version'] || 0;
var environment = process.env.NODE_ENV || argv['environment'] || 'development';

if (fs.existsSync(dest + '/build'))
  version = parseInt(fs.readFileSync(dest + '/build'));

gulp.task('prepare-deploy', function() {
  environment = 'production';
  version += 1;
  fs.writeFileSync(dest + '/build', version);
});

gulp.task('process-stylesheets', function() {
  return gulp.src('stylesheets/**/index.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(dest + '/stylesheets'))
    .pipe(rename({
      suffix: '.v' + version + '.min'
    }))
    .pipe(cache('stylesheets-please'))
    .pipe(please())
    .pipe(remember('stylesheets-please'))
    .pipe(gulp.dest(dest + '/stylesheets/'))
    .pipe(connect.reload());
});
gulp.task('clean-stylesheets', function() {
  return gulp.src('stylesheets/**/index.scss')
    .pipe(gulp.dest(dest + '/stylesheets'))
    .pipe(vinylPaths(del))
    .pipe(rename({
      suffix: '.v' + version + '.min'
    }))
    .pipe(vinylPaths(del));
});

gulp.task('process-scripts', function() {
  return gulp.src('scripts/**/index.js')
    .pipe(browserify({
      transform: ['debowerify'],
      debug: true
    }))
    .pipe(gulp.dest(dest + '/scripts'))
    .pipe(rename({
      suffix: '.v' + version + '.min'
    }))
    .pipe(cache('scripts-uglify'))
    .pipe(uglify())
    .pipe(remember('scripts-uglify'))
    .pipe(gulp.dest(dest + '/scripts/'))
    .pipe(connect.reload());
});
gulp.task('clean-scripts', function() {
  return gulp.src('scripts/**/index.js')
    .pipe(gulp.dest(dest + '/scripts'))
    .pipe(vinylPaths(del))
    .pipe(rename({
      suffix: '.v' + version + '.min'
    }))
    .pipe(vinylPaths(del));
});

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
      suffix: '.v' + version + '.min'
    }))
    .pipe(gulp.dest(dest + '/images/'))
    .pipe(connect.reload());
});
gulp.task('clean-images', function() {
  return gulp.src('images/**/*')
    .pipe(rename({
      suffix: '.v' + version + '.min'
    }))
    .pipe(gulp.dest(dest + '/images/'))
    .pipe(vinylPaths(del));
});

gulp.task('process-templates', function() {
  var options = {
    partialsDirectory: ['./templates/partials', './templates/layouts']
  };
  var context = {
    __version: version,
    __debug: environment !== 'production'
  }
  return gulp.src('templates/**/index.hbs')
    .pipe(data(function(file) {
      var content = './content/en-US/' + path.basename(file.path) + '.json';
      return JSON.parse(fs.readFileSync(content));
    }))
    .pipe(handlebars(context, options))
    .pipe(rename({
      extname: ".html"
    }))
    .pipe(gulp.dest(dest))
    .pipe(connect.reload());
});
gulp.task('clean-templates', function() {
  return gulp.src('templates/**/index.hbs')
    .pipe(rename({
      extname: ".html"
    }))
    .pipe(gulp.dest(dest))
    .pipe(vinylPaths(del));
});

gulp.task('connect', function() {
  connect.server({
    root: dest,
    livereload: true
  });
});

gulp.task('open', function() {
  gulp.src('gulpfile.js')
    .pipe(open("", {
      url: 'http://localhost:8080'
    }));
});

gulp.task('watch', function() {
  gulp.watch('scripts/**/*', ['process-scripts']);
  gulp.watch('stylesheets/**/*', ['process-stylesheets']);
  gulp.watch('images/**/*', ['process-images']);
  gulp.watch('templates/**/*', ['process-templates']);
  gulp.watch('contents/**/*', ['process-templates']);
});

gulp.task('clean-all', ['clean-templates', 'clean-stylesheets', 'clean-scripts', 'clean-images']);
gulp.task('process-all', ['process-templates', 'process-stylesheets', 'process-scripts', 'process-images']);
gulp.task('build', ['process-all', 'default']);
gulp.task('deploy', ['clean-all', 'prepare-deploy'], function(){
  gulp.start('process-all');
});
gulp.task('default', ['connect', 'open', 'watch']);
