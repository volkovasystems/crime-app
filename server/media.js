require( "./media-data.js" );

var _ = require( "lodash" );
var async = require( "async" );
var argv = require( "yargs" ).argv;
var bodyParser = require( "body-parser" );
var express = require( "express" );
var mongoose = require( "mongoose" );
var session = require( "express-session" );
var unirest = require( "unirest" );
var util = require( "util" );

var serverSet = require( "./package.js" ).packageData.serverSet;
var serverData = serverSet.media;
var host = serverData.host;
var port = serverData.port;

var resolveURL = require( "./resolve-url.js" ).resolveURL;
resolveURL( serverSet.user );
var userServer = serverSet.user;

var app = express( );

require( "./configure-app.js" ).configureApp( app );

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

require( "./start-app.js" ).startApp( app, port, host );