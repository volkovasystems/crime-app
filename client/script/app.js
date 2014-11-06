angular
	.module( "App", [
		"ui.bootstrap", 
		"ProgressBar",
		"Event",
		"Home",
		"Forehead",
		"Dashbar",
		"Login",
		"Profile",
		"Search",
		"MapView",
		"MapLocate"
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
					$rootScope.on( "all-icon-set-requested", 
						function onRendered( ){ 
							callback( ); 
						} );
				},

				function checkRender( callback ){
					$rootScope.on( "home-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				},
				function checkRender( callback ){
					$rootScope.on( "dashbar-rendered", 
						function onRendered( ){ 
							callback( ); 
					} );
				},
				function checkRender( callback ){
					$rootScope.on( "forehead-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				},
				function checkRender( callback ){
					$rootScope.on( "login-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				},
				function checkRender( callback ){
					$rootScope.on( "profile-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				},
				function checkRender( callback ){
					$rootScope.on( "map-view-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				},
				function checkRender( callback ){
					$rootScope.on( "search-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				}
			],
				function lastly( ){
					$rootScope.broadcast( "show-default-page" );

					$rootScope.finishLoading( );
				} );
		}
	] );