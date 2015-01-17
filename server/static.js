var _ = require( "lodash" );
var argv = require( "yargs" ).argv;
var express = require( "express" );
var path = require( "path" );
var querystring = require( "querystring" );

var serverSet = require( "./package.js" ).packageData.serverSet;
var serverData = serverSet[ "static" ];
var host = argv.host ||  serverData.host;
var port = parseInt( argv.port || 0 ) || serverData.port;

var resolveURL = require( "./resolve-url.js" ).resolveURL;
resolveURL( serverSet.media );
var mediaServer = serverSet.media;

var app = express( );

require( "./configure-app.js" ).configureApp( app );

app.use( function onRequest( request, response, next ){
	console.log( request.path );

	next( );
} );

var staticDirectory = "build";
if( argv.production ){
	staticDirectory = "deploy";
}

app.get( "/action/:action/:actionType/:actionValue",
	function onAction( request, response ){
		var action = request.param( "action" );
		var actionType = request.param( "actionType" );
		var actionValue = request.param( "actionValue" );

		if( action == "get-image" &&
			actionType == "media" )
		{
			var redirectURL = mediaServer
				.joinPath( [
					"media/image",
					actionValue
				].join( "/" ) );

			response
				.redirect( 301, redirectURL );

		}else if( action == "render-template" && 
			actionType == "template" )
		{
			var template = querystring.unescape( new Buffer( actionValue, "base64" ).toString( ) );

			response
				.status( 200 )
				.type( "html" )
				.send( template );
				
		}else{
			response.redirect( "/" );
		}
	} );

app.get( "/get/all/api/endpoint",
	function onRequest( request, response ){
		response.status( 200 ).json( serverSet );
	} );

app.use( express[ "static" ]( staticDirectory ) );

app.use( function onRequest( request, response, next ){
	response.redirect( "/" );
} );

require( "./start-app.js" ).startApp( app, port, host );