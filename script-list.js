var path = require( "path" );
var fs = require( "fs" );

var scriptList = [
	"event.js",
	"page-flow.js",
	"store.js",
	
	"icon.js",
	"title-input.js",
	"description-input.js",
	"map-preview.js",
	"progress-bar.js",
	"map-pointer.js",
	"map-locate.js",
	"map-view.js",

	"home.js",
	"forehead.js",
	"dashbar.js",
	"control.js",
	"login.js",
	"profile.js",
	"search.js",
	"report.js",
	"report-list.js",
	"app.js",

	"crime-app.js",
	"crime-icon.js",
	"crime-home.js",
	"crime-dashbar.js",
	"crime-login.js",
	"crime-profile.js",
	"crime-search.js",
	"crime-map-view.js",
	"crime-map-locate.js",
	"crime-map-pointer.js",
	"crime-report.js",
	"crime-report-list.js"
]
.map( function onEachScriptFile( scriptFile ){
	return path.resolve( ".", "client", "script", scriptFile );
} )
.filter( function onEachScriptFile( scriptFile ){
	return fs.existsSync( scriptFile );
} );

exports.scriptList = scriptList;

