'use strict';

var path = require('path');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var handleErr = function(err) {
  console.log(err.message);
  process.exit(1);
};

function style() {
  return gulp.src([
    'test/*.js',
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
    'gulpfile.js',
    'index.js'
  ])
  .pipe($.istanbul({
    includeUntested: true
  }))
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
      // .pipe($.istanbul.enforceThresholds({thresholds: {global: 90}}))
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

gulp.task('default', gulp.series(style, test, coveralls));
