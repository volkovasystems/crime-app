var _ = require( "lodash" );
var async = require( "async" );
var argv = require( "yargs" ).argv;
var bodyParser = require( "body-parser" );
var express = require( "express" );
var mongoose = require( "mongoose" );
var session = require( "express-session" );
var unirest = require( "unirest" );
var util = require( "util" );

require( "./media-data.js" );

var serverSet = require( "./package.js" ).packageData.serverSet;
var serverData = serverSet.media;
var host = serverData.host;
var port = serverData.port;

var resolveURL = require( "./resolve-url.js" ).resolveURL;
resolveURL( serverSet.user );
var userServer = serverSet.user;

var app = express( );

app.use( bodyParser.json( ) );
app.use( session( { 
	"secret": "#3vtl+6gw)eew8vdonh(z86mvi)#cn4__isxqoy#(_svy2g2hy",
	"resave": true,
	"saveUninitialized": true
} ) );

/*:
	Solution taken from this:
	https://gist.github.com/cuppster/2344435
*/
app.use( function allowCrossDomain( request, response, next ){
	response.header( "Access-Control-Allow-Origin", request.headers.origin || "*" );
	response.header( "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS" );
	response.header( "Access-Control-Allow-Headers", "Content-Type, Accept" );
	response.header( "Access-Control-Max-Age", 10 );
	  
	if( "OPTIONS" == request.method.toUpperCase( ) ){
		response.sendStatus( 200 );

	}else{
		next( );
	}
} );

app.all( "/api/:accessID/*",
	function verifyAccessID( request, response, next ){
		var accessID = request.param( "accessID" );

		var requestEndpoint = userServer.joinPath( "api/:accessID/user/get" );

		requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

		if( !_.isEmpty( request.session.userData )
			&& request.session.accessID === accessID )
		{
			next( );

		}else{
			unirest
				.get( requestEndpoint )
				.end( function onResponse( response ){
					var status = response.body.status;

					if( status == "error" ){
						response
							.status( 500 )
							.json( {
								"status": "error",
								"data": response.body.data
							} );

					}else{
						var userData = response.body.data;
						
						request.session.userData = userData;

						request.session.accessID = accessID;
						
						next( );
					}
				} );	
		}
	} );

if( argv.production ){
	app.listen( port );
	
}else{
	app.listen( port, host );	
}