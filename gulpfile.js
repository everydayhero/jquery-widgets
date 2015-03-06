var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del    = require('del');

// DEFAULT
// ======================================================
gulp.task('default', ['clean'], function() {
  gulp.start('scripts');
});

// SCRIPTS
// ======================================================
gulp.task('scripts', function() {
  return gulp.src('src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('dist/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

// CLEAN
// ======================================================
gulp.task('clean', function(cb) {
  del(['dist/'], cb);
});
