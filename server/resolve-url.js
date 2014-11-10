var argv = require( "yargs" ).argv;

var resolveURL = function resolveURL( serverData ){
	if( argv.production ){
		serverData.joinPath = function joinPath( pathString ){
			return [ "http:/", serverData.remote, pathString ].join( "/" );
		};

	}else{
		serverData.joinPath = function joinPath( pathString ){
			return [ "http:/", [ serverData.host, serverData.port ].join( ":" ), pathString ].join( "/" );
		};
	}
};

exports.resolveURL = resolveURL;