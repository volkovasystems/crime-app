var path = require( "path" );
var express = require( "express" );
var app = express( );

app.use( express.compress( ) );

app.use( express.static( path.resolve( "crime-app/deploy" ) ) );

app.use( function onRequest( request, response, next ){
	response.send( 404, "404: Welcome to the dark side." );
} );

app.listen( process.env.PORT );