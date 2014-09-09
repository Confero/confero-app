var gulp = require('gulp'),
    gutil = require('gulp-util'),
    bower = require('bower'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sh = require('shelljs'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    rsync = require('gulp-rsync'),
    karma = require('gulp-karma');

var paths = {
    sass: ['./scss/**/*.scss'],
    jsSrc: ['./www/js/**/*.js', './www/lib/**/*.js']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({
           extname: '.min.css'
        }))
        .pipe(gulp.dest('./www/css/')).on('end', done);
});

gulp.task('watch', function() {
    gulp.watch(paths.sass, ['sass', 'minify']);
    gulp.watch(paths.jsSrc, ['minify']);
});

gulp.task('install', ['git-check'], function() {
    return bower.commands.install().on('log', function(data) {
        gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
    if(!sh.which('git')) {
        console.log('  ' + gutil.colors.red('Git is not installed.'), '\n  Git, the version control system, is required to download Ionic.', '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.', '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.');
        process.exit(1);
    }
    done();
});

gulp.task('scripts-test', function() {
    return gulp.src('tests/unit/**/*.js')
               .pipe(jshint('.jshintrc'))
               .pipe(jshint.reporter('default'));
});

gulp.task('test', ['scripts-test'], function(cb) {
    return gulp.src(['output/distTest/app.js', 'tests/unit/**/*.js'])
               .pipe(karma({
                   configFile: 'tests/unit/karma.conf.js',
                   action: 'run'
               }))
               .on('error', function(err) {
                   process.exit(1);
               });
});

gulp.task('bundle', function() {
    return gulp.src( [
        'www/lib/i18next/i18next.js',
        'www/lib/localforage/dist/localforage.js',
        'www/lib/angular/angular.js',
        'www/lib/angular-animate/angular-animate.js',
        'www/lib/angular-sanitize/angular-sanitize.js',
        'www/lib/angular-resource/angular-resource.js',
        'www/lib/ionic/js/ionic.js',
        'www/lib/ionic/js/ionic-angular.js',
        'www/lib/collide/collide.js',
        'www/lib/angular-ui-router/release/angular-ui-router.js',
        'www/lib/moment/min/moment-with-locales.js',
        'www/lib/ng-i18next/dist/ng-i18next.js',
        'www/lib/angular-localforage/dist/angular-localForage.js',
        'www/js/**/*.js'])
    .pipe(concat('conferoApp.js'))
    .pipe(gulp.dest('www/dist'));
});

gulp.task('minify', ['bundle'], function() {
    return gulp.src('www/dist/conferoApp.js')
               .pipe(uglify({
                    compress: true,
                    mangle: false
               }))
               .pipe(rename('conferoApp.min.js'))
               .pipe(gulp.dest('www/dist'));
});


gulp.task('deploy', ['minify'], function() {
  gulp.src([
      './www/index.html', 
      './www/dist/**',
      './www/assets/**',
      './www/css/**',
      './www/img/**',
      './www/locales',
      './www/views',
  ])
    .pipe(rsync({
         root: 'build',
         hostname: 'example.com',
         destination: '/path/to/site'
       })
    );
});