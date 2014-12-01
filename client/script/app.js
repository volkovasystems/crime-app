angular
	.module( "App", [
		"angular-loading-bar",
		"ProgressBar",
		"Event",
		"Home",
		"Control",
		"ZoomControl",
		"LocateControl",
		"ReportControl",
		"ConfirmLocationControl",
		"Login",
		"Dashbar",
		"Search",
		"MapView",
		"MapLocate",
		"MapPointer",
		"MapMarker",
		"MapInfoPin",
		"ReportSpecifyCategory",
		"ReportIncidentDetail",
		"ReportFinal",
		"ReportList",
		"Notify",
		"ImageUpload"
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
					$rootScope.on( "control-rendered", 
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
				},
				function checkRender( callback ){
					$rootScope.on( "report-specify-category-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				},
				function checkRender( callback ){
					$rootScope.on( "report-incident-detail-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				},
				function checkRender( callback ){
					$rootScope.on( "report-final-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				},
				function checkRender( callback ){
					$rootScope.on( "report-list-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				},
				function checkRender( callback ){
					$rootScope.on( "notify-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				},
				function checkRender( callback ){
					$rootScope.on( "image-upload-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				},
				function checkRender( callback ){
					$rootScope.on( "zoom-control-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				},
				function checkRender( callback ){
					$rootScope.on( "locate-control-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				},
				function checkRender( callback ){
					$rootScope.on( "report-control-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				},
				function checkRender( callback ){
					$rootScope.on( "confirm-location-control-rendered", 
						function onRendered( ){ 
							callback( ); 
						} );
				}
			],
				function lastly( ){
					$rootScope.broadcast( "all-app-component-rendered" );

					$rootScope.finishLoading( );
				} );
		}
	] )

	.run( [
		"Event",
		"$rootScope",
		function onRun( Event, $rootScope ){
			//: Enable access to the root scope globally so that we can invoke it.
			if( window.development ){
				Event( $rootScope );

				window.rootScope = $rootScope;
			}
		}
	] );