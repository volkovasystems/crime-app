var path = require( "path" );
var fs = require( "fs" );

var scriptList = [
	"facebook-bootstrap-sdk.js",

	"icon.js",
	
	"event.js",
	"page-flow.js",
	"progress-bar.js",
	"map-locate.js",
	"map-view.js",
	
	"app.js",

	"crime-icon.js",
	
	"home.js",

	"crime-dashbar.js",
	"dashbar.js",

	"forehead.js",

	"login.js",
	"profile.js"
]
.map( function onEachScriptFile( scriptFile ){
	return path.resolve( ".", "client", "script", scriptFile );
} )
.filter( function onEachScriptFile( scriptFile ){
	return fs.existsSync( scriptFile );
} );

exports.scriptList = scriptList;

