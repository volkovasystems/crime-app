var argv = require( "yargs" ).argv;

var allowedOriginDomainPattern = /.+/;
if( argv.production ){
	allowedOriginDomainPattern = /crimewatch\.ph$/;
}

exports.cors = function cors( app ){
	/*:
		Solution taken from this:
		https://gist.github.com/cuppster/2344435
	*/
	app.use( function allowCrossDomain( request, response, next ){
		var allowedOriginURL = request.headers.origin;

		if( !allowedOriginDomainPattern.test( allowedOriginURL ) ){
			response
				.status( 500 )
				.json( {
					"status": "error",
					"data": "origin is not allowed"
				} );
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