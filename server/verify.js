var _ = require( "lodash" );
var argv = require( "yargs" ).argv;
var async = require( "async" );
var unirest = require( "unirest" );
var util = require( "util" );

var serverSet = require( "./package.js" ).packageData.serverSet;

var resolveURL = require( "./resolve-url.js" ).resolveURL;
resolveURL( serverSet.user );
var userServer = serverSet.user;

exports.verify = function verify( app ){
	app.all( "/api/:accessID/*",
		function verifyAccessID( request, response, next ){
			var accessID = request.get( "Administrator-Access-ID" ) || 
				request.param( "adminAccessID" ) || 
				request.param( "accessID" );

			//: @todo: Transform this to use async.series.
			var rootResponse = response;

			if( !_.isEmpty( request.session.userData )
				&& request.session.accessID === accessID )
			{
				var requestEndpoint = userServer.joinPath( "verify/access/:accessID" );

				requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

				unirest
					.get( requestEndpoint )
					.end( function onResponse( response ){
						var status = response.body.status;

						if( status == "failed" ){
							rootResponse
								.status( 200 )
								.json( {
									"status": "failed",
									"data": response.body.data
								} );

						}else if( status == "error" ){
							var error = new Error( response.body.data );

							rootResponse
								.status( 500 )
								.json( {
									"status": "error",
									"data":error.message
								} );

						}else{
							next( );
						}
					} );

			}else{
				var requestEndpoint = userServer.joinPath( "api/:accessID/user/get" );

				requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

				unirest
					.get( requestEndpoint )
					.end( function onResponse( response ){
						if( !response.body ){
							var error = new Error( "no response from user server" );

							rootResponse
								.status( 500 )
								.json( {
									"status": "error",
									"data": error.message
								} );

							return;
						}

						var status = response.body.status;

						if( status == "failed" ){
							rootResponse
								.status( 200 )
								.json( {
									"status": "failed",
									"data": response.body.data
								} );

						}else if( status == "error" ){
							var error = new Error( response.body.data );

							rootResponse
								.status( 500 )
								.json( {
									"status": "error",
									"data": error.message
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
};