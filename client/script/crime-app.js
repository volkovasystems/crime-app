var Crime = angular.module( "Crime", [ 
	"App",
	"Login",
	"Event",
	"MapLocate" 
] );

Crime
	.factory( "resolveURL", [
		function factory( ){
			var resolveURL = function resolveURL( serverData ){
				if( window.production ){
					serverData.joinPath = function joinPath( pathString ){
						return [ "http:/", serverData.remote, pathString ].join( "/" );
					};

				}else if( window.development ){
					serverData.joinPath = function joinPath( pathString ){
						return [ "http:/", [ serverData.host, serverData.port ].join( ":" ), pathString ].join( "/" );
					};
				}

				return serverData;
			};

			return resolveURL;
		} 
	] )

	.factory( "getStaticServerData", [
		"Event",
		"$rootScope",
		"resolveURL",
		function factory( Event, $rootScope, resolveURL ){
			Event( $rootScope );

			var getStaticServerData = function getStaticServerData( ){
				return resolveURL( $rootScope.serverSet.static );
			};

			$rootScope.subscribe( "get-static-server-data",
				function onGetStaticServerData( callback ){
					callback( null, getStaticServerData( ) );
				} );

			$rootScope.subscribe( "get-host-address",
				function onGetHostAddress( callback ){
					callback( null, getStaticServerData( ).joinPath( "" ) );
				} );

			return getStaticServerData;
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
	] )

	.factory( "getAppServerData", [
		"$rootScope",
		"resolveURL",
		function factory( $rootScope, resolveURL ){
			var getAppServerData = function getAppServerData( ){
				return resolveURL( $rootScope.serverSet.app );
			};

			return getAppServerData;
		}
	] )

	.run( [
		"$rootScope",
		"ProgressBar",
		"Event",
		function onRun( $rootScope, ProgressBar, Event ){
			ProgressBar( $rootScope );

			Event( $rootScope );
		
			async.parallel( [
				function initiateLoading( callback ){
					$rootScope.startLoading( );

					callback( );
				},

				function checkAllRequestedIconSet( callback ){
					$rootScope.on( "all-app-component-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				},

				function checkAllRequestedIconSet( callback ){
					$rootScope.on( "facebook-sdk-loaded", 
						function onRendered( ){ 
							callback( ); 
						} );
				}				
			],
				function lastly( ){
					$rootScope.publish( "all-component-loaded" );

					$rootScope.broadcast( "show-default-page" );

					$rootScope.finishLoading( );
				} );
		}
	] )

	.run( [
		function onRun( ){
			History.Adapter
				.bind( window, "statechange",
					function onStateChange( ){ 
						var State = History.getState( );
					} );
		}
	] )

	.run( [
		"Store",
		"Event",
		"ProgressBar",
		"$rootScope",
		"getStaticServerData",
		function onRun( 
			Store,
			Event,
			ProgressBar,
			$rootScope,
			getStaticServerData 
		){
			Store( $rootScope );

			ProgressBar( $rootScope );

			Event( $rootScope );

			$rootScope.subscribe( "all-component-loaded",
				function onAllComponentLoaded( ){
					async.waterfall( [
						function initiateLoading( callback ){
							$rootScope.startLoading( );

							callback( );
						},

						function verifyState( callback ){
							var uri = new URI( );

							if( uri.hasQuery( "has-logged-in" ) ){
								queryData = URI.parseQuery( uri.search( ) );

								if( queryData.state === $rootScope.getStoredValue( "footprint" ) ){
									$rootScope.publish( "set-logging-in-state" );

									callback( );

								}else{
									callback( "invalid-state" );
								}

							}else{
								callback( "has-not-logged-in" );
							}
						},

						function cleanBrowserState( callback ){
							$rootScope.dropStoredValue( "footprint" );

							History.pushState( null, null, "/" );

							callback( );
						},

						function initiateLoginCheck( callback ){
							$rootScope.publish( "initiate-login-check",
								function onInitiateLoginCheck( error, hasLoggedIn ){
									callback( error );
								} );
						}
					],
						function lastly( state ){

							$rootScope.finishLoading( );
						} );
				} );
		}
	] )

	.run( [
		"Store",
		"Event",
		"ProgressBar",
		"$rootScope",
		"getStaticServerData",
		function onRun( 
			Store,
			Event,
			ProgressBar,
			$rootScope,
			getStaticServerData 
		){
			Store( $rootScope );

			ProgressBar( $rootScope );

			Event( $rootScope );

			$rootScope.subscribe( "all-component-loaded",
				function onAllComponentLoaded( ){
					async.waterfall( [
						function initiateLoading( callback ){
							$rootScope.startLoading( );

							callback( );
						},

						function trySettingLogging( callback ){
							var uri = new URI( );

							if( uri.hasQuery( "has-logged-in" ) ){
								callback( "defer-logged-in" );	

							}else{
								$rootScope.publish( "set-logging-in-state" );

								callback( );
							}
						},

						function checkIfLoggedIn( callback ){
							$rootScope.publish( "check-if-logged-in",
								function onCheckIfLoggedIn( error, hasLoggedIn ){
									if( error ){
										$rootScope.publish( "set-logged-out-state" );
										callback( error );

									}else if( hasLoggedIn ){
										callback( );

									}else{
										$rootScope.publish( "set-logged-out-state" );
										callback( );
									}
								} );
						}
					],
						function lastly( state ){

							$rootScope.finishLoading( );
						} );
				} );
		}
	] )

	.run( [
		"$http",
		"$rootScope",
		"Event",
		function onRun( $http, $rootScope, Event ){
			Event( $rootScope );

			var requestEndpoint = "/get/all/api/endpoint";

			if( window.cordova ){
				requestEndpoint = [ staticData.STATIC_SERVER_URL, requestEndpoint ].join( "" );
			}

			//: @todo: Get the server list from the static server.
			$http.get( requestEndpoint )
				.success( function onSuccess( data, status ){
					$rootScope.serverSet = data;
				} )
				.error( function onError( data, status ){
					//: @todo: Do something on error.
				} );
		}
	] );