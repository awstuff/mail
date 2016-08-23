var gulp = require("gulp");
var uglify = require("gulp-uglify");
var uglifycss = require("gulp-uglifycss");
var concatcss = require("gulp-concat-css");
var browserify = require("browserify");
var babelify = require("babelify");
var envify = require("envify/custom");
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var debugging = require("./js/config-values/debugging");

process.env.NODE_ENV = (debugging ? "development" : "production");   // wtf, idk

gulp.task("init", function () {
    gulp.watch([    // client js changes => process js
        "./js/**/*",
        "!./js/bundle.js"
    ], [
        "js"
    ]);

    gulp.watch([    // client css changes => process css
        "./css/**/*",
        "!./css/bundle.css"
    ], [
        "css"
    ]);
});

gulp.task("js", function () {   // process js: browserify, babel, bundle, uglify
    return browserify("./js/app.js", {
        debug: true
    }).transform("babelify", {
        presets : [
            "es2015",
            "react"
        ]
    }).transform(envify({
        NODE_ENV: (debugging ? "development" : "production")
    })).bundle()
        .pipe(source("./bundle.js"))
        .pipe(buffer())
        .pipe(uglify({
            outSourceMap: true
        }))
        .pipe(gulp.dest("./js"));
});

gulp.task("css", function () {  // process css: bundle, uglify
    return gulp.src([
        "./css/**/*.css",
        "!**/bundle.css"
    ]).pipe(concatcss("./bundle.css"))
        .pipe(uglifycss({
            "uglyComments": true
        }))
        .pipe(gulp.dest("./css"));
});

gulp.task("default", ["init", "js", "css"]);    // run everything once at start