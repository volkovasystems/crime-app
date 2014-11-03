var serverData = require( "package.js" ).packageData.serverSet.report;
var host = serverData.host;
var port = serverData.port;

var express = require( "express" );
var app = express( );

require( "./report-data.js" );

app.all( "/api/:accessID/*",
	function verifyAccessID( request, response, next ){

	} );

app.get( "/api/:accessID/report/get/all",
	function onReportGetAll( request, response ){

	} );

app.get( "/api/:accessID/report/:reportID/get",
	function onReportGet( request, response ){

	} );

app.post( "/api/:accessID/report/add",
	function onReportAdd( request, response ){

	} );

app.post( "/api/:accessID/report/:reportID/update",
	function onReportUpdate( request, response ){

	} );

app[ "delete" ]( "/api/:accessID/report/:reportID/delete",
	function onReportAdd( request, response ){

	} );

app.listen( port, host );