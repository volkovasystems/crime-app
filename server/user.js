var serverData = require( "./package.js" ).packageData.serverSet.user;
var host = serverData.host;
var port = serverData.port;

var util = require( "util" );

var express = require( "express" );
var bodyParser = require( "body-parser" );
var app = express( );

var mongoose = require( "mongoose" );
require( "./user-data.js" );

var async = require( "async" );

app.use( bodyParser.json( ) );

app.all( "/api/:accessID/*",
	function verifyAccessID( request, response, next ){
		
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
						"userID": request.param( "userID" ) 
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

			function registerUser( callback ){
				var newUser = new mongoose.model( "User" )( {
					"userID": request.param( "userID" ),
					"userState": "logged-in",
					"userAccountType": request.param( "userAccountType" ),
					"userAccountToken": request.param( "userAccountToken" ),
					"userDisplayName": request.param( "userDisplayName" ),
					"userProfileLink": request.param( "userProfileLink" ),
					"userProfileImageURL": request.param( "userProfileImageURL" ),
				} );

				userData.save( callback );
			}
		],
			function lastly( error ){
				if( error instanceof Error ){
					response
						.status( 500 )
						.json( {
							"status": "error",
							"data": error.message
						} );

				}else if( !error ){
					response
						.status( 200 )
						.json( {
							"status": "success"
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
						"userID": request.param( "userID" ) 
					}, callback );
			},

			function tryRegisterUser( userData, callback ){
				if( userData ){
					callback( null, userData );

				}else{
					response.redirect( "/user/register" );

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
			function lastly( error ){
				if( error instanceof Error ){
					response
						.status( 500 )
						.json( {
							"status": "error",
							"data": error.message
						} );

				}else if( !error ){
					response
						.status( 200 )
						.json( {
							"status": "success"
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

app.listen( port, host );