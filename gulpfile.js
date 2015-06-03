'use strict';

var path = require('path');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var trash = require('trash');

var handleErr = function(err) {
  console.log(err.message);
  process.exit(1);
};

function style() {
  return gulp.src([
    'test/*.js',
    'test/tmp/**/*.js',
    'generators/**/index.js',
    'gulpfile.js',
    'index.js'
  ])
  .pipe($.jscs())
  .pipe($.jshint('.jshintrc'))
  .pipe($.jshint.reporter('jshint-stylish'))
  .pipe($.jshint.reporter('fail'))
  .on('error', handleErr);
}

function test(done) {
  var mochaErr;

  gulp.src([
    'generators/**/index.js',
    'index.js'
  ])
  .pipe($.istanbul())
  .pipe($.istanbul.hookRequire())
  .on('finish', function() {
    gulp.src(['test/*.js'])
      .pipe($.plumber())
      .pipe($.mocha({
        reporter: 'spec'
      }))
      .on('error', function(err) {
        mochaErr = err;
      })
      .pipe($.istanbul.writeReports())
      .on('end', function() {
        done(mochaErr);
      });
  });
}

function coveralls() {
  if (!process.env.CI) {
    return;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe($.coveralls());
}

function clean(done) {
  trash(['test/tmp']);
  done();
}

gulp.task('clean', clean);
gulp.task('default', gulp.series(clean, style, test, coveralls));
