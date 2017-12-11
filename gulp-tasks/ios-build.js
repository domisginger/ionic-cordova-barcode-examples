var gulp = require('gulp');
var argv = require('yargs').argv;
var taco = require('gulp-remotebuild');

gulp.task('remoteBuild', function () {
    console.log('Remote Build');
    if (typeof argv.buildType === 'undefined') {
        throw 'Build Type not found';
    } else {
        console.log('Build Type: ' + argv.buildType.toUpperCase());
        gulp.src('./**/*')
            .pipe(taco.build({
                configuration: argv.buildType,
                host: 'agilemac.derriford.phnt.swest.nhs.uk:3000',
                options: '--device ' + (argv.buildType == 'debug' ? '' : '--generateSourceMap=false')
            }))
            .pipe(gulp.dest('bin/iOS/' + argv.buildType.charAt(0).toUpperCase() + argv.buildType.slice(1)));
    }    
});

gulp.task('setDebug', function () {
    if (typeof argv.buildType === 'undefined') argv.buildType = 'debug';
});

gulp.task('setRelease', function () {
    if (typeof argv.buildType === 'undefined') argv.buildType = 'release';
});

gulp.task('IOS_DEBUG_BUILD', ['setDebug', 'remoteBuild']);
gulp.task('IOS_RELEASE_BUILD', ['setRelease', 'remoteBuild']);