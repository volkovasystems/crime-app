var _ = require( "lodash" );
var async = require( "async" );
var argv = require( "yargs" ).argv;
var bodyParser = require( "body-parser" );
var express = require( "express" );
var mongoose = require( "mongoose" );
var session = require( "express-session" );
var unirest = require( "unirest" );
var util = require( "util" );

require( "./user-data.js" );

var serverData = require( "./package.js" ).packageData.serverSet.user;
var host = serverData.host;
var port = serverData.port;

var resolveURL = require( "./resolve-url.js" ).resolveURL;
resolveURL( serverData );
var userServer = serverData;

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
		next( );		
	} );

app.get( "/api/:accessID/verify",
	function onUserVerify( request, response ){
		//: Bypass this first.
		//: @todo: Implement this by checking the access token based on the account type.
		
	} );

app.get( "/api/:accessID/user/get/all",
	function onUserGetAll( request, response ){

	} );

app.get( "/api/:accessID/user/get",
	function onUserGet( request, response ){
		console.log( "USER GET", request.param( "accessID" ) );

		var User = mongoose.model( "User" );

		User
			.findOne( { 
				"accessID": request.param( "accessID" ) 
			}, function onFound( error, userData ){

				console.log( JSON.stringify( userData ) );
				
				if( error ){
					response
						.status( 500 )
						.json( {
							"status": "error",
							"data": error.message
						} );

				}else if( _.isEmpty( userData ) ){
					response
						.status( 200 )
						.json( {
							"status": "failed",
							"data": { }
						} );

				}else{
					response
						.status( 200 )
						.json( {
							"status": "success",
							"data": userData
						} );
				}
			} );
	} );

app.post( "/user/register",
	function onUserRegister( request, response ){
		var User = mongoose.model( "User" );

		async.waterfall( [
			function checkIfUserExists( callback ){
				User
					.findOne( { 
						"userAccountID": request.param( "userAccountID" ) 
					}, function onFound( error, userData ){
						callback( error, userData );
					} );
			},

			function tryLoggingIn( userData, callback ){
				if( _.isEmpty( userData ) ){
					callback( );

				}else{
					callback( "redirect-login" );
				}
			},

			function processAccessID( callback ){
				var accessToken = request.param( "userAccountToken" );
				
				var hashedAccessID = new Buffer( accessToken ).toString( "base64" ).replace( /[^A-Za-z0-9]/g, "" );

				callback( null, hashedAccessID );
			},

			function registerUser( accessID, callback ){
				var newUser = new User( {
					"userID": 				request.param( "userID" ),
					"userState": 			"logged-in",
					"accessState": 			"pending",
					"accessID": 			accessID,
					"userAccountID": 		request.param( "userAccountID" ),
					"userAccountType": 		request.param( "userAccountType" ),
					"userAccountToken": 	request.param( "userAccountToken" ),
					"userDisplayName": 		request.param( "userDisplayName" ),
					"userProfileLink": 		request.param( "userProfileLink" ),
					"userProfileImageURL": 	request.param( "userProfileImageURL" ),
				} );

				newUser.save( function onSave( error ){
					callback( error, accessID );
				} );
			},

			function verifyAccessID( accessID, callback ){
				//: @todo: Do this for security.
				callback( null, accessID );
			},

			function getUserData( accessID, callback ){
				var requestEndpoint = userServer.joinPath( "api/:accessID/user/get" );

				requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

				unirest
					.get( requestEndpoint )
					.end( function onResponse( response ){
						var status = response.body.status;

						if( status == "error" ){
							callback( new Error( response.body.data ) );

						}else{
							var userData = response.body.data;

							callback( null, accessID, userData );
						}
					} );
			},

			function saveToSession( accessID, userData, callback ){
				request.session.userData = userData;

				request.session.accessID = accessID;

				callback( null, userData );
			}
		],
			function lastly( state, userData ){
				if( state === "redirect-login" ){
					response
						.status( 200 )
						.json( {
							"status": "pending",
							"data": state
						} );

				}else if( state instanceof Error ){
					response
						.status( 500 )
						.json( {
							"status": "error",
							"data": state.message
						} );

				}else if( !_.isEmpty( userData ) ){
					response
						.status( 200 )
						.json( {
							"status": "success",
							"data": userData
						} );
				}
			} );
	} );

app.post( "/user/login",
	function onUserLogin( request, response ){
		var User = mongoose.model( "User" );

		async.waterfall( [
			function checkIfUserExists( callback ){
				User
					.findOne( { 
						"userAccountID": request.param( "userAccountID" ) 
					}, function onFound( error, userData ){
						callback( error, userData );
					} );
			},

			function tryRegisterUser( userData, callback ){
				if( _.isEmpty( userData ) ){
					callback( "redirect-register" );

				}else{
					callback( null, userData );
				}
			},

			function processAccessID( userData, callback ){
				var accessToken = request.param( "userAccountToken" );
				
				var hashedAccessID = new Buffer( accessToken ).toString( "base64" ).replace( /[^A-Za-z0-9]/g, "" );

				callback( null, userData, hashedAccessID );
			},

			function loggedIn( userData, accessID, callback ){
				userData.userState = "logged-in";

				userData.accessState = "pending";

				userData.accessID = accessID;

				userData.userAccountType = request.param( "userAccountType" );
				
				userData.userAccountToken = request.param( "userAccountToken" );

				userData.userDisplayName = request.param( "userDisplayName" );

				userData.userProfileImageURL = request.param( "userProfileImageURL" );

				userData.save( function onSave( error ){
					callback( error, accessID );
				} );
			},

			function verifyAccessID( accessID, callback ){
				//: @todo: Do this for security.
				callback( null, accessID );
			},

			function getUserData( accessID, callback ){
				var requestEndpoint = userServer.joinPath( "api/:accessID/user/get" );

				requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

				console.log( requestEndpoint );

				unirest
					.get( requestEndpoint )
					.end( function onResponse( response ){
						var status = response.body.status;

						if( status == "error" ){
							callback( new Error( response.body.data ) );

						}else{
							var userData = response.body.data;

							callback( null, accessID, userData );
						}
					} );
			},

			function saveToSession( accessID, userData, callback ){
				request.session.userData = userData;

				request.session.accessID = accessID;

				callback( null, userData );
			}
		],
			function lastly( state, userData ){
				if( state === "redirect-register" ){
					response
						.status( 200 )
						.json( {
							"status": "pending",
							"data": state
						} );

				}else if( state instanceof Error ){
					response
						.status( 500 )
						.json( {
							"status": "error",
							"data": state.message
						} );

				}else if( !_.isEmpty( userData ) ){
					response
						.status( 200 )
						.json( {
							"status": "success",
							"data": userData
						} );
				}
			} );
	} );

app.post( "/user/:accessID/logout",
	function onUserLogout( request, response ){

	} );

app[ "delete" ]( "/user/:accessID/delete",
	function onUserLogout( request, response ){

	} );

if( argv.production ){
	app.listen( port );
	
}else{
	app.listen( port, host );	
}