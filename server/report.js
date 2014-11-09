var serverData = require( "./package.js" ).packageData.serverSet.report;
var host = serverData.host;
var port = serverData.port;

var util = require( "util" );

var argv = require( "yargs" ).argv;
var express = require( "express" );
var bodyParser = require( "body-parser" );
var app = express( );

var mongoose = require( "mongoose" );
require( "./report-data.js" );

var async = require( "async" );

app.use( bodyParser.json( ) );

/*:
	Solution taken from this:
	https://gist.github.com/cuppster/2344435
*/
if( !argv.production ){
	app.use( function allowCrossDomain( request, response, next ){
		response.header( "Access-Control-Allow-Origin", "*" );
		response.header( "Access-Control-Allow-Methods", "GET,PUT,POST,DELETE" );
		response.header( "Access-Control-Allow-Headers", "Content-Type, Authorization" );
		  
		if( "OPTIONS" == request.method ){
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

app.get( "/api/:accessID/report/:reportID/get",
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