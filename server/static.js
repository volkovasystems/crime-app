var serverSet = require( "./package.js" ).packageData.serverSet;
var serverData = serverSet[ "static" ];
var host = serverData.host;
var port = serverData.port;

var path = require( "path" );
var compression = require( "compression" );
var express = require( "express" );
var app = express( );

app.use( compression( ) );

app.use( function onRequest( request, response, next ){
	console.log( request.path );

	next( );
} );

app.use( express[ "static" ]( "deploy" ) );

app.use( function onRequest( request, response, next ){
	//: @todo: Serve 404 page properly.
	response.status( 404 )
			.send( "404: Welcome to the dark side." );
} );

app.get( "/get/all/api/endpoint",
	function onRequest( request, response ){
		response.status( 200 ).json( serverSet );
	} );

app.listen( port, host );