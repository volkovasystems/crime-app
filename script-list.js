var path = require( "path" );
var fs = require( "fs" );

var scriptList = [
	"label-data.js",
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
	"spinner.js",

	"home.js",
	"control.js",
	"notify.js",
	"login.js",
	"profile.js",
	"profile-setting.js",
	"search.js",
	"report.js",
	"report-list.js",
	"case-category-list.js",
	"image-upload.js",
	"dashbar.js",
	"app.js",

	"crime-app.js",
	"crime-icon.js",
	"crime-home.js",
	"crime-dashbar.js",
	"crime-login.js",
	"crime-profile.js",
	"crime-profile-setting.js",
	"crime-search.js",
	"crime-map-view.js",
	"crime-map-locate.js",
	"crime-map-pointer.js",
	"crime-map-marker.js",
	"crime-map-filter.js",
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

