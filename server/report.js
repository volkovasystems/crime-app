var serverSet = require( "./package.js" ).packageData.serverSet;
var serverData = serverSet.report;
var host = serverData.host;
var port = serverData.port;

var util = require( "util" );

var _ = require( "lodash" );
var argv = require( "yargs" ).argv;
var express = require( "express" );
var unirest = require( "unirest" );
var bodyParser = require( "body-parser" );
var session = require( "express-session" );
var app = express( );

var mongoose = require( "mongoose" );
require( "./report-data.js" );

var async = require( "async" );

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

var resolveURL = require( "./resolve-url.js" ).resolveURL;
resolveURL( serverSet.user );
var userServer = serverSet.user;

app.all( "/api/:accessID/*",
	function verifyAccessID( request, response, next ){
		var accessID = request.param( "accessID" );

		var requestEndpoint = userServer.joinPath( "api/:accessID/verify" );

		requestEndpoint = requestEndpoint.replace( ":accessID", accessID );

		console.log( requestEndpoint );

		if( !_.isEmpty( request.session.userData )
			&& request.session.userData.accessID === accessID )
		{
			next( );

		}else{
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

app.get( "/api/:accessID/report/get/all",
	function onReportGetAll( request, response ){
		var Report = mongoose.model( "Report" );
		
		Report
			.find( { 
				"reporterID": request.param( "reporterID" ) 
			}, function onResult( error, reportList ){
				if( error ){
					response
						.status( 500 )
						.json( {
							"status": "error",
							"data": error.message
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

app.post( "/api/:accessID/report/add",
	function onReportAdd( request, response ){
		var Report = mongoose.model( "Report" );

		async.waterfall( [
			function checkIfReportIsExisting( callback ){
				Report.findOne( { 
					"reportID": request.param( "reportID" ) 
				}, callback );
			},

			function trySavingReport( reportData, callback ){
				if( reportData ){
					callback( true );

				}else{
					callback( );
				}
			},

			function saveReport( callback ){
				var newReport = new Report( {
					"reportID": 			request.param( "reportID" ),
					"reportState": 			request.param( "reportState" ),
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

				newReport.save( callback );
			}
		],
			function lastly( state ){
				if( typeof state == "boolean" ){
					response
						.status( 200 )
						.json( {
							"status": "failed",
							"data": "report already exists"
						} );

				}else if( state ){
					response
						.status( 500 )
						.json( {
							"status": "error",
							"data": error.message
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

	} );

app[ "delete" ]( "/api/:accessID/report/:reportID/delete",
	function onReportAdd( request, response ){

	} );

if( argv.production ){
	app.listen( port );
	
}else{
	app.listen( port, host );	
}