/// <binding />
var gulp = require('gulp');

require('./gulp-tasks/ios-build.js');

gulp.task('default', ['IOS_DEBUG_BUILD']);