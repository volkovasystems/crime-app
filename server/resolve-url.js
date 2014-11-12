var argv = require( "yargs" ).argv;

var resolveURL = function resolveURL( serverData ){
	if( argv.production ){
		serverData.joinPath = function joinPath( pathString, isInternal ){
			var hostName = serverData.remote;

			if( isInternal ){
				hostName = [ "localhost", serverData.port ].join( ":" );
			}

			return [ "http:/", hostName, pathString ].join( "/" );
		};

	}else{
		serverData.joinPath = function joinPath( pathString ){
			return [ "http:/", [ serverData.host, serverData.port ].join( ":" ), pathString ].join( "/" );
		};
	}
};

exports.resolveURL = resolveURL;