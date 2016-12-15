var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat')
    gulpSequence = require('gulp-sequence'),
    del = require('gulp-clean')
gulp.task('compress',function(){
    gulp.src([
        'src/faSwiper.js'
    ])
        .pipe(concat('faSwiper.js'))
        .pipe(gulp.dest('dist'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist'))
});
gulp.task('default',['sequence'], function() {
    console.log("项目构建成功");
});

gulp.task('sequence', gulpSequence('clean','compress'));

gulp.task('clean', function(cb) {
    del(['dist/*.js']);
    return cb();

});