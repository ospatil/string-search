'use strict';
var path = require('path');
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var excludeGitignore = require('gulp-exclude-gitignore');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var plumber = require('gulp-plumber');
var coveralls = require('gulp-coveralls');
var babel = require('gulp-babel');
var del = require('del');
var isparta = require('isparta');

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('babel-core/register');

var paths = {
  es6: ['lib/**/*.js']
};

gulp.task('static', function () {
  return gulp.src(paths.es6)
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('pre-test', function () {
  return gulp.src(paths.es6)
    .pipe(istanbul({
      includeUntested: true
,      instrumenter: isparta.Instrumenter
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
  var mochaErr;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function (err) {
      console.log(err);
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
});

gulp.task('coveralls', ['test'], function () {
  if (!process.env.CI) {
    return;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});

gulp.task('babel', ['clean'], function () {
  return gulp.src(paths.es6)
    .pipe(babel())
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function () {
  return del('dist');
});

gulp.task('prepublish', ['babel']);

gulp.task('default', ['static', 'test', 'coveralls']);

gulp.task('watch', function() {
  gulp.watch(paths.es6, ['babel']);
});
