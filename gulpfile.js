const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const pump = require('pump');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const connect = require('gulp-connect');

let sassSources = ['styles/*.scss'];
let jsSources = ['scripts/*.js'];
let htmlSources = ['**/*.html'];
let outputDir = 'assests';

let err = new gutil.PluginError('test', 'something broke', {showStack: true});
// task logger
gulp.task('log', () =>  {
  gutil.log('==My Task Log ==')
});

// simple copy to assests plugin. => copies html files to assests.
gulp.task('copy', () => {
   gulp.src('**/*.html')
      .pipe(gulp.dest(outputDir))
});


// sass conversion to css.
gulp.task('sass', () => {
  gulp.src(sassSources)
    .pipe(sass({style: 'expanded'}))
      .on('error', gutil.log)
    .pipe(gulp.dest('assests'))
    .pipe(connect.reload())
});

gulp.task('sass:watch', function () {
  gulp.watch('styles/**/*.scss', ['sass']);
});

// javascript minify and concat wrapped in a callback error message bubble.
gulp.task('js', function (cb) {
  pump([
      gulp.src(jsSources),
      uglify(),
      concat('scripts.js'),
      gulp.dest(outputDir)
      .pipe(connect.reload())
    ],
    cb
  );
});

// reload when html changes.
gulp.task('html', () => {
  gulp.src(htmlSources)
  .pipe(connect.reload())
});

// watch file to automatically change files when changes occur.
gulp.task('watch', () => {
  gulp.watch( sassSources, ['sass']);
  gulp.watch(jsSources,  ['js']);
  gulp.watch( htmlSources, ['html']);
});

gulp.task('connect', () => {
  connect.server({
    root: '.',
    livereload: true
  })
});

// default task to run everything.
gulp.task('default', ['html', 'js', 'sass', 'connect', 'watch' ]);
