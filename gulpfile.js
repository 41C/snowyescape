const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const watch = require('gulp-watch');

gulp.task('styles', () => {
	gulp.src('assets/styles/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(sass({outputStyle: 'compressed'}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'));
});

gulp.task('js', () => {
	gulp.src(['assets/js/jquery-1.11.3.js', 'assets/js/screenfull.js', 'assets/js/share.js', 'assets/js/main.js'])
		.pipe(concat({path: 'main.js'}))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
	gulp.watch('assets/styles/**/*.scss', ['styles']);
	gulp.watch('assets/js/*.js', ['js']);
});

gulp.task('default', ['styles', 'js', 'watch']);
