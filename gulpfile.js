var gulp = require( "gulp" );
var clean = require( "gulp-clean" );
var concat = require( "gulp-concat" );
var uglify = require( "gulp-uglify" );
var sourcemaps = require( "gulp-sourcemaps" );
var rename = require( "gulp-rename" );
var changed = require( "gulp-changed" );

gulp.task( "default", [ "clean", "script"/*, "style"*/ ] );

gulp.task( "clean",
	function cleanTask( ){
		return gulp.src( "build", { "read": false } ).pipe( clean( ) );
	} );

gulp.task( "script",
	function scriptTask( ){
		return gulp.src( "client/script/*.js" )
			.pipe( changed( "build/script" ) )
			.pipe( concat( "crime-app.js" ) )
			.pipe( gulp.dest( "build/script" ) )
			.pipe( sourcemaps.init( ) )
			.pipe( uglify( ) )
			.pipe( rename( "crime-app.min.js" ) )
			.pipe( sourcemaps.write( "./" ) )
			.pipe( gulp.dest( "build/script" ) )
	} );


