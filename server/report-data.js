var serverData = require( "package.js" ).packageData.serverSet.report;
var port = serverData.port;

var databasePort = port + 2;

var database = require( "./database.js" );

var mongoose = require( "mongoose" );
var report = mongoose.Schema( {
	"reportID": String
}, { "collection": "reports" } );

database.createDatabase( "Report", "../reportdb", databasePort,
	function onDatabaseCreated( error, callback ){
		if( error ){
			callback( error );

		}else{
			mongoose
				.createConnection( host, "reportdb", databasePort )
				.on( "error",
					function onDatabaseConnectionError( error ){
						callback( error );
					} )
				.once( "open",
					function onConnected( ){
						callback( null, mongoose.model( "Report", user ) );

						global.Report = database.Report;
					} );
		}
	} );