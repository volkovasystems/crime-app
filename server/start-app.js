var argv = require( "yargs" ).argv;
var http = require( "http" );

exports.startApp = function startApp( app, port, host ){
	var server = http.createServer( app );
	
	server.on( "listening",
		function onListening( ){
			console.log( "server is now listening" );
		} );

	if( argv.production ){
		server.listen( port );
		
	}else{
		server.listen( port, host );	
	}
};