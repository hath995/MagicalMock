var istanbul = require('gulp-istanbul');
var isparta = require('isparta');
var gulp = require('gulp');
// We'll use mocha in this example, but any test framework will work 
var mocha = require('gulp-mocha');
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
var exec = require('child_process').exec;

gulp.task('build', (cb) => {
    exec('tsc', function(err, stdout, stderr) {
     if (err) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        return cb();
     }
     cb(err);
    });
});

gulp.task('pre-test', ['build'], function () {
  return gulp.src(['src/*.js'])
    // Covering files 
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter
    }))
    // Force `require` to return covered files 
    .pipe(istanbul.hookRequire());
});
 
gulp.task('test', ['pre-test'], function () {
  return gulp.src(['test/*.js'])
    .pipe(mocha())
    // Creating the reports after tests ran 
    .pipe(istanbul.writeReports())
    // Enforce a coverage of at least 90% 
    .pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } }));
});

gulp.task('remap', function() {
    return gulp.src('coverage/coverage-final.json')
        .pipe(remapIstanbul({
            reports: {
                'json': 'coverage/coverage.json',
                'html': 'coverage/html-report'
            }
        }));
});
