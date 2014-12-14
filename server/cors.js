var _ = require( "lodash" );
var argv = require( "yargs" ).argv;

var allowedOriginDomainPattern = /^localhost\:\d{4,5}$/;
if( argv.production ){
	allowedOriginDomainPattern = /^(https?\:\/\/)?[a-z]+\.crimewatch\.ph\/?$|^localhost\:\d{4,5}$/;
}

var serverSet = require( "./package.js" ).packageData.serverSet;

var publicDomainAddressList = _( serverSet )
		.map( function onEachServerData( serverData ){
			return [ serverData.host, serverData.port ].join( ":" );
		} )
		.compact( )
		.value( );

if( argv.production ){
	publicDomainAddressList = _( serverSet )
		.map( function onEachServerData( serverData ){
			return serverData.remote;
		} )
		.compact( )
		.union( publicDomainAddressList )
		.value( );
}

exports.cors = function cors( app ){
	/*:
		Solution taken from this:
		https://gist.github.com/cuppster/2344435
	*/
	app.use( function allowCrossDomain( request, response, next ){
		var allowedOriginURL = request.headers.origin || request.get( "Host" );

		console.log( "allowedOriginURL: " + allowedOriginURL );

		console.log( "publicDomainAddressList: " + publicDomainAddressList );

		if( !allowedOriginDomainPattern.test( allowedOriginURL ) &&
			!_.contains( publicDomainAddressList, allowedOriginURL ) )
		{
			response
				.status( 500 )
				.json( {
					"status": "error",
					"data": "origin is not allowed"
				} );

			return;
		}

		response.header( "Access-Control-Allow-Origin", allowedOriginURL );
		response.header( "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS" );
		response.header( "Access-Control-Allow-Headers", "Content-Type, Accept, Administrator-Access-ID" );
		response.header( "Access-Control-Max-Age", 10 );
		response.header( "Cache-Control", "no-cache, no-store, must-revalidate" );
		  
		if( "OPTIONS" == request.method.toUpperCase( ) ){
			response.sendStatus( 200 );

		}else{
			next( );
		}
	} );
};