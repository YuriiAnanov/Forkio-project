'use strict';

import pkg from "gulp";
import gulp from "gulp";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import fileInclude from "gulp-file-include";
import browserSync from "browser-sync";
import gulpUglify from "gulp-uglify";
import gulpCleanCss from "gulp-clean-css";
import { deleteAsync } from "del";
import gulpConcat from "gulp-concat";
import gulpImagemin from "gulp-imagemin";
import rename from "gulp-rename";
import prettify from "gulp-prettify";
import gulpAutoprefixer from "gulp-autoprefixer";
import groupmedia from "gulp-group-css-media-queries";
const sass = gulpSass(dartSass);
const { lastRun } = gulp;

const {task, watch, series, src, dest, parallel} = pkg;

task('styleCSS', () => {
	return src("./src/styles/*.scss")
		.pipe(sass.sync({
			sourceComments: false,
			outputStyle: "expanded"
		}).on('error', sass.logError))
		.pipe(groupmedia())
		.pipe(gulpAutoprefixer({
			overrideBrowserslist: ['last 2 versions'],
			cascade: false
		  }))
		.pipe(gulpCleanCss())
		.pipe(rename({ suffix: ".min" })) 
		.pipe(dest("./dist/css/"))
		.pipe(browserSync.stream());
})

task('moveHTML', () => {
	return src("./src/views/**/*.html")
	.pipe(fileInclude()) 
	.pipe(prettify({ indent_size: 2 }))
	.pipe(dest("./dist"))
	.pipe(browserSync.stream());
})

task('moveIMG', () => {
	return src("./src/images/**/*.{jpg,jpeg,png,svg}")
    .pipe(gulpImagemin()) 
	.pipe(dest("./dist/images/"))
    .pipe(browserSync.stream());
})

task('scripts', () => {
	return src("./src/js/*.js")
		.pipe(gulpConcat('scripts.js'))
		.pipe(gulpUglify())
		.pipe(rename({ suffix: ".min" })) 
		.pipe(dest("./dist/js/"))
		.pipe(browserSync.stream());
});

task('clean-dist', () => {
    return deleteAsync(["./dist"], {since: lastRun('clean-dist')});
});

task('serve', () => {
	return browserSync.init({
		server: {
			baseDir: ['dist']
		},
		port: 3000,
		open: true
	});
});

task('watchers', () => {
	watch('./src/views/**/*.html', parallel('moveHTML')).on('change', browserSync.reload);
	watch('./src/styles/**/*.scss', parallel('styleCSS')).on('change', browserSync.reload);
	watch('./src/js/*.js', parallel('scripts')).on('change', browserSync.reload);
	watch('./src/views/**/*.html', parallel('moveHTML')).on('change', browserSync.reload);
});

task('build', series('clean-dist', 'styleCSS', 'moveHTML', 'moveIMG', 'scripts'));

task('dev', series('build', parallel('serve', 'watchers')));