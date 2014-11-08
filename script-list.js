var path = require( "path" );
var fs = require( "fs" );

var scriptList = [
	"event.js",
	"page-flow.js",
	
	"icon.js",
	"progress-bar.js",
	"map-pointer",
	"map-locate.js",
	"map-view.js",

	"home.js",
	"forehead.js",
	"dashbar.js",
	"login.js",
	"profile.js",
	"search.js",
	"app.js",

	"crime-app.js",
	"crime-icon.js",
	"crime-home.js",
	"crime-dashbar.js",
	"crime-login.js",
	"crime-profile.js",
	"crime-search.js",
	"crime-map-locate.js"
]
.map( function onEachScriptFile( scriptFile ){
	return path.resolve( ".", "client", "script", scriptFile );
} )
.filter( function onEachScriptFile( scriptFile ){
	return fs.existsSync( scriptFile );
} );

exports.scriptList = scriptList;

