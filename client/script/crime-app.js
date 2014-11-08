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
			/*$http.get( "/get/all/api/endpoint" )
				.success( function onSuccess( data, status ){
					//$rootScope.publish( "" )
				} )
				.error( function onError( data, status ){
						
				} );*/
		}
	] );