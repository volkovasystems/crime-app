require( "./media-data.js" );

var _ = require( "lodash" );
var async = require( "async" );
var argv = require( "yargs" ).argv;
var express = require( "express" );
var mongoose = require( "mongoose" );
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

app.post( "/api/:accessID/media/image/upload",
	function onMediaImageUpload( request, response ){
		var Image = mongoose.model( "Image" );

		async.waterfall( [
			function checkIfImageExists( callback ){
				var imageHash = request.param( "imageHash" );

				Image
					.findOne( { 
						"imageHash": imageHash
					}, function onFound( error, imageData ){
						callback( error, imageData );
					} );
			},

			function trySavingImage( imageData, callback ){
				if( _.isEmpty( imageData ) ){
					callback( );

				}else{
					callback( "image-exists" );
				}
			},

			function saveImage( callback ){
				var newImage = new Image( {
					"imageID": 			request.param( "imageID" ),
					"imageReference": 	request.param( "imageReference" ),
					"imageHash": 		request.param( "imageHash" ),
					"imageRawData": 	request.param( "imageRawData" ),
					"imageURL": 		request.param( "imageURL" ),
					"imageTimestamp":	request.param( "imageTimestamp" ),
					"imageBoundReference": request.param( "imageBoundReference" ),
				} );

				newImage.save( function onSave( error ){
					//: @todo: This is bad. But we want to ensure that the database already has the saved data.
					setTimeout( function onTimeout( ){
						callback( error );
					}, 1000 );
				} );
			}
		],
			function lastly( state ){
				if( state === "image-existing" ){
					response
						.status( 200 )
						.json( {
							"status": "failed",
							"data": state
						} );

				}else if( state instanceof Error ){
					response
						.status( 500 )
						.json( {
							"status": "error",
							"data": state.message
						} );

				}else{
					response
						.status( 200 )
						.json( {
							"status": "success"
						} );
				}
			} );
	} );

app.get( "/media/image/:imageReference",
	function onMediaImage( request, response ){
		var Image = mongoose.model( "Image" );

		var imageReference = request.param( "imageReference" );

		Image
			.findOne( { 
				"imageReference": imageReference
			}, function onFound( error, imageData ){
				if( error ){
					response
						.status( 500 )
						.json( {
							"status": "error",
							"data": state.message
						} );

				}else if( _.isEmpty( imageData ) ){
					response
						.status( 200 )
						.json( {
							"status": "failed",
							"data": "no-image"
						} );

				}else{
					response
						.status( 200 )
						.json( {
							"status": "success",
							"data": imageData
						} );
				}
			} );
	} );

require( "./start-app.js" ).startApp( app, port, host );