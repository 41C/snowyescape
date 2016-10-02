var gulp = require('gulp'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	rename = require("gulp-rename"),
	concat = require('gulp-concat'),
	watch = require('gulp-watch');

gulp.task('styles', function () {
	gulp.src('styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
	gulp.src(['js/jquery-1.11.3.js', 'js/share.js', 'js/main.js'])
		.pipe(concat({path: 'main.js'}))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
	gulp.watch('styles/**/*.scss', ['styles']);
	gulp.watch('js/*.js', ['js']);
	gulp.watch('data/*.json', ['data']);
});

gulp.task('default', ['styles', 'js', 'watch']);
