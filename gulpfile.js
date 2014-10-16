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
    angularTemplates = require('gulp-angular-templates'),
    clean = require('gulp-clean'),
    manifest = require('gulp-manifest'),
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

gulp.task('clean-dist', function () {
    return gulp.src('www/dist', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('clean-templates', function () {
    return gulp.src('www/templates', {read: false})
        .pipe(clean({force: true}));
});

gulp.task('bundle', ['clean-dist', 'html', 'cp-index', 'cp-assets', 'cp-img', 'cp-locales', 'cp-css', 'cp-ionic'], function() {
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
        'www/js/**/*.js',
        'www/templates/**/*.js'])
    .pipe(concat('conferoApp.js'))
    .pipe(gulp.dest('www/dist'));
});

gulp.task('minify', ['clean-dist', 'clean-templates', 'bundle'], function() {
    return gulp.src('www/dist/conferoApp.js')
               .pipe(uglify({
                    compress: true,
                    mangle: false
               }))
               .pipe(rename('conferoApp.min.js'))
               .pipe(gulp.dest('www/dist'));
});

gulp.task('cp-index', ['clean-dist'], function(){
     return gulp.src('www/index.html')
         .pipe(gulp.dest('www/dist'));
});

gulp.task('cp-assets', ['clean-dist'], function(){
        return gulp.src('www/assets/**/*')
         .pipe(gulp.dest('www/dist/assets'));
});

gulp.task('cp-img', ['clean-dist'], function(){
        return gulp.src('www/img/**/*')
         .pipe(gulp.dest('www/dist/img'));
});

gulp.task('cp-locales', ['clean-dist'], function(){
        return gulp.src('www/locales/**/*')
         .pipe(gulp.dest('www/dist/locales'));
});

gulp.task('cp-css', ['clean-dist'], function(){
        return gulp.src('www/css/**/*')
         .pipe(gulp.dest('www/dist/css'));
});

gulp.task('cp-ionic', ['clean-dist'], function(){
        return gulp.src('www/lib/ionic/fonts/**/*')
         .pipe(gulp.dest('www/dist/lib/ionic/fonts'));
});


gulp.task('html', ['clean-templates'], function () {
    return gulp.src('./www/views/**/*.html')
        .pipe(angularTemplates({module:'confero.app'}))
        .pipe(gulp.dest('./www/templates'));
});

gulp.task('manifest', ['clean-dist', 'clean-templates', 'html', 'cp-index', 'cp-assets', 'cp-img', 'cp-locales', 'cp-css', 'cp-ionic', 'bundle', 'minify'], function(){
    return  gulp.src(['www/dist/**/*'])
        .pipe(manifest({
            hash: true,
            network: ['http://*', 'https://*', '*'],
            filename: 'confero.manifest',
            exclude: 'confero.manifest'
     }))
    .pipe(gulp.dest('www/dist'));

});

gulp.task('deploy', ['clean-dist','clean-templates', 'bundle','minify', 'manifest'], function() {

	var secret = require('./rsyncSecret.js');

    return gulp.src([
      './www/dist/**'
  ])
    .pipe(rsync({
         root: './www/dist/',
         recursive: true,
         ssh: true,
         hostname: secret.host,
         destination: secret.path
       })
    );
});