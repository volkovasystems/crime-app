var path = require( "path" );
var fs = require( "fs" );

var scriptList = [
	"event.js",
	"page-flow.js",
	"store.js",
	"transvg.js",
	
	"icon.js",
	"name-input.js",
	"title-input.js",
	"description-input.js",
	"path-input.js",
	"thumbnail-list.js",
	"map-preview.js",
	"progress-bar.js",
	"map-pointer.js",
	"map-locate.js",
	"map-view.js",
	"map-marker.js",

	"home.js",
	"forehead.js",
	"dashbar.js",
	"control.js",
	"notify.js",
	"login.js",
	"profile.js",
	"search.js",
	"report.js",
	"report-list.js",
	"case-category-list.js",
	"image-upload.js",
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
	"crime-map-marker.js",
	"crime-report.js",
	"crime-report-list.js",
	"crime-case-category-list.js",
	"crime-image-upload.js"
]
.map( function onEachScriptFile( scriptFile ){
	return path.resolve( ".", "client", "script", scriptFile );
} )
.filter( function onEachScriptFile( scriptFile ){
	return fs.existsSync( scriptFile );
} );

exports.scriptList = scriptList;

