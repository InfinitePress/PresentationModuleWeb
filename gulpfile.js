var gulp = require('gulp');
var karma = require('karma').server;
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var flatten = require('gulp-flatten');
var templateCache = require('gulp-angular-templatecache');
var clean = require('gulp-clean');
var debug = require('gulp-debug');
var streamQueue = require('streamqueue');
var fs = require('fs');

/**
 * File patterns
 **/

// Root directory
var rootDirectory = path.resolve('./');

// Source directory for build process
var sourceDirectory = path.join(rootDirectory, './modules');

var sourceFiles = [

  //// Make sure module files are handled first
  //path.join(sourceDirectory, '/**/*.module.js'),
  //// Then add all JavaScript files
  //path.join(sourceDirectory, '/**/*.js')
];

var resourceFiles = [
  //path.join(sourceDirectory,'/**/*.html')
];

if (fs.existsSync(sourceDirectory)) {
  fs.readdirSync(sourceDirectory).forEach(function(folder) {
    var stat = fs.statSync(sourceDirectory + '/' + folder);
    if (stat.isDirectory()) {
      var module = {
        name:folder,
        sourceFiles: [
          path.join(sourceDirectory, '/' + folder + '/*.module.js'),
          path.join(sourceDirectory, '/' + folder + '/**/*.js')
        ],
        resourceFiles: [
          path.join(sourceDirectory, '/' + folder + '/directives/view-templates/*.html')
        ],
        resourceStream: {}
      };
      sourceFiles.push(module);
    }
  });
}

var lintFiles = [
  // Make sure module files are handled first
  path.join(sourceDirectory, '/**/*.module.js'),
  // Then add all JavaScript files
  path.join(sourceDirectory, '/**/*.js'),
  'gulpfile.js',
  // Karma configuration
  'karma-*.conf.js'
];
  //.concat(sourceFiles);

gulp.task('clean_build', function() {
  var distFolder = [path.join(rootDirectory,'/dist')];
  gulp.src(distFolder)
    .pipe(clean());
});

/**
 * Validate source JavaScript
 */
gulp.task('jshint', function () {
  return gulp.src(lintFiles)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});

/**
 * Run test once and exit
 */
gulp.task('test-src', function (done) {
  karma.start({
    configFile: __dirname + '/karma-src.conf.js',
    singleRun: true
  }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-concatenated', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-concatenated.conf.js',
    singleRun: true
  }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-minified.conf.js',
    singleRun: true
  }, done);
});

gulp.task('build', function() {
  sourceFiles.forEach(function(module){
    var moduleStream = gulp.src(module.sourceFiles[0]),
      sourceStream = gulp.src(module.sourceFiles[1]),
      stream = streamQueue({ objectMode: true }, moduleStream, module.resourceStream, sourceStream);

    stream.pipe(debug())
      .pipe(plumber())
      .pipe(concat('presentationengine.js'))
      .pipe(gulp.dest('./dist/'))
      .pipe(uglify())
      .pipe(rename('presentationengine.min.js'))
      .pipe(gulp.dest('./dist'));
  });
  //var buildStream = gulp.src(sourceFiles);
  //var stream = streamQueue({ objectMode: true }, resourceStream, buildStream);
  //  stream.pipe(debug())
  //  .pipe(plumber())
  //  .pipe(concat('presentationengine.js'))
  //  .pipe(gulp.dest('./dist/'))
  //  .pipe(uglify())
  //  .pipe(rename('presentationengine.min.js'))
  //  .pipe(gulp.dest('./dist'));
});

gulp.task('build_resources', function() {
  sourceFiles.forEach(function(module){
    var resourceStream = gulp.src(module.resourceFiles[0])
      .pipe(flatten())
      .pipe(templateCache(module.name + '-templates.js',{root:'view-templates',module:module.name}))
      .pipe(gulp.dest('./dist'));
    module.resourceStream = resourceStream;
  });
  //resourceStream = gulp.src(resourceFiles)
  //  .pipe(flatten())
  //  .pipe(templateCache('templates.js',{root:'view-templates',standalone:true}))
  //  .pipe(gulp.dest('./dist'));
});

/**
 * Process
 */
gulp.task('process-all', function (done) {
  runSequence('clean_build', 'jshint', 'test-src', 'build_resources', 'build',  done);
});

/**
 * Watch task
 */
gulp.task('watch', function () {

  // Watch JavaScript files
  gulp.watch(sourceFiles, ['process-all']);
});

gulp.task('default', function () {
  runSequence('process-all');
});
