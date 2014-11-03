
var localData = { };
var sshConfigureOptionSet = { };
if( fs.existsSync( "./local.json" ) ){
	localData = JSON.parse( fs.readFileSync( "./local.json" ) );

	sshConfigureOptionSet = {
		"host": localData.remoteHost,
		"privateKey": fs.readFileSync( localData.privateKeyPath ),
		"passphrase": localData.privateKeyPassphrase,
		"username": localData.remoteUsername,
		"readyTimeout": 50000
	};
}

var sshCallback = function callback( error, channel, done ){
	channel.on( "exit",
		function onExit( ){
			done( );		
		} );
};

var sshEngine = function sshEngine( command, callback ){
	ssh.exec( {
		"command": command,
		"sshConfig": sshConfigureOptionSet
	}, function onCallback( error, channel ){
		sshCallback( error, channel, callback );
	} );
};

gulp.task( "upload-configure",
	function uploadTask( done ){
		sshEngine( localData.configure, done );
	} );

gulp.task( "upload-teleport",
	function uploadTask( done ){
		sshEngine( localData.teleport, done );
	} );

gulp.task( "upload-reconstruct",
	function uploadTask( done ){
		sshEngine( localData.reconstruct, done );
	} );

gulp.task( "upload-run",
	function uploadTask( done ){
		sshEngine( localData.run, done );
	} );

gulp.task( "upload",
	function uploadTask( done ){
		async.series( [
				function onProcess( callback ){
					childprocess.exec( "gulp upload-configure", callback )
						.stdout.on( "data",
							function onData( data ){
								console.log( data + "" );
							} );
				},

				function onProcess( callback ){
					childprocess.exec( "gulp upload-teleport", callback )
						.stdout.on( "data",
							function onData( data ){
								console.log( data + "" );
							} );
				},

				function onProcess( callback ){
					childprocess.exec( "gulp upload-reconstruct", callback )
						.stdout.on( "data",
							function onData( data ){
								console.log( data + "" );
							} );
				},

				function onProcess( callback ){
					childprocess.exec( "gulp upload-run", callback )
						.stdout.on( "data",
							function onData( data ){
								console.log( data + "" );
							} );
				}
			],
			function lastly( error ){
				done( error );
			} );
	} );





			