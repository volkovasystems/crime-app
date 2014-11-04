var gulp = require( "gulp" );
var clean = require( "gulp-clean" );
var concat = require( "gulp-concat" );
var uglify = require( "gulp-uglify" );
var sourcemaps = require( "gulp-sourcemaps" );
var rename = require( "gulp-rename" );
var changed = require( "gulp-changed" );
var flatten = require( "gulp-flatten" );
var replace = require( "gulp-replace" );
var insert = require( "gulp-insert" );
var react = require( "gulp-react" );
var minifyCSS = require( "gulp-minify-css" );
var less = require( "gulp-less" );
var filter = require( "gulp-filter" );
var livereload = require( "gulp-livereload" );
var embedlr = require( "gulp-embedlr" );
var plumber = require( "gulp-plumber" );

var connect = require( "connect" );
var serveStatic = require( "serve-static" );

const INCLUDE_SCRIPT_PATTERN = /\<\!\-\-\:\s*.+?\@include\-script\:(\"[^\"]+?\").+?\s*\-\-\>/g;
const INCLUDE_STYLE_PATTERN = /\<\!\-\-\:\s*.+?\@include\-style\:(\"[^\"]+?\").+?\s*\-\-\>/g;

const MINIFIED_SCRIPT_PATTERN = /\.min\.js/g;
const MINIFIED_STYLE_PATTERN = /\.min\.css/g;

const INCLUDE_SCRIPT_REPLACER = "<script type=\"text/javascript\" src=$1></script>";
const INCLUDE_STYLE_REPLACER = "<link rel=\"stylesheet\" type=\"text/css\" href=$1>";

const REACTJS_DOM_FLAG = "/** @jsx React.DOM */\n";
const REACTJS_DOM_FLAG_PATTERN = /\/\*\*\s*\@jsx\s+React\.DOM\s*\*\/\n/g;
const REACTJS_DOM_FLAG_REPLACER = "";

const PRODUCTION_MODE_PATTERN = /\<\!\-\-:\s*.+?\@production\-mode\:\s*([^]+?)\s*\@end\-production\-mode\s*\-\-\>/gm;
const PRODUCTION_MODE_REPLACER = "$1";

var scriptList = require( "./script-list.js" ).scriptList;

gulp.task( "default", [
	"clean-library",
	"clean-build",
	"clean-deploy",

	"copy-library",
	"build-library",
	"deploy-library",

	"build-font",
	"deploy-font",

	"build-script",
	"deploy-script",

	"build-less",
	"build-style",
	"deploy-style",

	"build-image",
	"deploy-image",

	"build-index",
	"deploy-index"
] );

gulp.task( "clean", [ "clean-library", "clean-build", "clean-deploy", "clean-temp" ] );

gulp.task( "clean-temp",
	function cleanTask( ){
		return gulp
			.src( "temp", { "read": false } )
			.pipe( plumber( ) )
			.pipe( clean( { "force": true } ) );
	} );


gulp.task( "link-library", [ "clean-library", "copy-library" ] );

gulp.task( "clean-library",
	function cleanTask( ){
		return gulp
			.src( "client/library", { "read": false } )
			.pipe( plumber( ) )
			.pipe( clean( { "force": true } ) );
	} );

gulp.task( "copy-library",
	[ "clean-library" ],
	function copyTask( ){
		return gulp
			.src( [
				"bower_components/*/*.css",
				"bower_components/*/*.map",
				"bower_components/*/*.js",
				"bower_components/*/*.eot",
				"bower_components/*/*.svg",
				"bower_components/*/*.ttf",
				"bower_components/*/*.woff",
				"bower_components/*/dist/**/*.eot",
				"bower_components/*/dist/**/*.svg",
				"bower_components/*/dist/**/*.ttf",
				"bower_components/*/dist/**/*.woff",
				"bower_components/*/dist/**/*.css",
				"bower_components/*/dist/**/*.map",
				"bower_components/*/dist/**/*.js",
				"bower_components/*/lib/**/*.js",
				"bower_components/*/build/**/*.js",
				"bower_components/*/build/**/*.css",
				"!bower_components/mathjs/lib/**/*.js",
				"!**/Gruntfile.js",
				"!**/index.js"
			] )
			.pipe( plumber( ) )
			.pipe( flatten( ) )
			.pipe( gulp.dest( "client/library" ) );
	} );


gulp.task( "build", [ "clean-build", "build-script", "build-library", "build-font", "build-less", "build-style", "build-image", "build-index" ] );

gulp.task( "clean-build",
	[ "clean-library", "copy-library" ],
	function cleanTask( ){
		return gulp
			.src( "build", { "read": false } )
			.pipe( plumber( ) )
			.pipe( clean( { "force": true } ) );
	} );

gulp.task( "build-script",
	[ "clean-build" ],
	function buildTask( ){
		return gulp
			.src( scriptList )
			.pipe( plumber( ) )
			.pipe( insert.prepend( REACTJS_DOM_FLAG ) )
			.pipe( react( ) )
			.pipe( sourcemaps.init( ) )
			.pipe( concat( "crime-app.js" ) )
			.pipe( replace( REACTJS_DOM_FLAG, REACTJS_DOM_FLAG_REPLACER ) )
			.pipe( gulp.dest( "build/script" ) )
			.pipe( uglify( ) )
			.pipe( rename( "crime-app.min.js" ) )
			.pipe( sourcemaps.write( "./" ) )
			.pipe( gulp.dest( "build/script" ) )
	} );

gulp.task( "build-library",
	[ "clean-library", "copy-library", "clean-build" ],
	function buildTask( ){
		return gulp
			.src( "client/library/*.*" )
			.pipe( plumber( ) )
			.pipe( gulp.dest( "build/library" ) )
	} );

gulp.task( "build-font",
	[ "build-library" ],
	function buildTask( ){
		return gulp
			.src( [
				"client/library/*.eot",
				"client/library/*.svg",
				"client/library/*.ttf",
				"client/library/*.woff"
			] )
			.pipe( gulp.dest( "client/fonts" ) )
			.pipe( gulp.dest( "build/fonts" ) );
	} );

gulp.task( "build-less",
	[ "clean-build" ],
	function buildTask( ){
		return gulp
			.src( "client/style/*.less" )
			.pipe( plumber( ) )
			.pipe( less( ) )
			.pipe( filter( [ "app.css" ] ) )
			.pipe( rename( "crime-app.css" ) )
			.pipe( gulp.dest( "temp/style" ) );
	} );

gulp.task( "build-style",
	[ "clean-build", "build-less" ],
	function buildTask( ){
		return gulp
			.src( "temp/style/*.css" )
			.pipe( plumber( ) )
			.pipe( gulp.dest( "build/style" ) )
			.pipe( sourcemaps.init( ) )
			.pipe( minifyCSS( { "keepBreaks": true } ) )
			.pipe( rename( "crime-app.min.css" ) )
			.pipe( sourcemaps.write( "./" ) )
			.pipe( gulp.dest( "build/style" ) );
	} );

gulp.task( "build-image",
	[ "clean-build" ],
	function buildTask( ){
		return gulp
			.src( "client/image/*.*" )
			.pipe( plumber( ) )
			.pipe( gulp.dest( "build/image" ) );
	} );

gulp.task( "build-index",
	[ "clean-build" ],
	function buildTask( ){
		return gulp
			.src( "client/index.html" )
			.pipe( plumber( ) )
			.pipe( replace( INCLUDE_SCRIPT_PATTERN, INCLUDE_SCRIPT_REPLACER ) )
			.pipe( replace( INCLUDE_STYLE_PATTERN, INCLUDE_STYLE_REPLACER ) )
			.pipe( replace( MINIFIED_SCRIPT_PATTERN, ".js" ) )
			.pipe( replace( MINIFIED_STYLE_PATTERN, ".css" ) )
			.pipe( embedlr( ) )
			.pipe( gulp.dest( "build" ) );
	} );


gulp.task( "deploy", [ "clean-deploy", "deploy-script", "deploy-library", "deploy-font", "deploy-style", "deploy-image", "deploy-index" ] );

gulp.task( "clean-deploy",
	[ "clean-library", "copy-library", "clean-build", "build-library" ],
	function cleanTask( ){
		return gulp
			.src( "deploy", { "read": false } )
			.pipe( plumber( ) )
			.pipe( clean( { "force": true } ) );
	} );

gulp.task( "deploy-script",
	[ "clean-build", "build-script", "clean-deploy" ],
	function deployTask( ){
		return gulp
			.src( [
				"build/script/*.js",
				"build/script/*.map"
			] )
			.pipe( plumber( ) )
			.pipe( gulp.dest( "deploy/script" ) )
	} );

gulp.task( "deploy-library",
	[ "clean-library", "copy-library", "clean-build", "build-library", "clean-deploy" ],
	function deployTask( ){
		return gulp
			.src( "build/library/*.*" )
			.pipe( plumber( ) )
			.pipe( gulp.dest( "deploy/library" ) )
	} );

gulp.task( "deploy-font",
	[ "deploy-library" ],
	function deployTask( ){
		return gulp
			.src( [
				"build/library/*.eot",
				"build/library/*.svg",
				"build/library/*.ttf",
				"build/library/*.woff"
			] )
			.pipe( gulp.dest( "deploy/fonts" ) );
	} );

gulp.task( "deploy-style",
	[ "clean-build", "build-less", "build-style", "clean-deploy" ],
	function deployTask( ){
		return gulp
			.src( [
				"build/style/*.css",
				"build/style/*.map"
			] )
			.pipe( plumber( ) )
			.pipe( gulp.dest( "deploy/style" ) )
	} );

gulp.task( "deploy-image",
	[ "clean-build", "clean-deploy" ],
	function deployTask( ){
		return gulp
			.src( "build/image/*.*" )
			.pipe( plumber( ) )
			.pipe( gulp.dest( "deploy/image" ) );
	} );

gulp.task( "deploy-index",
	[ "clean-deploy" ],
	function buildTask( ){
		return gulp
			.src( "client/index.html" )
			.pipe( plumber( ) )
			.pipe( replace( INCLUDE_SCRIPT_PATTERN, INCLUDE_SCRIPT_REPLACER ) )
			.pipe( replace( INCLUDE_STYLE_PATTERN, INCLUDE_STYLE_REPLACER ) )
			.pipe( replace( PRODUCTION_MODE_PATTERN, PRODUCTION_MODE_REPLACER ) ) 
			.pipe( gulp.dest( "deploy" ) );
	} );

gulp.task( "server-static",
	function serverTask( done ){
		var portNumber = process.config.port || process.env.PORT || 8000;
		var server = connect( );
		server
			.use( serveStatic( "build" ) )
			.listen( portNumber, "localhost", done );
	} )

var server = livereload( );

gulp.task( "reload", [ "build" ],
	function reloadTask( done ){
		server.changed( );
		done( );
	} );

gulp.task( "watch", 
	[ 
		"clean-build", 
		"build-script", 
		"build-library",
		"build-font",
		"build-less", 
		"build-style", 
		"build-image", 
		"build-index", 
		"server-static" 
	],
	function watchTask( ){
		gulp.watch( [ 
			"client/script/**", 
			"client/style/**", 
			"client/index.html" 
		], 
		[ "reload" ] );
	} );