"use strict";

import gulp from "gulp";
import concat from "gulp-concat";
import sass from "gulp-sass";
import cleanCSS from "gulp-clean-css";
import sourcemaps from "gulp-sourcemaps";
import minify from "gulp-minify";
import browserSync from "browser-sync";
import eslint from "gulp-eslint";
import babel from "gulp-babel";
import sassLint from "gulp-sass-lint";

//Definisikan lokasi
let basePaths = {
    node: './node_modules',
    css_location: './assets/css/',
    js_location: './assets/js/',
},
// Masukan URL website ini agar bisa menjalankan fungsi live
url_site = 'http://madebyaris.applocal';

// Awasi file dengan browser-sync.
const browsersyncWatchFiles = [
    basePaths.css_location + '*.css',
    basePaths.js_location + '*.js'
];

// Ubah file *.sass menjadi *.css
function styles() {
    stylelint();
    return (
        gulp
            .src( basePaths.css_location + '/sass/*.scss' )
            .pipe( sass( { style: 'compressed' } ).on('error', sass.logError) )
            .pipe( cleanCSS( { debug: true }, (details) =>{
                console.log(details.name + ': ' + (details.stats.originalSize / 1000) + 'KB' );
                console.log(details.name + ': ' + (details.stats.minifiedSize / 1000) + 'KB' );
            } ) )
            .pipe( gulp.dest( basePaths.css_location ) )
            .pipe(browserSync.stream())
    );
}

// Cek apakah javascript ada error atau tidak.
function lint() {
    return (
        gulp
            .src( basePaths.js_location + '/src/*.js' )
            .pipe(eslint())
            .pipe(eslint.format())
            .pipe(eslint.failAfterError())
    );
}

// Cek apakah Style/css ada kode yang error atau tidak.
function stylelint() {
    return (
        gulp
        .src(basePaths.css_location + '/sass/**/*.s+(a|c)ss')
        .pipe( sassLint() )
        .pipe( sassLint.format() )
        .pipe( sassLint.failOnError() )
    );
}

// Perkecil File javascript.
function scripts() {
    lint();
    return (
        gulp
            .src( basePaths.js_location + '/src/*.js' )
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe( minify() )
            .pipe( gulp.dest( basePaths.js_location ) )
    );
}

// Fungsi untuk melakukan perubahan ketika ada file yang berubah
function watch() {
    gulp.watch( basePaths.css_location + 'sass/**/*.scss', styles );
    gulp.watch( basePaths.js_location + 'src/**/*.js', scripts);
}

// Fungsi untuk melihat perubahan secara langsung dengan me-refresh browser
function live() {

    browserSync.init({
        proxy: url_site
    });

    gulp.watch( basePaths.css_location + 'sass/**/*.scss', styles );
}

// Buat perintah gulp dan jalankan fungsi yang telah di definisikan.
exports.styles = styles;
exports.scripts = scripts;
exports.lint = lint;
exports.watch = watch;
exports.live = live;
exports.stylelint = stylelint;