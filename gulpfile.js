var gulp = require( "gulp" );
var clean = require( "gulp-clean" );
var concat = require( "gulp-concat" );
var uglify = require( "gulp-uglify" );
var sourcemaps = require( "gulp-sourcemaps" );
var rename = require( "gulp-rename" );
var changed = require( "gulp-changed" );
var flatten = require( "gulp-flatten" );
var replace = require( "gulp-replace" );

gulp.task( "default", [
	"clean-library",
	"clean-build",
	"clean-deploy",

	"copy-library",
	"build-library",
	"deploy-library",

	"build-script",
	"deploy-script",

	"build-index",
	"deploy-index"
] );


gulp.task( "link-library", [ "clean-library", "copy-library" ] );

gulp.task( "clean-library",
	function cleanTask( ){
		return gulp.src( "client/library", { "read": false } ).pipe( clean( { "force": true } ) );
	} );

gulp.task( "copy-library",
	[ "clean-library" ],
	function copyTask( ){
		return gulp.src(
				[
					"bower_components/*/*.css",
					"bower_components/*/*.map",
					"bower_components/*/*.js",
					"bower_components/*/dist/**/*.eot",
					"bower_components/*/dist/**/*.svg",
					"bower_components/*/dist/**/*.ttf",
					"bower_components/*/dist/**/*.woff",
					"bower_components/*/dist/**/*.css",
					"bower_components/*/dist/**/*.map",
					"bower_components/*/dist/**/*.js",
					"bower_components/*/lib/**/*.js",
					"!**/Gruntfile.js"
				]
			)
			.pipe( flatten( ) )
			.pipe( changed( "client/library" ) )
			.pipe( gulp.dest( "client/library" ) );
	} );


gulp.task( "build", [ "clean-build", "build-script", "build-library", "build-index" ] );

gulp.task( "clean-build",
	[ "clean-library", "copy-library" ],
	function cleanTask( ){
		return gulp.src( "build", { "read": false } ).pipe( clean( { "force": true } ) );
	} );

gulp.task( "build-script",
	[ "clean-build" ],
	function buildTask( ){
		return gulp.src( "client/script/*.js" )
			.pipe( changed( "build/script" ) )
			.pipe( sourcemaps.init( ) )
			.pipe( concat( "crime-app.js" ) )
			.pipe( gulp.dest( "build/script" ) )
			.pipe( uglify( ) )
			.pipe( rename( "crime-app.min.js" ) )
			.pipe( sourcemaps.write( "./" ) )
			.pipe( gulp.dest( "build/script" ) )
	} );

gulp.task( "build-library",
	[ "clean-library", "copy-library", "clean-build" ],
	function buildTask( ){
		return gulp.src( "client/library/*.*" )
			.pipe( gulp.dest( "build/library" ) )
	} );

gulp.task( "build-index",
	[ "clean-build" ],
	function buildTask( ){
		return gulp.src( "client/index.html" )
			.pipe( replace( /\.min\.js/g, ".js" ) )
			.pipe( gulp.dest( "build" ) );
	} );


gulp.task( "deploy", [ "clean-deploy", "deploy-script", "deploy-library", "deploy-index" ] );

gulp.task( "clean-deploy",
	[ "clean-library", "copy-library", "clean-build", "build-library" ],
	function cleanTask( ){
		return gulp.src( "deploy", { "read": false } ).pipe( clean( { "force": true } ) );
	} );

gulp.task( "deploy-script",
	[ "clean-build", "build-script", "clean-deploy" ],
	function deployTask( ){
		return gulp.src(
				[
					"build/script/*.js",
					"build/script/*.map"
				]
			)
			.pipe( gulp.dest( "deploy/script" ) )
	} );

gulp.task( "deploy-library",
	[ "clean-library", "copy-library", "clean-build", "build-library", "clean-deploy" ],
	function deployTask( ){
		return gulp.src( "build/library/*.*" )
			.pipe( gulp.dest( "deploy/library" ) )
	} );

gulp.task( "deploy-index",
	[ "clean-deploy" ],
	function buildTask( ){
		return gulp.src( "client/index.html" )
			.pipe( gulp.dest( "deploy" ) );
	} );






