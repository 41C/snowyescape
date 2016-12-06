var gulp = require('gulp'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	rename = require("gulp-rename"),
	concat = require('gulp-concat'),
	watch = require('gulp-watch');

gulp.task('styles', function () {
	gulp.src('assets/styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
	gulp.src(['assets/js/jquery-1.11.3.js', 'assets/js/share.js', 'assets/js/main.js'])
		.pipe(concat({path: 'main.js'}))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	gulp.watch('assets/styles/**/*.scss', ['styles']);
	gulp.watch('assets/js/*.js', ['js']);
});

gulp.task('default', ['styles', 'js', 'watch']);
