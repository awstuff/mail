"use strict";

const gulp = require("gulp");
const nodemon = require("gulp-nodemon");

gulp.task("default", () => {
    nodemon({
        script: "index.js",
        ext: ""
    });
});
