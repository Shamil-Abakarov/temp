let gulp  = require('gulp'),
	connect = require('gulp-connect'),
	plumber = require('gulp-plumber'),
	changed = require('gulp-changed'),
	rigger = require('gulp-rigger'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	babel = require('gulp-babel'),
	sourcemaps = require('gulp-sourcemaps'),
	gutil = require('gulp-util'),
	imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant')
	watch = require('gulp-watch');

gulp.task('server', () => {
	connect.server({
		port: 8080,
		root: 'dist',
		livereload: true
	});
});

gulp.task('html', () => {
	gulp.src('./src/*.html')
	.pipe(changed('./dist/images'), {hasChanged: changed.compareContent})
	.pipe(rigger())
	.pipe(gulp.dest('./dist'))
	.pipe(connect.reload())
});

gulp.task('sass',  () => {
	  	gulp.src('./src/scss/**/*.scss')
	  	.pipe(sourcemaps.init())	
			.pipe(sass().on('error', sass.logError))
			.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./dist/css'))
		.pipe(connect.reload())
});

gulp.task('js', () => {
	gulp.src('./src/js/**/*.js')
	.pipe(plumber())
	.pipe(sourcemaps.init())
		.pipe(babel({ presets: ['es2015'] }))
	.pipe(sourcemaps.write('./maps'))
	.pipe(gulp.dest('./dist/js'))
	.pipe(connect.reload())
})

gulp.task('image', () => {
    gulp.src('./src/images/**/*.*')
    	.pipe(changed('./dist/images'), {hasChanged: changed.compareContent})
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest('./dist/images'))
        .pipe(connect.reload())
});


gulp.task('watch', function(){
    watch('./src/**/*.html', function(event, cb) {
        gulp.start('html');
    });
	watch('./src/scss/**/*.scss', function(event, cb) {
        gulp.start('sass');
    });
    watch('./src/js/**/*.js', function(event, cb) {
        gulp.start('js');
    });
    watch('./src/images/**/*.*', function(event, cb) {
        gulp.start('image');
    });
});

gulp.task('default', ['server', 'watch']);