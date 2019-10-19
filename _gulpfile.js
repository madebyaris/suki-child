//Definisikan lokasi
let basePaths = {
    node: './node_modules',
    css_location: './assets/css/',
    js_location: './assets/js/',
},
    // Masukan URL website ini agar bisa menjalankan fungsi live
    url_site = 'http://madebyaris.applocal';


// Definisikan & muat package yang ingin digunakan.
const gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    sass        = require('gulp-sass'),
    cleanCSS    = require('gulp-clean-css'),
    sourcemaps  = require('gulp-sourcemaps'),
    minify      = require('gulp-minify'),
    browserSync = require('browser-sync').create(),
    eslint      = require('gulp-eslint'),
    gulpif      = require('gulp-if'),
    babel       = require('babel-core'),
    gulpBabel   = require('gulp-babel');

// Awasi file dengan browser-sync.
const browsersyncWatchFiles = [
    basePaths.css_location + '*.css',
    basePaths.js_location + '*.js'
];

// Ubah file *.sass menjadi *.css
function styles() {
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
// Perkecil File javascript.
function scripts() {
    lint();
    return (
        gulp
            .src( basePaths.js_location + '/src/*.js' )
            .pipe( babel(babel({
                presets: ['@babel/env']
            })) )
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

