var path = require( "path" );
var compression = require( "compression" );
var express = require( "express" );
var app = express( );

app.use( compression( ) );

app.use( express.static( path.join( __dirname, "deploy" ) ) );

app.use( function onRequest( request, response, next ){
	response.status( 404 )
			.send( "404: Welcome to the dark side." );
} );

app.listen( process.env.PORT || 8080 );