'use strict';
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
gulp.task('default', function() {
  return gulp.src([
    './js/nc.module.js',
    './js/nc.config.service.js',
    './js/nc.auth.service.js',
    './js/nc.editable.service.js',
    './js/nc.editable.directive.js'
    ])
    .pipe(concat('narrow-cms-client.js'))
    .pipe(gulp.dest('./dist/'))
    .pipe(uglify())
    .pipe(rename('narrow-cms-client.min.js'))
    .pipe(gulp.dest('./dist/'));
});
