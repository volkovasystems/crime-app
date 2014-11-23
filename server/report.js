var _ = require( "lodash" );
var argv = require( "yargs" ).argv;
var async = require( "async" );
var bodyParser = require( "body-parser" );
var express = require( "express" );
var mongoose = require( "mongoose" );
var session = require( "express-session" );
var unirest = require( "unirest" );
var util = require( "util" );

require( "./report-data.js" );

var serverSet = require( "./package.js" ).packageData.serverSet;
var serverData = serverSet.report;
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

app.get( "/api/:accessID/report/get/all",
	function onReportGetAll( request, response ){
		var Report = mongoose.model( "Report" );

		async.waterfall( [
			function getUserData( callback ){
				var userData = request.session.userData;

				if( _.isEmpty( userData ) ){
					callback( new Error( "user cannot be identified" ) );

				}else{
					callback( null, userData );
				}			
			},

			function getAllReport( userData, callback ){
				Report
					.find( { 
						"reporterID": userData.userID 
					}, function onResult( error, reportList ){
						if( error ){
							callback( error );

						}else if( _.isEmpty( reportList ) ){
							callback( null, [ ] );

						}else{
							callback( null, reportList );
						}
					} );
			}
		],
			function lastly( state, reportList ){
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
							"data": reportList
						} );
				}
			} );
	} );

app.get( "/api/:accessID/report/get/:reportID",
	function onReportGet( request, response ){

	} );

app.get( "/api/:accessID/report/get/all/near",
	function onReportGetNear( request, response ){
		var Report = mongoose.model( "Report" );

		var latitude = request.param( "latitude" );

		var longitude = request.param( "longitude" );

		var distance = parseInt( request.param( "distance" ) || 0 ) || 500;

		console.log( "GET ALL NEAR: ", latitude, longitude );

		if( latitude && longitude ){
			Report
				.where( "reportLocation.coordinate" )
				.near( {
					"center": [ latitude, longitude ],
					"maxDistance": distance,
					"spherical": true
				} )
				.exec( function onResult( error, reportList ){
					if( error ){
						response
							.status( 500 )
							.json( {
								"status": "error",
								"data": error.message
							} );

					}else if( _.isEmpty( reportList ) ){
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
								"data": reportList
							} );
					}
				} );
		}
	} );

app.get( "/api/:accessID/report/get/all/near/:reporterID",
	function onReportGetNear( request, response ){
		var Report = mongoose.model( "Report" );

		var latitude = request.param( "latitude" );

		var longitude = request.param( "longitude" );

		var distance = parseInt( request.param( "distance" ) || 0 ) || 100;

		distance = ( distance / 1000 ) / 6371;

		if( latitude && longitude ){
			Report
				.find( {
					"reporterID": request.param( "reporterID" )
				} )
				.where( "reportLocation.coordinate" )
				//: @todo: This is buggy, if can change this to use GeoJSON, instead of legacy coordinates.
				.near( {
					"center": [ longitude, latitude ],
					"maxDistance": distance,
					"spherical": true
				} )
				.exec( function onResult( error, reportList ){
					if( error ){
						response
							.status( 500 )
							.json( {
								"status": "error",
								"data": error.message
							} );

					}else if( _.isEmpty( reportList ) ){
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
								"data": reportList
							} );
					}
				} );
		}
	} );

app.post( "/api/:accessID/report/add",
	function onReportAdd( request, response ){
		var Report = mongoose.model( "Report" );

		async.waterfall( [
			function checkIfReportIsExisting( callback ){
				Report
					.findOne( { 
						"reportID": request.param( "reportID" ) 
					}, function onFound( error, reportData ){
						callback( error, reportData );
					} );
			},

			function trySavingReport( reportData, callback ){
				if( _.isEmpty( reportData ) ){
					callback( );

				}else{
					callback( "report-existing" );
				}
			},

			function saveReport( callback ){
				var newReport = new Report( {
					"reportID": 			request.param( "reportID" ),
					"reportState": 			"pending",
					"reporterID": 			request.param( "reporterID" ),
					"reporterState": 		request.param( "reporterState" ),
					"reportTimestamp": 		request.param( "reportTimestamp" ),
					"reportLocation": 		request.param( "reportLocation" ),
					"reportMapImageURL": 	request.param( "reportMapImageURL" ),
					"reportTitle": 			request.param( "reportTitle" ),
					"reportDescription": 	request.param( "reportDescription" ),
					"reportCaseType": 		request.param( "reportCaseType" ),
					"reportAddress": 		request.param( "reportAddress" )
				} );

				newReport.save( function onSave( error ){
					//: @todo: This is bad. But we want to ensure that the database already has the saved data.
					setTimeout( function onTimeout( ){
						callback( error );
					}, 1000 );
				} );
			}
		],
			function lastly( state ){
				if( state === "report-existing" ){
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

app.post( "/api/:accessID/report/:reportID/update",
	function onReportUpdate( request, response ){
		var Report = mongoose.model( "Report" );

		async.waterfall( [
			function checkIfReportIsExisting( callback ){
				Report
					.findOne( { 
						"reportID": request.param( "reportID" ) 
					}, function onFound( error, reportData ){
						callback( error, reportData );
					} );
			},

			function trySavingReport( reportData, callback ){
				if( _.isEmpty( reportData ) ){
					callback( "redirect-report-add" );

				}else{
					callback( null, reportData );
				}
			},

			function saveReport( reportData, callback ){
				reportData.reportID = request.param( "reportID" ) || reportData.reportID;

				reportData.reportState = request.param( "reportState" ) || reportData.reportState;

				reportData.reporterID = request.param( "reporterID" ) || reportData.reporterID;
				
				reportData.reporterState = request.param( "reporterState" ) || reportData.reporterState;

				reportData.reportTimestamp = request.param( "reportTimestamp" ) || reportData.reportTimestamp;

				reportData.reportLocation = request.param( "reportLocation" ) || reportData.reportLocation;

				reportData.reportMapImageURL = request.param( "reportMapImageURL" ) || reportData.reportMapImageURL;
				
				reportData.reportTitle = request.param( "reportTitle" ) || reportData.reportTitle;

				reportData.reportDescription = request.param( "reportDescription" ) || reportData.reportDescription;
				
				reportData.reportCaseType = request.param( "reportCaseType" ) || reportData.reportCaseType;
			
				reportData.reportAddress = request.param( "reportAddress" ) || reportData.reportAddress;

				reportData.save( function onSave( error ){
					//: @todo: This is bad. But we want to ensure that the database already has the saved data.
					setTimeout( function onTimeout( ){
						callback( error );
					}, 1000 );
				} );
			}
		],
			function lastly( state ){
				if( state === "redirect-report-add" ){
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

				}else{
					response
						.status( 200 )
						.json( {
							"status": "success"
						} );
				}
			} );
	} );

app[ "delete" ]( "/api/:accessID/report/:reportID/delete",
	function onReportDelete( request, response ){

	} );

if( argv.production ){
	app.listen( port );
	
}else{
	app.listen( port, host );	
}