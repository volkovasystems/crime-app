var Crime = angular.module( "Crime", [ 
	"App",
	"Login",
	"Event",
	"MapLocate" 
] );

Crime
	.run( [
		"Login",
		function onRun( Login ){
			//: @todo: Initiate checking if the user already logs in.
			//Login.
		}
	] )

	.run( [
		"$http",
		"$rootScope",
		"Event",
		function onRun( $http, $rootScope, Event ){
			Event( $rootScope );

			//: @todo: Get the server list from the static server.
			$http.get( "/get/all/api/endpoint" )
				.success( function onSuccess( data, status ){
					$rootScope.serverSet = data;
				} )
				.error( function onError( data, status ){
					//: @todo: Do something on error.
				} );
		}
	] )

	.factory( "resolveURL", [
		function factory( ){
			var resolveURL = function resolveURL( serverData ){
				if( window.production ){
					serverData.joinPath = function joinPath( pathString ){
						return [ "http://", serverData.remote, pathString ].join( "/" );
					};

				}else if( window.development ){
					serverData.joinPath = function joinPath( pathString ){
						return [ 
							"http://",
							[
								serverData.host,
								serverData.port
							].join( ":" ), 
							pathString
						].join( "/" );
					};
				}

				return serverData;
			};

			return resolveURL;
		} 
	] )

	.factory( "getUserServerData", [
		"$rootScope",
		"resolveURL",
		function factory( $rootScope, resolveURL ){
			var getUserServerData = function getUserServerData( ){
				return resolveURL( $rootScope.serverSet.user );
			};

			return getUserServerData;
		}
	] )

	.factory( "getReportServerData", [
		"$rootScope",
		"resolveURL",
		function factory( $rootScope, resolveURL ){
			var getReportServerData = function getReportServerData( ){
				return resolveURL( $rootScope.serverSet.report );
			};

			return getReportServerData;
		}
	] );