var argv = require( "yargs" ).argv;
var path = require( "path" );
var compression = require( "compression" );
var express = require( "express" );

var serverSet = require( "./package.js" ).packageData.serverSet;
var serverData = serverSet[ "static" ];
var host = argv.host || serverData.host;
var port = parseInt( argv.port || 0 ) || serverData.port;

var app = express( );

app.use( compression( ) );

app.use( function onRequest( request, response, next ){
	console.log( request.path );

	next( );
} );

var staticDirectory = "build";
if( argv.production ){
	staticDirectory = "deploy";
}

app.get( "/get/all/api/endpoint",
	function onRequest( request, response ){
		response.status( 200 ).json( serverSet );
	} );

app.use( express[ "static" ]( staticDirectory ) );

app.use( function onRequest( request, response, next ){
	response.redirect( "/" );
} );

if( argv.production ){
	app.listen( port );
	
}else{
	app.listen( port, host );	
}