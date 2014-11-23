var serverData = require( "./package.js" ).packageData.serverSet.user;
var host = serverData.host;
var port = serverData.port;

var database = require( "./database.js" );

var mongoose = require( "mongoose" );

var databasePort = port + 2;

database.createDatabase( "User", "userdb", host, databasePort,
	function onDatabaseCreated( error, callback ){
		if( error ){
			console.error( error );

		}else{
			var connectionString = [ "mongodb://", host, ":", databasePort, "/", "userdb" ].join( "" );

			mongoose.connect( connectionString );	

			var user = mongoose.Schema( {
				"userID": String,
				"userState": String,
				"accessState": String,
				"accessID": String,
				"userAccountID": String,
				"userAccountType": String,
				"userAccountToken": String,
				"userDisplayName": String,
				"userProfileLink": String,
				"userProfileImageURL": String,
				"userAccountCreationTime": Date
			} );

			mongoose.model( "User", user );
		}
	} );