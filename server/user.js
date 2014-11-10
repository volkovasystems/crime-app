var serverData = require( "./package.js" ).packageData.serverSet.user;
var host = serverData.host;
var port = serverData.port;

var util = require( "util" );

var argv = require( "yargs" ).argv;
var express = require( "express" );
var bodyParser = require( "body-parser" );
var app = express( );

var mongoose = require( "mongoose" );
require( "./user-data.js" );

var async = require( "async" );

app.use( bodyParser.json( ) );

/*:
	Solution taken from this:
	https://gist.github.com/cuppster/2344435
*/
if( !argv.production ){
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
}

app.all( "/api/:accessID/*",
	function verifyAccessID( request, response, next ){
		next( );		
	} );

app.get( "/api/:accessID/verify",
	function onUserVerify( request, response ){
		//: Bypass this first.
		//: @todo: Implement this by checking the access token based on the account type.
		mongoose.model( "User" )
			.where( { 
				"userAccountID": request.param( "userAccountID" ) 
			} )
			.or( {
				"userAccessID": request.param( "userAccessID" )
			} )
			.findOne( function callback( error, userData ){
				if( error ){
					response
						.status( 500 )
						.json( {
							"status": "error",
							"data": error.message
						} );

				}else if( userData ){
					response
						.status( 200 )
						.json( {
							"status": "success",
							"data": userData
						} );

				}else{
					response
						.status( 200 )
						.json( {
							"status": "failed"
						} );
				}
			} );
	} );

app.get( "/api/:accessID/user/get/all",
	function onUserGetAll( request, response ){

	} );

app.get( "/api/:accessID/user/get",
	function onUserGet( request, response ){

	} );

app.post( "/user/register",
	function onUserRegister( request, response ){
		async.waterfall( [
			function checkIfUserExists( callback ){
				mongoose.model( "User" )
					.findOne( { 
						"userAccountID": request.param( "userAccountID" ) 
					}, callback );
			},

			function tryLoggingIn( userData, callback ){
				if( userData ){
					response.redirect( "/user/login" );

					callback( true );

				}else{
					callback( );
				}
			},

			function processAccessID( callback ){
				var accessToken = request.param( "userAccountToken" );
				
				var hashedAccessID = new Buffer( accessToken ).toString( "base64" ).replace( /[^A-Za-z0-9]/g, "" );

				callback( null, hashedAccessID );
			},

			function registerUser( accessID, callback ){
				var newUser = new mongoose.model( "User" )( {
					"userID": request.param( "userID" ),
					"userState": "logged-in",
					"accessState": "pending",
					"accessID": accessID,
					"userAccountID": request.param( "userAccountID" ),
					"userAccountType": request.param( "userAccountType" ),
					"userAccountToken": request.param( "userAccountToken" ),
					"userDisplayName": request.param( "userDisplayName" ),
					"userProfileLink": request.param( "userProfileLink" ),
					"userProfileImageURL": request.param( "userProfileImageURL" ),
				} );

				userData.save( function onSave( error ){
					callback( error, accessID );
				} );
			}
		],
			function lastly( state, accessID ){
				if( typeof state == "boolean" ){
					//: Do something?

				}else if( state ){
					response
						.status( 500 )
						.json( {
							"status": "error",
							"data": state.message
						} );

				}else{
					var requestEndpoint = [ "api", accessID, "verify" ].join( "/" );

					response.redirect( requestEndpoint );

					unirest
						.get( requestEndpoint )
						.end( function onResponse( response ){
							var userData = response.body;

							request.session.userData = userData;

							request.session.userData.accessID = accessID;

							next( );
						} );
				}
			} );
	} );

app.post( "/user/login",
	function onUserLogin( request, response ){
		async.waterfall( [
			function checkIfUserExists( callback ){
				mongoose.model( "User" )
					.findOne( { 
						"userAccountID": request.param( "userAccountID" ) 
					}, callback );
			},

			function tryRegisterUser( userData, callback ){
				if( userData ){
					callback( null, userData );

				}else{
					callback( true );
				}
			},

			function loggedIn( userData, callback ){
				userData.userState = "logged-in";

				userData.userAccountType = request.param( "userAccountType" );
				
				userData.userAccountToken = request.param( "userAccountToken" );

				userData.userDisplayName = request.param( "userDisplayName" );

				userData.userProfileImageURL = request.param( "userProfileImageURL" );

				userData.save( callback );
			}
		],
			function lastly( state ){
				if( typeof state == "boolean" ){

				}if( state ){
					response
						.status( 500 )
						.json( {
							"status": "error",
							"data": error.message
						} );

				}else if( !error ){
					var accessToken = request.param( "userAccountType" );
				
					var hashedAccessID = new Buffer( accessToken ).toString( "base64" ).replace( /[^A-Za-z0-9]/g, "" );

					var requestEndpoint = [ "api", hashedAccessID, "verify" ].join( "/" );

					response.redirect( requestEndpoint );
				}
			} );
	} );

app.post( "/user/:accessID/logout",
	function onUserLogout( request, response ){

	} );

app[ "delete" ]( "/user/:accessID/delete",
	function onUserLogout( request, response ){

	} );

app.listen( port, host );