var childprocess = require( "child_process" );

var fs = require( "fs" );

var path = require( "path" );

var async = require( "async" );

var util = require( "util" );

var _ = require( "lodash" );

var createDatabase = function createDatabase( databaseName, directoryPath, host, port, callback ){
	callback = callback || function callback( ){ };

	directoryPath = path.resolve( ".", directoryPath );

	var databaseLogPath = path.resolve( directoryPath, "database.log" );

	var errorLogPath = path.resolve( directoryPath, "error.log" );

	async.waterfall( [
		function checkDirectoryIfExisting( callback ){
			callback( null, fs.existsSync( directoryPath ) );
		},

		function createDirectory( directoryExists, callback ){
			if( !directoryExists ){
				childprocess.exec( [ "mkdir", directoryPath ].join( " " ),
					function onDirectoryCreated( ){
						callback( );
					} );

			}else{
				callback( );
			}
		},

		function createDatabaseServer( callback ){
			var task = childprocess
				.exec( [
					"mongod",
						"--port", port,
						"--bind_ip", host,
						"--dbpath", directoryPath,
						"--smallfiles",
					"&"
				].join( " " ) );

			task.stdout.on( "data",
				function onData( data ){
					if( _.contains( data.toString( ), "waiting for connections" ) ){
						if( !callback.isCalled ){
							callback.isCalled = true;
							callback( );
						}
					}

					console.log( data.toString( ) );

					fs.appendFileSync( databaseLogPath, data.toString( ) );
				} );

			task.stderr.on( "data",
				function onData( data ){
					if( !callback.isCalled ){
						callback.isCalled = true;
						callback( new Error( "error during mongod boot" ) );
					}

					console.error( data.toString( ) );
					
					fs.appendFileSync( errorLogPath, data.toString( ) );
				} )
		}
	],
		function lastly( error ){
			callback( error );
		} );
};
exports.createDatabase = createDatabase;
