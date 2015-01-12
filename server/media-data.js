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

			/*:
				imageID does not change so what we can do here is,

					hash = XXH( filename ) + XXH( timestamp ) + SHA( imageData );
					imageReference = hash
					imageID = uuid + hash

				imageReference will be used to get the image because
					it tends to change.
			*/
			var image = mongoose.Schema( {
				"imageID": String,
				"imageReference": String,
				"imageHash": String,
				"imageRawData": String,
				"imageURL": String,
				"imageTimestamp": Date,
				"imageBoundReference": [String]
			} );

			mongoose.model( "Image", image );
		}
	} );