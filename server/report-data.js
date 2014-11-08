var serverData = require( "./package.js" ).packageData.serverSet.report;
var host = serverData.host;
var port = serverData.port;

var database = require( "./database.js" );

var mongoose = require( "mongoose" );

var databasePort = port + 2;

database.createDatabase( "Report", "reportdb", host, databasePort,
	function onDatabaseCreated( error, callback ){
		if( error ){
			console.error( error );

		}else{
			var connectionString = [ "mongodb://", host, ":", databasePort, "/", "reportdb" ].join( "" );

			mongoose.connect( connectionString );	

			var report = mongoose.Schema( {
				"reportID": String,
				"reportState": String,
				"reporterID": String,
				"reporterState": String,
				"reportTimestamp": Date,
				"reportLocation": {
					"latitude": Number,
					"longitude": Number,
					"zoom": Number
				},
				"reportTitle": String,
				"reportDescription": String,
				"reportCaseType": String,
				"reportMediaList": Array
			} );

			mongoose.model( "Report", report );
		}
	} );