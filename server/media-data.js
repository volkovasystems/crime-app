var serverData = require( "./package.js" ).packageData.serverSet.media;
var host = serverData.host;
var port = serverData.port;

var database = require( "./database.js" );

var mongoose = require( "mongoose" );

var databasePort = port + 2;

database.createDatabase( "Media", "mediadb", host, databasePort,
	function onDatabaseCreated( error, callback ){
		if( error ){
			console.error( error );

		}else{
			var connectionString = [ "mongodb://", host, ":", databasePort, "/", "mediadb" ].join( "" );

			mongoose.connect( connectionString );	

			var image = mongoose.Schema( {
				"imageID": String,
				"imageData": String,
				"imageURL": String
			} );

			mongoose.model( "Image", image );
		}
	} );