var serverData = require( "./package.js" ).packageData.serverSet.app;
var host = serverData.host;
var port = serverData.port;

var database = require( "./database.js" );

var mongoose = require( "mongoose" );

var databasePort = port + 2;

database.createDatabase( "App", "appdb", host, databasePort,
	function onDatabaseCreated( error, callback ){
		if( error ){
			console.error( error );

		}else{
			var connectionString = [ "mongodb://", host, ":", databasePort, "/", "appdb" ].join( "" );

			mongoose.connect( connectionString );	

			var category = mongoose.Schema( {
				"categoryID": String,
				"categoryName": String,
				"categoryTitle": String,
				"categoryDescription": String,
				"categoryImageReference": String
			} );

			mongoose.model( "Category", category );

			var reportState = mongoose.Schema( {
				"reportID": String,
				"reportState": String,
				"reporterID": String,
				"reportApprovalDate": Date,
				"reportRejectionDate": Date
			} );

			mongoose.model( "ReportState", reportState );
		}
	} );