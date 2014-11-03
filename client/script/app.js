var Crime = angular.module( "Crime", [
	"ui.bootstrap", 
	"PageFlow", 
	"Event",
	"ProgressBar",
	"Dashbar"
] );

Crime
	.constant( "ROOT_ON_MAP_LOADED_REFERENCE", "root:on-map-loaded" )
	
	.constant( "ROOT_ON_LOGGED_IN_REFERENCE", "root:on-logged-in" )
	
	.run( [
		"$rootScope",
		"ProgressBar",
		"Event",
		"ROOT_ON_MAP_LOADED_REFERENCE",
		"ROOT_ON_LOGGED_IN_REFERENCE",
		function onRun( 
			$rootScope,
			ProgressBar,
			Event, 
			ROOT_ON_MAP_LOADED_REFERENCE,
			ROOT_ON_LOGGED_IN_REFERENCE 
		){
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
				}/*,
				function checkRender( callback ){
					$rootScope.on( "search-rendered", function onRendered( ){ callback( ); } );
				}
				
				function checkRender( callback ){
					$rootScope.on( "notify-rendered", function onRendered( ){ callback( ); } );
				},
				function checkRender( callback ){
					$rootScope.on( "locate-rendered", function onRendered( ){ callback( ); } );
				},
				
				function checkRender( callback ){
					$rootScope.on( "spinner-rendered", function onRendered( ){ callback( ); } );
				},
				function checkRender( callback ){
					$rootScope.on( "report-rendered", function onRendered( ){ callback( ); } );
				},
				function checkRender( callback ){
					$rootScope.on( "data-rendered", function onRendered( ){ callback( ); } );
				}*/
				
			],
				function lastly( ){
					$rootScope.broadcast( "show-default-page" );

					$rootScope.finishLoading( );
				} );
		}
	] );