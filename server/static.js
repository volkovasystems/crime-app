var _ = require( "lodash" );
var argv = require( "yargs" ).argv;
var express = require( "express" );
var path = require( "path" );
var querystring = require( "querystring" );

var serverSet = require( "./package.js" ).packageData.serverSet;
var serverData = serverSet[ "static" ];
var host = argv.host ||  serverData.host;
var port = parseInt( argv.port || 0 ) || serverData.port;

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

app.use( function onRequest( request, response, next ){
	var template = request.get( "Template" ) || request.param( "template" );

	if( !_.isEmpty( template ) ){
		template = querystring.unescape( new Buffer( template, "base64" ).toString( ) );

		response
			.status( 200 )
			.type( "html" )
			.send( template );

	}else{
		next( );
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