var serverData = require( "./package.js" ).packageData.serverSet.user;
var host = serverData.host;
var port = serverData.port;

var util = require( "util" );

var express = require( "express" );
var bodyParser = require( "body-parser" );
var app = express( );

var mongoose = require( "mongoose" );
require( "./report-data.js" );

var async = require( "async" );

app.use( bodyParser.json( ) );

app.all( "/api/:accessID/*",
	function verifyAccessID( request, response, next ){
		next( );
	} );

app.get( "/api/:accessID/report/get/all",
	function onReportGetAll( request, response ){
		var Report = mongoose.model( "Report" );
		Report
			.find( { 
				"userID": request.param( "userID" ) 
			}, function onResult( error, reportList ){

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

			},

			function saveReport( callback ){

			}
		],
			function lastly( ){

			} );
	} );

app.post( "/api/:accessID/report/:reportID/update",
	function onReportUpdate( request, response ){

	} );

app[ "delete" ]( "/api/:accessID/report/:reportID/delete",
	function onReportAdd( request, response ){

	} );

app.listen( port, host );