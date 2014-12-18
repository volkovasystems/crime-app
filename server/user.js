require( "./user-data.js" );

var _ = require( "lodash" );
var async = require( "async" );
var argv = require( "yargs" ).argv;
var express = require( "express" );
var fs = require( "fs" );
var mongoose = require( "mongoose" );
var unirest = require( "unirest" );
var util = require( "util" );

var serverSet = require( "./package.js" ).packageData.serverSet;
var serverData = serverSet.user;
var host = argv.host ||  serverData.host;
var port = parseInt( argv.port || 0 ) || serverData.port;

var resolveURL = require( "./resolve-url.js" ).resolveURL;
resolveURL( serverData );
var userServer = serverData;

var facebookAppID = require( "../client/script/static-data.js" ).staticData.DEVELOPMENT_FACEBOOK_APPLICATION_ID;
if( argv.production ){
	facebookAppID = require( "../client/script/static-data.js" ).staticData.PRODUCTION_FACEBOOK_APPLICATION_ID;
}

var mobileLoginTemplate = fs.readFileSync( "./server/login.html", { "encoding": "utf8" } );
mobileLoginTemplate = mobileLoginTemplate.replace( "@facebookAppID", facebookAppID );

resolveURL( serverSet[ "static" ] );
var staticServer = serverSet[ "static" ];
mobileLoginTemplate = mobileLoginTemplate.replace( /\@staticServerURL/g, staticServer.joinPath( "" ).replace( /\/$/, "" ) );

var app = express( );

require( "./configure-app.js" ).configureApp( app );

app.all( "/api/:accessID/*",
	function verifyAccessID( request, response, next ){
		async.waterfall( [
			function verifyAccessID( callback ){
				var accessID = request.get( "Administrator-Access-ID" ) || 
					request.param( "adminAccessID" ) || 
					request.param( "accessID" );

				var requestEndpoint = userServer.joinPath( "verify/access/:accessID", true );

				requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

				unirest
					.get( requestEndpoint )
					.end( function onResponse( response ){
						var status = response.body.status;

						if( status == "error" ){
							var error = new Error( response.body.data );

							callback( error );

						}else if( status == "failed" ){
							callback( "verify-failed", response.body.data )
							
						}else{
							callback( );
						}
					} );
			}
		],
			function lastly( state, message ){
				if( state === "verify-failed" ){
					response
						.status( 200 )
						.json( {
							"status": "failed",
							"data": message
						} );

				}else if( state instanceof Error ){
					response
						.status( 500 )
						.json( {
							"status": "error",
							"data": state.message
						} );

				}else{
					next( );
				}
			} );
	} );

app.get( "/verify/access/:accessID",
	function onUserVerify( request, response ){
		var User = mongoose.model( "User" );

		async.waterfall( [
			function getUserData( callback ){
				User
					.findOne( { 
						"accessID": request.param( "accessID" ) 
					}, function onFound( error, userData ){
						if( error ){
							callback( error );
						
						}else if( _.isEmpty( userData ) ){
							callback( "no-user-data" );

						}else{
							callback( null, userData );
						}
					} );
			},

			function verifyAccessIDFromThirdPartyService( userData, callback ){
				if( userData.userAccountType == "facebook" ){
					var requestEndpoint = [ 
						"https://graph.facebook.com/me",
						[ "access_token", userData.userAccountToken ].join( "=" )
					].join( "?" );

					console.log( requestEndpoint );

					unirest
						.get( requestEndpoint )
						.end( function onResponse( response ){
							if( !response.body ){
								callback( null, new Error( "no response from facebook" ), userData );

								return;
							}

							var responseData = JSON.parse( response.body );

							if( "error" in responseData ){
								var error = responseData.error;

								if( error.type == "OAuthException" ){
									callback( null, "access-token-invalid", userData );

								}else{
									callback( null, new Error( error.message ), userData );
								}

							}else{
								callback( null, null, userData );
							}
						} );
				
				}else{
					callback( "account-type-not-supported" );
				}
			},

			function trySavingVerification( verificationError, userData, callback ){
				if( verificationError ){
					userData.accessState = "rejected";

					userData.save( function onSave( error ){
						if( error ){
							error = new Error( JSON.stringify( [ error, verificationError ] ) );
						
						}else{
							error = verificationError;
						}

						callback( error );
					} );

				}else if( userData.accessState == "verified" ){
					callback( );

				}else{
					userData.accessState = "verified";

					userData.save( function onSave( error ){
						callback( error );
					} );
				}
			}
		],
			function lastly( state ){
				if( state === "account-type-not-supported" ){
					response
						.status( 200 )
						.json( {
							"status": "failed",
							"data": state
						} );

				}else if( state === "access-token-invalid" ){
					response
						.status( 200 )
						.json( {
							"status": "failed",
							"data": state
						} );

				}else if( state === "no-user-data" ){
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

app.get( "/api/:accessID/user/get/all",
	function onUserGetAll( request, response ){
		var User = mongoose.model( "User" );

		User
			.find( { }, 
				function onFindAll( error, userDataList ){				
					if( error ){
						response
							.status( 500 )
							.json( {
								"status": "error",
								"data": error.message
							} );

					}else if( _.isEmpty( userDataList ) ){
						response
							.status( 200 )
							.json( {
								"status": "failed",
								"data": [ ]
							} );

					}else{
						response
							.status( 200 )
							.json( {
								"status": "success",
								"data": userDataList
							} );
					}
				} );
	} );

app.get( "/api/:accessID/user/get",
	function onUserGet( request, response ){
		var User = mongoose.model( "User" );

		User
			.findOne( { 
				"accessID": request.param( "accessID" ) 
			}, function onFound( error, userData ){				
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

app.get( "/user/login/mobile",
	function onUserLoginMobile( request, response ){
		response
			.status( 200 )
			.type( "html" )
			.send( mobileLoginTemplate );
	} );

app.post( "/api/:accessID/user/update",
	function onUserUpdate( request, response ){
		var User = mongoose.model( "User" );

		async.waterfall( [
			function checkIfUserExists( callback ){
				User
					.findOne( { 
						"userID": request.param( "userID" ) 
					}, function onFound( error, userData ){
						callback( error, userData );
					} );
			},

			function trySavingUser( userData, callback ){
				if( _.isEmpty( userData ) ){
					callback( "no-user-data" );

				}else{
					callback( null, userData );
				}
			},

			function saveUser( userData, callback ){
				userData.userState = request.param( "userState" ) || userData.userState;

				userData.userEMail = request.param( "userEMail" ) || userData.userEMail;

				userData.accessState = request.param( "accessState" ) || userData.accessState;

				userData.accessID = request.param( "accessID" ) || userData.accessID;

				userData.userAccountID = request.param( "userAccountID" ) || userData.userAccountID;

				userData.userAccountType = request.param( "userAccountType" ) || userData.userAccountType;
				
				userData.userAccountToken = request.param( "userAccountToken" ) || userData.userAccountToken;

				userData.userAccountEMail = request.param( "userAccountEMail" ) || userData.userAccountEMail;

				userData.userDisplayName = request.param( "userDisplayName" ) || userData.userDisplayName;

				userData.userProfileName = request.param( "userProfileName" ) || userData.userProfileName;

				userData.userProfileLink = request.param( "userProfileLink" ) || userData.userProfileLink;

				userData.userProfileImageURL = request.param( "userProfileImageURL" ) || userData.userProfileImageURL;

				userData.userUpdateTimestamp = request.param( "userUpdateTimestamp" ) || Date.now( );

				userData.save( function onSave( error ){
					//: @todo: This is bad. But we want to ensure that the database already has the saved data.
					setTimeout( function onTimeout( ){
						callback( error );
					}, 1000 );
				} );
			}
		],
			function lastly( state ){
				if( state === "no-user-data" ){
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

app.post( "/api/:accessID/user/delete",
	function onUserDelete( request, response ){

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
					"userID": 					request.param( "userID" ),
					"userState": 				"logged-in",
					"accessState": 				"pending",
					"accessID": 				accessID,
					"userAccountID": 			request.param( "userAccountID" ),
					"userAccountType": 			request.param( "userAccountType" ),
					"userAccountToken": 		request.param( "userAccountToken" ),
					"userAccountEMail": 		request.param( "userAccountEMail" ),
					"userAccountCreationTime": 	request.param( "userAccountCreationTime" ),
					"userProfileName": 			request.param( "userProfileName" ),
					"userProfileLink": 			request.param( "userProfileLink" ),
					"userProfileImageURL": 		request.param( "userProfileImageURL" )
				} );

				newUser.save( function onSave( error ){
					//: @todo: This is bad. But we want to ensure that the database already has the saved data.
					setTimeout( function onTimeout( ){
						callback( error, accessID );
					}, 1000 );
				} );
			},

			function verifyAccessID( accessID, callback ){
				//: @todo: Do this for security.
				callback( null, accessID );
			},

			function getUserData( accessID, callback ){
				var requestEndpoint = userServer.joinPath( "api/:accessID/user/get", true );

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

				userData.userAccountEMail = request.param( "userAccountEMail" );

				userData.userProfileName = request.param( "userProfileName" );

				userData.userProfileImageURL = request.param( "userProfileImageURL" );

				userData.save( function onSave( error ){
					//: @todo: This is bad. But we want to ensure that the database already has the saved data.
					setTimeout( function onTimeout( ){
						callback( error, accessID );
					}, 1000 );
				} );
			},

			function verifyAccessID( accessID, callback ){
				//: @todo: Do this for security.
				callback( null, accessID );
			},

			function getUserData( accessID, callback ){
				var requestEndpoint = userServer.joinPath( "api/:accessID/user/get", true );

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
		var User = mongoose.model( "User" );

		async.waterfall( [
			function checkIfUserExists( callback ){
				User
					.findOne( { 
						"accessID": request.param( "accessID" ) 
					}, function onFound( error, userData ){
						if( error ){
							callback( error );
						
						}else if( _.isEmpty( userData ) ){
							callback( "no-user-data" );

						}else{
							callback( null, userData );
						}
					} );
			},

			function logoutUser( userData, callback ){
				userData.userState = "logged-out";

				userData.accessState = "dropped";

				userData.save( function onSave( error ){
					//: @todo: This is bad. But we want to ensure that the database already has the saved data.
					setTimeout( function onTimeout( ){
						callback( error );
					}, 1000 );
				} );
			}
		],
			function lastly( state ){
				if( typeof state == "string" ){
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

				}else if( !_.isEmpty( userData ) ){
					response
						.status( 200 )
						.json( {
							"status": "success"
						} );
				}
			} );
	} );

require( "./start-app.js" ).startApp( app, port, host );