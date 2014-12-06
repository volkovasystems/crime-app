var _ = require( "lodash" );
var async = require( "async" );
var argv = require( "yargs" ).argv;
var bodyParser = require( "body-parser" );
var express = require( "express" );
var mandrill = require( "node-mandrill" );
var mongoose = require( "mongoose" );
var session = require( "express-session" );
var unirest = require( "unirest" );
var util = require( "util" );

require( "./app-data.js" );

var serverSet = require( "./package.js" ).packageData.serverSet;
var serverData = serverSet.app;
var host = serverData.host;
var port = serverData.port;

var resolveURL = require( "./resolve-url.js" ).resolveURL;
resolveURL( serverSet.user );
var userServer = serverSet.user;

resolveURL( serverSet.report );
var reportServer = serverSet.report;

var mandrillAPIKey = "wYKUVnkI5Dz5RLjJJpqeJQ";
if( argv.production ){
	mandrillAPIKey = "gHg2SnQaJFVo5eKiyfDWnQ";
}
mandrill = mandrill( mandrillAPIKey );

var administratorDefaultEMail = "admin@crimewatch.ph"

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
	response.header( "Access-Control-Allow-Headers", "Content-Type, Accept, Administrator-Access-ID" );
	response.header( "Access-Control-Max-Age", 10 );
	response.header( "Cache-Control", "no-cache, no-store, must-revalidate" );
	  
	if( "OPTIONS" == request.method.toUpperCase( ) ){
		response.sendStatus( 200 );

	}else{
		next( );
	}
} );

app.all( "/api/:accessID/*",
	function verifyAccessID( request, response, next ){
		var accessID = request.get( "Administrator-Access-ID" ) || 
			request.param( "adminAccessID" ) || 
			request.param( "accessID" );

		//: @todo: Transform this to use waterfall.
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

app.get( "/api/:accessID/category/get/all",
	function onCategoryGetAll( request, response ){
		var Category = mongoose.model( "Category" );

		async.waterfall( [
			function getAllCategory( callback ){
				Category.find( { }, 
					function onResult( error, categoryList ){
						if( error ){
							callback( error );

						}else if( _.isEmpty( categoryList ) ){
							callback( null, [ ] );

						}else{
							callback( null, categoryList );
						}
					} );
			}
		],
			function lastly( state, categoryList ){
				if( state instanceof Error ){
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
							"status": "success",
							"data": categoryList
						} );
				}
			} );
	} );

app.get( "/api/:accessID/category/get/:categoryID",
	function onCategoryGet( request, response ){

	} );

app.post( "/api/:accessID/category/add",
	function onCategoryAdd( request, response ){

	} );

app.post( "/api/:accessID/category/:categoryID/update",
	function onCategoryUpdate( request, response ){

	} );

app.post( "/api/:accessID/category/:categoryID/delete",
	function onCategoryDelete( request, response ){

	} );

app.post( "/api/:accessID/report/approve",
	function onReportAccept( request, response ){
		var accessID = request.param( "accessID" );

		var ReportState = mongoose.model( "ReportState" );

		async.waterfall( [
			function checkIfReportStateIsExisting( callback ){
				ReportState
					.findOne( { 
						"reportID": request.param( "reportID" ) 
					}, function onFound( error, reportStateData ){
						callback( error, reportStateData );
					} );
			},

			function trySavingReportState( reportStateData, callback ){
				if( _.isEmpty( reportStateData ) ){
					callback( "no-report-data" );

				}else{
					callback( null, reportStateData );
				}
			},

			function saveReportState( reportStateData, callback ){
				reportStateData.reportState = "approved";

				reportStateData.reportApprovalDate = Date.now( );

				reportStateData.save( function onSave( error ){
					setTimeout( function onTimeout( ){
						callback( error );
					}, 1000 );
				} );
			},

			function checkIfAdministrator( callback ){
				var userData = request.session.userData;

				var adminAccessID = request.param( "adminAccessID" );

				if( request.session.accessID == adminAccessID ){
					callback( null, adminAccessID );

				}else{
					callback( "invalid-administrator-privilege" );
				}
			},

			function getUserData( adminAccessID, callback ){
				var requestEndpoint = userServer.joinPath( "api/:accessID/user/get" );

				requestEndpoint = requestEndpoint.replace( ":accessID", accessID );
				console.log(requestEndpoint);
				unirest
					.get( requestEndpoint )
					.headers( { 
						"Administrator-Access-ID": adminAccessID 
					} )
					.end( function onResponse( response ){
						var status = response.body.status;

						if( status == "failed" ){
							callback( response.body.data );
							
						}else if( status == "error" ){
							var error = new Error( response.body.data );

							callback( error );

						}else{
							var userData = response.body.data;
							
							callback( null, adminAccessID, userData );
						}
					} );
			},

			function getReportData( adminAccessID, userData, callback ){
				var requestEndpoint = reportServer.joinPath( "api/:accessID/report/get/:reportID" );

				requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

				requestEndpoint = requestEndpoint.replace( ":reportID", request.param( "reportID" ) );

				unirest
					.get( requestEndpoint )
					.headers( { 
						"Administrator-Access-ID": adminAccessID 
					} )
					.end( function onResponse( response ){
						var status = response.body.status;

						if( status == "failed" ){
							callback( response.body.data );
							
						}else if( status == "error" ){
							var error = new Error( response.body.data );

							callback( error );

						}else{
							var reportData = response.body.data;
							
							callback( null, userData, reportData );
						}
					} );
			},

			function sendApproveReportEMail( userData, reportData, callback ){
				mandrill( "/messages/send", {
					"message": {
						"to": [
							{
								"email": userData.userEMail || userData.userAccountEMail, 
								"name": userData.userProfileName
							}
						],
						"from_email": administratorDefaultEMail,
						"subject": "CrimeWatch Report Approved",
						"text": "We just approved your report."
					}
				}, 
					function onSent( error ){
						if( error ){
							callback( error );

						}else{
							callback( );
						}
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

				}else{
					response
						.status( 200 )
						.json( {
							"status": "success"
						} );
				}
			} );
	} );

app.post( "/api/:accessID/report/reject",
	function onReportReject( request, response ){
		var accessID = request.param( "accessID" );

		var ReportState = mongoose.model( "ReportState" );

		async.waterfall( [
			function checkIfReportStateIsExisting( callback ){
				ReportState
					.findOne( { 
						"reportID": request.param( "reportID" ) 
					}, function onFound( error, reportStateData ){
						callback( error, reportStateData );
					} );
			},

			function trySavingReportState( reportStateData, callback ){
				if( _.isEmpty( reportStateData ) ){
					callback( "no-report-data" );

				}else{
					callback( null, reportStateData );
				}
			},

			function saveReportState( reportStateData, callback ){
				reportStateData.reportState = "rejected";

				reportStateData.reportRejectionDate = Date.now( );

				reportStateData.save( function onSave( error ){
					setTimeout( function onTimeout( ){
						callback( error );
					}, 1000 );
				} );
			},

			function checkIfAdministrator( callback ){
				var userData = request.session.userData;

				var adminAccessID = request.param( "adminAccessID" );

				if( request.session.accessID == adminAccessID ){
					callback( null, adminAccessID );

				}else{
					callback( "invalid-administrator-privilege" );
				}
			},

			function getUserData( adminAccessID, callback ){
				var requestEndpoint = userServer.joinPath( "api/:accessID/user/get" );

				requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

				unirest
					.get( requestEndpoint )
					.headers( { 
						"Administrator-Access-ID": adminAccessID 
					} )
					.end( function onResponse( response ){
						var status = response.body.status;

						if( status == "failed" ){
							callback( response.body.data );
							
						}else if( status == "error" ){
							var error = new Error( response.body.data );

							callback( error );

						}else{
							var userData = response.body.data;
							
							callback( null, adminAccessID, userData );
						}
					} );
			},

			function getReportData( adminAccessID, userData, callback ){
				var requestEndpoint = reportServer.joinPath( "api/:accessID/report/get/:reportID" );

				requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

				requestEndpoint = requestEndpoint.replace( ":reportID", request.param( "reportID" ) );

				unirest
					.get( requestEndpoint )
					.headers( { 
						"Administrator-Access-ID": adminAccessID 
					} )
					.end( function onResponse( response ){
						var status = response.body.status;

						if( status == "failed" ){
							callback( response.body.data );
							
						}else if( status == "error" ){
							var error = new Error( response.body.data );

							callback( error );

						}else{
							var reportData = response.body.data;
							
							callback( null, userData, reportData );
						}
					} );
			},

			function sendRejectReportEMail( userData, reportData, callback ){
				mandrill( "/messages/send", {
					"message": {
						"to": [
							{
								"email": userData.userEMail || userData.userAccountEMail, 
								"name": userData.userProfileName
							}
						],
						"from_email": administratorDefaultEMail,
						"subject": "CrimeWatch Report Rejected",
						"text": "Sorry we rejected your report."
					}
				}, 
					function onSent( error ){
						if( error ){
							callback( error );

						}else{
							callback( );
						}
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

				}else{
					response
						.status( 200 )
						.json( {
							"status": "success"
						} );
				}
			} );
	} );

app.post( "/api/:accessID/report/pending",
	function onReportPending( request, response ){
		var accessID = request.param( "accessID" );

		var ReportState = mongoose.model( "ReportState" );

		async.waterfall( [
			function checkIfReportStateIsExisting( callback ){
				ReportState
					.findOne( { 
						"reportID": request.param( "reportID" ) 
					}, function onFound( error, reportStateData ){
						callback( error, reportStateData );
					} );
			},

			function trySavingReportState( reportStateData, callback ){
				if( _.isEmpty( reportStateData ) ){
					callback( );

				}else{
					callback( "report-exists" );
				}
			},

			function saveReportState( callback ){
				var newReportState = new ReportState( {
					"reportID": 	request.param( "reportID" ),
					"reporterID": 	request.param( "reporterID" ),
					"reportState": 	"pending"
				} );

				newReportState.save( function onSave( error ){
					setTimeout( function onTimeout( ){
						callback( error );
					}, 1000 );
				} );
			},

			function getUserData( callback ){
				var requestEndpoint = userServer.joinPath( "api/:accessID/user/get" );

				requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

				unirest
					.get( requestEndpoint )
					.end( function onResponse( response ){
						var status = response.body.status;

						if( status == "failed" ){
							callback( response.body.data );
							
						}else if( status == "error" ){
							var error = new Error( response.body.data );

							callback( error );

						}else{
							var userData = response.body.data;
							
							callback( null, userData );
						}
					} );
			},

			function getReportData( userData, callback ){
				var requestEndpoint = reportServer.joinPath( "api/:accessID/report/get/:reportID" );

				requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

				requestEndpoint = requestEndpoint.replace( ":reportID", request.param( "reportID" ) );

				unirest
					.get( requestEndpoint )
					.end( function onResponse( response ){
						var status = response.body.status;

						if( status == "failed" ){
							callback( response.body.data );
							
						}else if( status == "error" ){
							var error = new Error( response.body.data );

							callback( error );

						}else{
							var reportData = response.body.data;
							
							callback( null, userData, reportData );
						}
					} );
			},

			function sendPendingReportEMail( userData, reportData, callback ){
				mandrill( "/messages/send", {
					"message": {
						"to": [
							{
								"email": userData.userEMail || userData.userAccountEMail, 
								"name": userData.userProfileName
							}
						],
						"from_email": administratorDefaultEMail,
						"subject": "CrimeWatch Report Pending",
						"text": "We have recieved your report, please wait for the approval."
					}
				}, 
					function onSent( error ){
						if( error ){
							callback( error );

						}else{
							callback( );
						}
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

				}else{
					response
						.status( 200 )
						.json( {
							"status": "success"
						} );
				}
			} );
	} );

if( argv.production ){
	app.listen( port );
	
}else{
	app.listen( port, host );	
}