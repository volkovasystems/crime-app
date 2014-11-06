var path = require( "path" );
var fs = require( "fs" );

var scriptList = [
	"event.js",
	"page-flow.js",
	
	"icon.js",
	"progress-bar.js",
	"map-locate.js",
	"map-view.js",
	
	"home.js",
	"forehead.js",
	"dashbar.js",
	"login.js",
	"profile.js",
	"app.js",

	"crime-app.js",
	"crime-icon.js",
	"crime-dashbar.js",
	"crime-login.js",
	"crime-profile.js"
]
.map( function onEachScriptFile( scriptFile ){
	return path.resolve( ".", "client", "script", scriptFile );
} )
.filter( function onEachScriptFile( scriptFile ){
	return fs.existsSync( scriptFile );
} );

exports.scriptList = scriptList;

